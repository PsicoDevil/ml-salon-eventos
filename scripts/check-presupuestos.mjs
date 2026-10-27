// Pruebas de negocio sin dependencias nuevas ni escritura de datos de clientes.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const requirePackage = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
function load(relative) {
  const file = path.join(root, relative + ".ts");
  if (cache.has(file)) return cache.get(file).exports;
  const record = { exports: {} };
  cache.set(file, record);
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function("require", "module", "exports", source)((id) => id.startsWith("@/") ? load(id.slice(2)) : requirePackage(id), record, record.exports);
  return record.exports;
}
const { emptyQuote, calculateQuote, cents, quoteEconomicRows, quoteMessage, financingRows, money, AGE_POLICY } = load("lib/presupuestos");
const { quoteDocument } = load("lib/presupuesto-documento");
const { buildRecipientlessWhatsAppUrl, buildWhatsAppUrl } = load("lib/whatsapp");
const initial = emptyQuote();
for (const key of ["business", "under4", "children", "adults", "cardsMode", "cardsQuantity", "ticket"]) assert.equal(key in initial, false);
assert.equal(initial.cardsAmount, null); assert.equal(initial.financingAmount, null); assert.equal(initial.serviceAmount, ""); assert.equal(initial.installments, "none");
assert.equal(calculateQuote(initial).valid, false);
const sample = { ...emptyQuote(), client: "Cliente de prueba", event: "Cumpleaños", date: "2027-12-04", service: "experiencia-maria-luisa", includeService: true, guests: "120", cardsAmount: "150000", serviceAmount: "0" };
// A: tarjetas acordadas, cero explícito para el servicio.
const a = calculateQuote(sample);
assert.equal(a.valid, true); assert.equal(a.total, 15000000); assert.equal(a.financing, undefined);
assert.equal(calculateQuote({ ...sample, guests: "500" }).total, a.total);
assert.equal(calculateQuote({ ...sample, guests: "" }).valid, true);
assert.equal(calculateQuote({ ...sample, ticket: "99999", cardsQuantity: "9999", cardsMode: "calculated", under4: "20" }).total, a.total);
// B: un solo cargo por concepto; financiación reparte el mismo total en centavos.
const complete = { ...sample, serviceAmount: "20000", discount: "2000", extras: sample.extras.map((e, i) => i === 0 ? { ...e, amount: "8000" } : e.id === "espejo-magico" ? { ...e, amount: "0" } : e), installments: "3", financingAmount: "176000" };
const b = calculateQuote(complete);
assert.equal(b.valid, true); assert.equal(b.total, 17600000);
assert.equal(quoteEconomicRows(b).reduce((sum, row) => sum + row.amount, 0), b.total);
assert.equal(b.financing.regular, 5866667); assert.equal(b.financing.last, 5866666);
assert.equal(b.financing.regular * 2 + b.financing.last, b.total);
for (const installments of ["3", "6", "12"]) {
  const result = calculateQuote({ ...complete, installments });
  assert.equal(result.total, b.total);
  assert.equal(result.financing.regular * (Number(installments) - 1) + result.financing.last, b.total);
  for (let value = 0; value < 50; value++) {
    const small = calculateQuote({ ...sample, cardsAmount: (value / 100).toFixed(2), installments });
    assert.equal(small.financing.regular * (Number(installments) - 1) + small.financing.last, value);
    assert.ok(small.financing.last >= 0 && small.financing.regular >= 0);
  }
}
// C: sin tarjetas confirmado; D: un vacío no equivale a cero.
const withoutCards = { ...sample, cardsNotApplicable: true, cardsAmount: "0", serviceAmount: "100000", guests: "" };
assert.equal(calculateQuote(withoutCards).total, 10000000); assert.equal(calculateQuote(withoutCards).valid, true);
assert.equal(calculateQuote({ ...withoutCards, cardsAmount: "" }).cards, 0);
assert.equal(calculateQuote({ ...withoutCards, cardsAmount: "1" }).cards, 0);
for (const key of ["cardsAmount", "serviceAmount"]) {
  const result = calculateQuote({ ...sample, [key]: "", installments: "3" });
  assert.equal(result.amountsReady, false); assert.equal(result.financing, undefined); assert.ok(result.errors[key]);
  assert.ok(quoteMessage({ ...sample, [key]: "" }).includes("Total: Pendiente"));
}
assert.equal(cents("123,45"), 12345); assert.equal(cents("123.45"), 12345);
for (const key of ["cardsAmount", "serviceAmount", "discount"]) for (const value of ["-1", "abc", "Infinity", "1e3", "0.001", "1.000,25", "900719925474099100"]) assert.equal(calculateQuote({ ...sample, [key]: value }).valid, false);
for (const guests of ["-1", "1.5", "abc", "90071992547409910"]) assert.equal(calculateQuote({ ...sample, guests }).valid, false);
assert.equal(calculateQuote({ ...sample, date: "2027-02-30" }).valid, false);
assert.equal(calculateQuote({ ...sample, discount: "150001" }).valid, false);
assert.equal(calculateQuote({ ...sample, cardsAmount: "90071992547409.90", serviceAmount: "100" }).amountsReady, false);
assert.equal(calculateQuote({ ...sample, installments: "9" }).valid, false);
assert.equal(calculateQuote({ ...sample, extras: sample.extras.map((e, i) => i ? e : { ...e, amount: "" }) }).valid, true);
// A/B: cálculo inicial, ajuste persistente y retorno explícito al automático.
const automatic = { ...sample, cardsAmount: null, guests: "100", pricePerPerson: "120000" };
assert.equal(calculateQuote(automatic).cards, 1200000000);
assert.equal(calculateQuote(automatic).valid, true);
assert.equal(calculateQuote({ ...automatic, guests: "101" }).cards, 1212000000);
const adjusted = { ...automatic, cardsAmount: "10000000" };
assert.equal(calculateQuote(adjusted).cards, 1000000000);
assert.equal(calculateQuote({ ...adjusted, guests: "120", pricePerPerson: "130000" }).cards, 1000000000);
assert.equal(calculateQuote({ ...adjusted, cardsAmount: null }).cards, 1200000000);
assert.equal(calculateQuote({ ...automatic, guests: "" }).amountsReady, false);
assert.equal(calculateQuote({ ...automatic, pricePerPerson: "" }).amountsReady, false);
assert.equal(calculateQuote({ ...automatic, guests: "9007199254740990" }).amountsReady, false);
assert.equal(calculateQuote({ ...adjusted, guests: "", pricePerPerson: "" }).valid, true);
assert.equal(calculateQuote({ ...automatic, cardsNotApplicable: true }).cards, 0);
// D/E: financiación parcial y completa; nunca alteran el presupuesto.
const partial = { ...complete, financingAmount: "150000" };
const partialResult = calculateQuote(partial);
assert.equal(partialResult.total, 17600000);
assert.equal(partialResult.financing.total, 15000000);
assert.equal(partialResult.financing.regular, 5000000);
assert.equal(calculateQuote({ ...partial, serviceAmount: "50000" }).financing.total, 15000000);
const customFinance = { ...complete, financingAmount: "100000" };
assert.equal(calculateQuote({ ...customFinance, cardsAmount: "200000" }).financing.total, 10000000);
assert.equal(calculateQuote({ ...customFinance, cardsAmount: "200000", financingAmount: null }).financing.total, 22600000);
const example = { ...automatic, serviceAmount: "1000000", installments: "6", extras: automatic.extras.map((e, i) => i ? e : { ...e, amount: "200000" }) };
assert.equal(calculateQuote(example).total, 1320000000);
assert.equal(calculateQuote(example).financing.total, 1320000000);
assert.equal(calculateQuote(example).financing.regular, 220000000);
for (const financingAmount of ["", "-1", "abc", "0.001", "Infinity", "900719925474099100"]) {
  const result = calculateQuote({ ...complete, financingAmount });
  assert.equal(result.valid, false); assert.equal(result.financing, undefined);
  assert.equal(result.total, 17600000); assert.equal(result.amountsReady, true);
}
assert.equal(calculateQuote({ ...complete, financingAmount: "0" }).financing.total, 0);
assert.equal(calculateQuote({ ...complete, financingAmount: "", installments: "none" }).valid, true);
assert.equal(calculateQuote({ ...complete, financingAmount: "", installments: "none" }).financing, undefined);
assert.equal(calculateQuote({ ...complete, serviceAmount: "" }).financing, undefined);
for (const pricePerPerson of ["-1", "abc", "0.001", "900719925474099100"]) assert.equal(calculateQuote({ ...automatic, pricePerPerson }).valid, false);
// Los precios son la única activación: vacío/cero se omiten; positivos se suman una vez.
assert.equal("selected" in initial.extras[0], false);
assert.equal(b.extras.length, 1); assert.equal(b.extras[0].id, "pantalla-led"); assert.equal(b.extraTotal, 800000);
assert.equal(calculateQuote({ ...complete, extras: complete.extras.map(e => ({ ...e, amount: "" })) }).total, 16800000);
assert.equal(calculateQuote({ ...complete, extras: complete.extras.map(e => ({ ...e, amount: "0" })) }).extraTotal, 0);
assert.equal(calculateQuote({ ...complete, extras: complete.extras.map(e => e.id === "pantalla-led" ? { ...e, amount: "9000" } : e) }).total, 17700000);
for (const amount of ["-1", "abc", "0.001", "Infinity", "900719925474099100"]) {
  const invalidExtra = calculateQuote({ ...sample, installments: "3", extras: sample.extras.map((e, i) => i ? e : { ...e, amount }) });
  assert.equal(invalidExtra.valid, false); assert.equal(invalidExtra.amountsReady, false); assert.equal(invalidExtra.financing, undefined);
}
// Especificación consolidada C–F/J: servicio optativo y total final reemplazable.
assert.equal(initial.includeService, false); assert.equal(initial.finalAmount, null);
const excludedService = { ...complete, includeService: false };
assert.equal(calculateQuote(excludedService).total, 15600000);
assert.equal(quoteEconomicRows(calculateQuote(excludedService)).some(row => row.key === "service"), false);
assert.equal(calculateQuote({ ...excludedService, serviceAmount: "" }).valid, true);
assert.equal(calculateQuote({ ...excludedService, serviceAmount: "-1" }).valid, true);
assert.equal(quoteDocument(excludedService).sections.flatMap(s => s.rows).some(r => r.label === "Precio del servicio"), false);
assert.equal(calculateQuote({ ...complete, serviceAmount: "" }).valid, false);
assert.equal(calculateQuote({ ...complete, serviceAmount: "0" }).valid, true);
const manual = { ...complete, finalAmount: "170000" };
const manualResult = calculateQuote(manual);
assert.equal(manualResult.automaticTotal, 17600000); assert.equal(manualResult.total, 17000000);
assert.equal(manualResult.isManualTotal, true); assert.equal(manualResult.manualMismatch, true);
assert.equal(manualResult.financing.total, 17600000); // conserva el importe de financiación editado.
assert.equal(calculateQuote({ ...manual, serviceAmount: "30000" }).total, 17000000);
assert.equal(calculateQuote({ ...manual, serviceAmount: "30000" }).automaticTotal, 18600000);
assert.equal(calculateQuote({ ...manual, serviceAmount: "30000", finalAmount: null }).total, 18600000);
assert.equal(calculateQuote({ ...manual, finalAmount: "176000" }).manualMismatch, false);
assert.equal(calculateQuote({ ...manual, finalAmount: "0" }).total, 0);
for (const finalAmount of ["", "-1", "abc", "0.001", "Infinity", "900719925474099100"]) {
  const result = calculateQuote({ ...complete, finalAmount });
  assert.equal(result.valid, false); assert.equal(result.amountsReady, false); assert.equal(result.financing, undefined);
}
assert.equal(calculateQuote({ ...manual, serviceAmount: "" }).amountsReady, false);
assert.equal(calculateQuote({ ...manual, cardsAmount: "" }).valid, false);
const manualDoc = quoteDocument(manual, manualResult);
const manualSummary = manualDoc.sections.find(s => s.title === "Desglose de referencia");
assert.equal(manualSummary.rows.find(r => r.total).label, "TOTAL FINAL ACORDADO");
assert.equal(manualSummary.rows.find(r => r.total).value, money(17000000));
assert.ok(manualSummary.note.includes("no se vuelven a sumar"));
assert.ok(quoteMessage(manual).includes(`Total final acordado: ${money(17000000)}`));
const presentation = quoteDocument(complete, b), plain = quoteDocument(sample, a);
assert.equal(presentation.name, "MARÍA LUISA");
const extrasSection = presentation.sections.find(s => s.title === "Adicionales con costo extra"); assert.equal(extrasSection.rows.length, 1); assert.equal(extrasSection.rows[0].label, "Pantalla LED"); assert.ok(!JSON.stringify(presentation).includes("Bar Glitter")); assert.ok(!JSON.stringify(presentation).includes("Fotocabina"));
assert.equal(presentation.sections.find(s => s.title === "Resumen de importes").rows.find(r => r.total).value, money(b.total));
assert.deepEqual(presentation.sections.find(s => s.title === "Financiación").rows.map(({ label, value }) => ({ label, value })), financingRows(b));
assert.ok(!plain.sections.some(s => s.title === "Financiación"));
assert.deepEqual(presentation.sections.find(s => s.title === "Política de edades").rows.map(r => r.value), [...AGE_POLICY]);
const serialized = JSON.stringify(presentation);
assert.ok(serialized.includes("Pantalla para proyección (incluida)"));
for (const removed of ["mapsUrl", "address", "Google Maps", "Bartolomé", "Precio unitario", "Tarjeta por persona", "Tarjetas a valor completo", "×"]) assert.ok(!serialized.includes(removed), removed);
assert.deepEqual(quoteDocument({ ...complete, event: "Casamiento" }).sections, presentation.sections);
const message = quoteMessage(complete), url = new URL(buildRecipientlessWhatsAppUrl(message));
assert.ok(message.includes(`Total: ${money(b.total)}`)); assert.ok(message.includes(money(b.financing.last)));
assert.equal(quoteMessage({ ...complete, business: "Nombre no autorizado" }), message);
assert.equal(url.pathname, "/"); assert.equal(url.searchParams.get("text"), message);
assert.equal(new URL(buildWhatsAppUrl()).pathname, "/5493834781774");
const originalDocument = globalThis.document;

// Financiación vinculada al total completo; las ediciones y tarjetas son importes independientes.
const fullBudget = { ...sample, cardsAmount: "9000000", includeVat: true, financingAmount: null, installments: "3", extras: sample.extras.map((e, i) => i === 0 ? { ...e, amount: "140000" } : e) };
const fullBudgetResult = calculateQuote(fullBudget);
assert.equal(fullBudgetResult.vatBase, 914000000);
assert.equal(fullBudgetResult.vat, 191940000);
assert.equal(fullBudgetResult.total, 1105940000);
assert.equal(fullBudgetResult.financingAmount, fullBudgetResult.total);
const cardsOnly = { ...fullBudget, financingAmount: String(fullBudgetResult.cards / 100) };
assert.equal(calculateQuote(cardsOnly).financing.total, 900000000);
assert.equal(calculateQuote({ ...fullBudget, includeVat: false }).financing.total, 914000000);
assert.equal(calculateQuote({ ...cardsOnly, includeVat: false }).financing.total, 900000000);
assert.equal(calculateQuote({ ...cardsOnly, finalAmount: "10000000" }).financing.total, 900000000);
const fullBudgetVariants = [
  fullBudget, cardsOnly,
  { ...fullBudget, includeVat: false },
  { ...fullBudget, discount: "40000" },
  { ...fullBudget, includeService: true, serviceAmount: "100000" },
  { ...fullBudget, includeService: false, serviceAmount: "100000" },
  { ...fullBudget, finalAmount: "10000000" },
  { ...fullBudget, extras: fullBudget.extras.map(e => ({ ...e, amount: "" })) },
  { ...fullBudget, financingAmount: "1234567.89" },
];
assert.equal(calculateQuote(fullBudgetVariants[3]).total, 1101100000);
assert.equal(calculateQuote(fullBudgetVariants[4]).total, 1118040000);
assert.equal(calculateQuote(fullBudgetVariants[5]).total, 1105940000);
assert.equal(calculateQuote(fullBudgetVariants[6]).total, 1210000000);
assert.equal(calculateQuote(fullBudgetVariants[7]).total, 1089000000);
for (const q of fullBudgetVariants) for (const installments of ["3", "6", "12"]) {
  const financed = { ...q, installments }, r = calculateQuote(financed);
  assert.equal(r.valid, true);
  assert.equal(r.financing.total, q.financingAmount === null ? r.total : cents(q.financingAmount));
  assert.equal(r.financing.regular * (r.financing.count - 1) + r.financing.last, r.financing.total);
  assert.equal(calculateQuote({ ...financed, installments: "none" }).total, r.total);
  const doc = quoteDocument(financed, r);
  assert.deepEqual(doc.sections.find(s => s.title === "Financiación").rows.map(({ label, value }) => ({ label, value })), financingRows(r));
  assert.equal(doc.sections.flatMap(s => s.rows).find(row => row.total).value, money(r.total));
  const text = quoteMessage(financed, r);
  for (const row of financingRows(r)) assert(text.includes(`${row.label}: ${row.value}`));
  assert(text.includes(money(r.total)));
}

// IVA opcional confirmado: centavos exactos, descuento previo y financiación independiente.
assert.equal(emptyQuote().includeVat, false);
const taxable = { ...complete, includeVat: true }, taxed = calculateQuote(taxable);
assert.equal(taxed.vatBase, 17600000); assert.equal(taxed.vat, 3696000); assert.equal(taxed.total, 21296000);
assert.equal(taxed.automaticTotal, taxed.total); assert.deepEqual(taxed.financing, b.financing);
assert.equal(calculateQuote({ ...taxable, includeVat: false }).total, b.total);
const taxedManual = { ...taxable, finalAmount: "170000" }, taxedManualResult = calculateQuote(taxedManual);
assert.equal(taxedManualResult.vatBase, 17000000); assert.equal(taxedManualResult.vat, 3570000); assert.equal(taxedManualResult.total, 20570000);
assert.deepEqual(taxedManualResult.financing, taxed.financing);
assert.equal(calculateQuote({ ...taxable, finalAmount: String(taxed.automaticBase / 100) }).total, taxed.total);
for (const [input, expectedVat] of [["0", 0], ["0.01", 0], ["0.03", 1], ["1.50", 32]]) {
  const r = calculateQuote({ ...sample, cardsAmount: input, includeVat: true });
  assert.equal(r.vat, expectedVat); assert.equal(r.total, r.vatBase + r.vat);
}
assert.equal(calculateQuote({ ...sample, includeVat: true, cardsAmount: "90071992547409.90" }).valid, false);
for (const [q, r] of [[taxable, taxed], [taxedManual, taxedManualResult]]) {
  const rows = quoteEconomicRows(r); assert.equal(rows.filter(row => row.key === "vat").length, 1);
  assert.equal(rows.find(row => row.key === "vat").amount, r.vat);
  const doc = quoteDocument(q, r), summary = doc.sections.find(section => /Resumen de importes|Desglose de referencia/.test(section.title));
  assert.equal(summary.rows.find(row => row.label === "IVA (21 %)").value, money(r.vat));
  assert.equal(summary.rows.find(row => row.total).value, money(r.total));
  const text = quoteMessage(q, r); assert(text.includes(`IVA (21 %): ${money(r.vat)}`)); assert(text.includes(money(r.total)));
}
const extraQuote = { ...sample, extras: sample.extras.map(extra => extra.id === "volcan-chispas" ? { ...extra, amount: "4500" } : extra) };
assert(emptyQuote().extras.some(extra => extra.id === "volcan-chispas" && extra.amount === ""));
assert(emptyQuote().extras.some(extra => extra.id === "espejo-magico"));
assert.equal(calculateQuote(extraQuote).total, 15450000);
const { planes, bebidas, catering } = load("data/servicios");
assert(!planes[0].features.some(text => /vajilla|mantelería/i.test(text)));
assert(planes[1].features.some(text => text.includes("Barra de tragos")));
assert.equal(planes[1].selectionName, "Servicio Completo");
for (const item of ["Cazuelas", "Sándwiches", "Empanadas", "Chipá", "Jesuitas"]) assert(catering[0].detalle.toLowerCase().includes(item.toLowerCase()));
assert(catering[1].detalle.includes("Lomo, pollo o lomo de cerdo"));
assert(bebidas.some(text => text.includes("Fernet Branca") && text.includes("daiquiris")));
globalThis.document = { createElement: () => ({ getContext: () => ({ font: "", measureText: (text) => ({ width: text.length * 5.5 }) }) }) };
try {
  const { createQuotePdf } = load("lib/presupuesto-pdf");
  assert.throws(() => createQuotePdf({ ...complete, serviceAmount: "" }));
  for (const quote of [sample, complete, partial, automatic, withoutCards, manual, excludedService, taxable, taxedManual, extraQuote, ...fullBudgetVariants]) {
    const pdf = await createQuotePdf(quote).text();
    const decoded = pdf.replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
    assert.ok(decoded.replace(/\s/g, " ").includes(money(calculateQuote(quote).total).replace(/\s/g, " ")));
    assert.equal(decoded.includes("Financiación"), quote.installments !== "none");
    for (const row of financingRows(calculateQuote(quote))) assert(decoded.replace(/\s/g, " ").includes(row.value.replace(/\s/g, " ")));
    for (const removed of ["/Subtype /Link", "/Annots", "Google Maps", "Bartolomé", "Precio unitario", "Tarjetas a valor completo"]) assert.ok(!decoded.includes(removed), removed);
    assert.ok(decoded.includes("MARÍA LUISA")); assert.ok(decoded.includes("De 4 a 11 años"));
    if (quote.includeVat) { assert.equal((decoded.match(/IVA \(21 %\)/g) ?? []).length, 1); assert(decoded.replace(/\s/g, " ").includes(money(calculateQuote(quote).vat).replace(/\s/g, " "))); }
  }
} finally { if (originalDocument === undefined) delete globalThis.document; else globalThis.document = originalDocument; }
console.log("Presupuestos: casos A–K, IVA del 21 % sin duplicación, ejemplo $11.059.400, financiación vinculada al total o editable, cuotas exactas 3/6/12, adicionales, contenido comercial, PDF y WhatsApp aprobados.");
