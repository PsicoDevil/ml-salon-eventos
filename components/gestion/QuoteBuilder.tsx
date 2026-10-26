"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Container from "@/components/ui/Container";
import QuoteDocument from "@/components/gestion/QuoteDocument";
import { planes } from "@/data/servicios";
import { EVENT_TYPE_OPTIONS, buildRecipientlessWhatsAppUrl } from "@/lib/whatsapp";
import { calculateQuote, cents, emptyQuote, financingRows, money, quoteEconomicRows, quoteMessage, type Quote } from "@/lib/presupuestos";

const fieldClass = "mt-2 block min-h-12 w-full min-w-0 border border-ink/25 bg-white/60 px-3 py-3 text-base text-ink outline-none focus:border-gold";
const inputAmount = (value: number | undefined) => value === undefined ? "" : `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;

const actionClass = "inline-flex min-h-12 items-center justify-center border border-gold/50 bg-carbon px-5 py-3 text-center text-sm font-semibold text-ivory transition-colors hover:bg-carbon-2 disabled:cursor-not-allowed disabled:opacity-50";

function Group({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details open={open} className="border border-ink/15 bg-ivory p-5 sm:p-7"><summary className="cursor-pointer py-1 font-display text-2xl font-medium">{title}</summary><div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2">{children}</div></details>;
}

export default function QuoteBuilder() {
  const [quote, setQuote] = useState<Quote>(emptyQuote);
  const [attempted, setAttempted] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const revision = useRef(0);
  const result = calculateQuote(quote);
  const preparedMessage = message ?? quoteMessage(quote, result);

  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  const change = (key: keyof Quote, value: string | boolean | null) => {
    revision.current++;
    setQuote((current) => {
      const automatic = key === "cardsAmount" && current.cardsAmount === null ? calculateQuote(current).automaticCards : undefined;
      return { ...current, [key]: value,
      // Reescribir el mismo costo no constituye un ajuste: conservar el cálculo.
      ...(key === "cardsAmount" && typeof value === "string" && automatic !== undefined && cents(value) === automatic ? { cardsAmount: null } : {}),
      };
    });
    setPdfUrl(undefined); setMessage(null); setStatus("");
  };
  const changeExtra = (index: number, amount: string) => {
    revision.current++;
    setQuote((current) => ({ ...current, extras: current.extras.map((extra, i) => i === index ? { ...extra, amount } : extra) }));
    setPdfUrl(undefined); setMessage(null); setStatus("");
  };
  const field = (key: Exclude<keyof Quote, "extras" | "cardsNotApplicable" | "includeService">, label: string, options: { type?: string; required?: boolean; multiline?: boolean; hint?: string; numeric?: boolean; full?: boolean; maxLength?: number; disabled?: boolean; value?: string } = {}) => {
    const error = attempted ? result.errors[key] : undefined;
    const props = { id: `quote-${key}`, name: key, value: options.value ?? quote[key] ?? "", onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(key, event.target.value), className: fieldClass, "aria-invalid": !!error, "aria-describedby": error ? `error-${key}` : options.hint ? `hint-${key}` : undefined, required: options.required, disabled: options.disabled, maxLength: options.maxLength ?? (options.multiline ? 4000 : 120) };
    return <div className={`min-w-0 ${options.full ? "sm:col-span-2" : ""}`}><label htmlFor={props.id} className="text-sm font-semibold">{label}{options.required ? " *" : ""}</label>{options.multiline ? <textarea {...props} rows={3} /> : <input {...props} type={options.type ?? "text"} inputMode={options.numeric ? "decimal" : key === "guests" ? "numeric" : undefined} autoComplete="off" />}{options.hint && <p id={`hint-${key}`} className="mt-2 text-xs leading-relaxed text-ink/65">{options.hint}</p>}{error && <p id={`error-${key}`} className="mt-2 text-sm text-red-800">{error}</p>}</div>;
  };
  const validate = () => {
    setAttempted(true);
    if (!result.valid) {
      document.querySelectorAll<HTMLDetailsElement>('[role="form"] details').forEach((section) => { section.open = true; });
      setStatus("Revisá los campos señalados para corregirlos.");
      return false;
    }
    return true;
  };
  const makeFile = async () => {
    const { createQuotePdf, loadQuoteLogo } = await import("@/lib/presupuesto-pdf");
    const logo = await loadQuoteLogo();
    return new File([createQuotePdf(quote, logo)], "presupuesto-ml.pdf", { type: "application/pdf" });
  };
  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file), anchor = document.createElement("a");
    anchor.href = url; anchor.download = file.name; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };
  const preparePdf = async (download = false) => {
    if (!validate()) return;
    const startedAt = revision.current;
    setBusy(true);
    try {
      const file = await makeFile();
      if (revision.current !== startedAt) { setStatus("Los datos cambiaron. Prepará nuevamente el PDF actualizado."); return; }
      setPdfUrl(URL.createObjectURL(file));
      if (download) downloadFile(file);
      setStatus(download ? "PDF preparado para descargar." : "Vista previa del PDF lista. Podés seguir editando.");
    }
    catch { setStatus("No se pudo preparar el PDF. Volvé a intentarlo."); }
    finally { setBusy(false); }
  };
  const shareFile = async () => {
    if (!validate()) return;
    const startedAt = revision.current;
    setBusy(true);
    try {
      const file = await makeFile();
      if (revision.current !== startedAt) { setStatus("Los datos cambiaron. Prepará nuevamente el presupuesto actualizado."); return; }
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "Presupuesto", text: preparedMessage });
        setStatus("Se abrió el selector para compartir. Elegí el destino y confirmá el envío.");
      } else {
        downloadFile(file);
        window.open(buildRecipientlessWhatsAppUrl(preparedMessage), "_blank", "noopener,noreferrer");
        setStatus("PDF preparado para descargar. Se solicitó abrir WhatsApp: elegí el destinatario y adjuntá el archivo manualmente. Si no se abrió, usá «Abrir WhatsApp con este mensaje».");
      }
    } catch (error) { setStatus(error instanceof DOMException && error.name === "AbortError" ? "Compartir cancelado. Podés volver a intentarlo." : "No se pudo compartir el archivo. Usá «Descargar PDF» y adjuntalo manualmente en WhatsApp."); }
    finally { setBusy(false); }
  };

  return <section className="quote-builder bg-ivory-2 pb-20 pt-32 sm:pt-40" data-valid={result.valid}><Container>
    <div className="quote-noprint">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet">Gestión de presupuestos</p>
    <h1 className="mt-4 font-display text-4xl sm:text-5xl">Una propuesta, a medida.</h1>
    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/75">Completá los datos, revisá el desglose y prepará el PDF. Los campos con * son obligatorios. Los importes se expresan en pesos argentinos.</p>
    <p className="mt-4 max-w-2xl text-xs leading-relaxed text-ink/65">Esta herramienta no solicita contraseña: cualquiera que conozca su dirección puede abrirla. Los datos solo permanecen en esta pestaña y se pierden al recargar o cerrarla.</p>
    </div>

    <div className="quote-noprint sticky top-20 z-20 mt-6 flex flex-wrap items-center justify-between gap-2 border border-gold/40 bg-carbon p-4 text-sm text-ivory lg:hidden"><span>{result.isManualTotal ? "Total acordado" : "Total del borrador"}</span><strong>{result.amountsReady ? money(result.total) : "Importes pendientes"}</strong><a href="#quote-preview" className="inline-flex min-h-11 items-center underline underline-offset-4">Ver detalle</a></div>
    <div className="quote-noprint mt-10 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div role="form" aria-label="Datos del presupuesto" className="min-w-0 space-y-5">
        <Group title="1. Cliente y evento" open>
          {field("client", "Nombre del cliente", { required: true })}
          <div className="min-w-0"><label htmlFor="quote-event" className="text-sm font-semibold">Tipo de evento *</label><input id="quote-event" name="event" list="event-options" value={quote.event} onChange={(e) => change("event", e.target.value)} maxLength={120} required className={fieldClass} aria-invalid={attempted && !!result.errors.event} /><datalist id="event-options">{EVENT_TYPE_OPTIONS.map((item) => <option key={item} value={item} />)}</datalist>{attempted && result.errors.event && <p className="mt-2 text-sm text-red-800">{result.errors.event}</p>}</div>
          {field("date", "Fecha del evento", { type: "date", required: true })}
          {field("time", "Horario (opcional)", { hint: "Podés indicar una franja horaria." })}
        </Group>
        <Group title="2. Invitados y tarjetas" open>
          {field("guests", "Cantidad de personas", { hint: "Si no conocés la cantidad, ingresá un costo ajustado.", full: true })}
          {field("pricePerPerson", "Precio por persona", { numeric: true, required: quote.cardsAmount === null && !quote.cardsNotApplicable, disabled: quote.cardsNotApplicable, full: true })}
          {field("cardsAmount", "Costo de tarjetas", { numeric: true, required: true, full: true, disabled: quote.cardsNotApplicable, value: quote.cardsNotApplicable ? "0" : quote.cardsAmount ?? inputAmount(result.automaticCards), hint: "Editable para reflejar las condiciones acordadas." })}
          {!quote.cardsNotApplicable && <div className="text-sm leading-relaxed sm:col-span-2" aria-live="polite"><p data-testid="cards-source" className="font-semibold">{quote.cardsAmount !== null ? "Ajustado manualmente." : result.automaticCards !== undefined ? `Calculado automáticamente: ${result.guests} × ${money(result.pricePerPerson ?? 0)} = ${money(result.automaticCards)}.` : "Falta cantidad o precio. También podés ajustar el costo."}</p>{quote.cardsAmount !== null && <button id="quote-resetCards" type="button" onClick={() => change("cardsAmount", null)} className="mt-2 min-h-11 text-sm underline underline-offset-4">Volver al cálculo automático</button>}</div>}
          <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm sm:col-span-2"><input id="quote-cardsNotApplicable" type="checkbox" checked={quote.cardsNotApplicable} onChange={(e) => change("cardsNotApplicable", e.target.checked)} className="h-5 w-5 shrink-0 accent-violet" />No corresponden tarjetas: confirmar importe $0.</label>
        </Group>
        <Group title="3. Servicio y adicionales" open>
          <div className="min-w-0 sm:col-span-2"><label htmlFor="quote-service" className="text-sm font-semibold">Servicio contratado *</label><select id="quote-service" value={quote.service} onChange={(e) => change("service", e.target.value)} className={fieldClass} required aria-invalid={attempted && !!result.errors.service}><option value="">Seleccioná un servicio</option>{planes.map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}</select>{attempted && result.errors.service && <p className="mt-2 text-sm text-red-800">{result.errors.service}</p>}</div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm sm:col-span-2"><input id="quote-includeService" type="checkbox" checked={quote.includeService} onChange={(e) => change("includeService", e.target.checked)} className="h-5 w-5 shrink-0 accent-violet" />Incluir el costo del servicio en el presupuesto</label>
          {field("serviceAmount", "Precio del servicio", { numeric: true, full: true, required: quote.includeService, hint: quote.includeService ? "Se suma una sola vez. Si es cero, escribí 0 para confirmarlo." : "No se cobra mientras la casilla esté desactivada. El precio escrito se conserva." })}
          <fieldset className="min-w-0 space-y-4 sm:col-span-2"><legend className="mb-2 text-sm font-semibold">Adicionales con costo extra</legend><p className="text-xs text-ink/65">Ingresá el precio para incluirlo. Vacío o $0: no se incluye.</p>{quote.extras.map((extra, index) => <div key={extra.id} className="min-w-0 border border-ink/15 p-4"><label htmlFor={`${extra.id}-amount`} className="text-sm font-semibold">{extra.name}</label><input id={`${extra.id}-amount`} value={extra.amount} onChange={(e) => changeExtra(index, e.target.value)} inputMode="decimal" maxLength={120} autoComplete="off" className={fieldClass} aria-invalid={attempted && !!result.errors[`${extra.id}-amount`]} aria-describedby={attempted && result.errors[`${extra.id}-amount`] ? `error-${extra.id}-amount` : undefined} />{attempted && result.errors[`${extra.id}-amount`] && <p id={`error-${extra.id}-amount`} className="mt-2 text-sm text-red-800">{result.errors[`${extra.id}-amount`]}</p>}</div>)}</fieldset>
          {field("discount", "Descuento manual (opcional)", { numeric: true, full: true })}
        </Group>
        <Group title="4. Total final" open>
          <div className="flex flex-wrap justify-between gap-2 border-b border-ink/15 pb-3 text-sm sm:col-span-2"><span>Total automático</span><strong data-testid="quote-automatic-total">{result.automaticReady ? money(result.automaticTotal) : "Importes pendientes"}</strong></div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm sm:col-span-2"><input id="quote-finalManual" type="checkbox" checked={result.isManualTotal} onChange={(e) => change("finalAmount", e.target.checked ? (result.automaticReady ? inputAmount(result.automaticTotal) : "") : null)} className="h-5 w-5 shrink-0 accent-violet" />Editar total final manualmente</label>
          {result.isManualTotal && <>
            {field("finalAmount", "Total final acordado", { numeric: true, required: true, full: true, hint: "Reemplaza el total automático; no se le suman los conceptos nuevamente." })}
            {result.manualMismatch && <p data-testid="quote-manual-warning" className="border-l-2 border-gold bg-white/60 p-3 text-sm leading-relaxed sm:col-span-2">El desglose difiere del total acordado. Se conservará el importe manual.</p>}
            <button id="quote-resetTotal" type="button" onClick={() => change("finalAmount", null)} className="min-h-11 text-left text-sm underline underline-offset-4 sm:col-span-2">Volver al total automático</button>
          </>}
        </Group>
        <Group title="5. Financiación" open>
          <div className="min-w-0 sm:col-span-2"><label htmlFor="quote-installments" className="text-sm font-semibold">Forma de pago</label><select id="quote-installments" value={quote.installments} onChange={(e) => change("installments", e.target.value)} className={fieldClass} aria-invalid={attempted && !!result.errors.installments}><option value="none">Sin financiación</option><option value="3">3 cuotas</option><option value="6">6 cuotas</option><option value="12">12 cuotas</option></select><p className="mt-2 text-xs leading-relaxed text-ink/70">Las cuotas no modifican el total del presupuesto.</p></div>
          {quote.installments !== "none" && <>
            {field("financingAmount", "Importe a financiar", { numeric: true, required: true, full: true, value: quote.financingAmount ?? (result.amountsReady ? inputAmount(result.cards) : ""), hint: quote.financingAmount === null ? "Se toma el costo de tarjetas mientras no edites este importe." : "Ajustado manualmente; se conserva al editar el presupuesto." })}
            <button id="quote-resetFinancing" type="button" onClick={() => change("financingAmount", null)} className="min-h-11 text-left text-sm underline underline-offset-4 sm:col-span-2">Usar total de tarjetas</button>
          </>}
          {result.financing ? <dl className="space-y-2 text-sm sm:col-span-2" aria-live="polite">{financingRows(result).map((row) => <div key={row.label} className="flex flex-wrap justify-between gap-2"><dt>{row.label}</dt><dd className="font-semibold">{row.value}</dd></div>)}</dl> : quote.installments !== "none" && <p className="text-sm sm:col-span-2">Completá los importes del presupuesto y el importe a financiar para calcular las cuotas.</p>}
        </Group>
        <Group title="6. Condiciones y observaciones">
          {field("payment", "Condiciones de pago (opcional)", { multiline: true, full: true })}
          {field("validity", "Vigencia del presupuesto (opcional)", { full: true })}
          {field("notes", "Observaciones (opcional)", { multiline: true, full: true })}
        </Group>
        {attempted && !result.valid && <div role="alert" className="border border-red-800/25 bg-white/50 p-4 text-sm text-red-800"><p>Revisá los siguientes datos:</p><ul className="mt-2 list-inside list-disc">{Object.keys(result.errors).map((key) => <li key={key}>{({ client: "Cliente", event: "Tipo de evento", date: "Fecha", service: "Servicio", guests: "Invitados", cardsAmount: "Costo de tarjetas", pricePerPerson: "Precio por persona", financingAmount: "Importe a financiar", installments: "Financiación", discount: "Descuento", serviceAmount: "Importe del servicio", finalAmount: "Total final acordado", total: "Total" } as Record<string, string>)[key] ?? "Descripción o importe de un adicional"}: {result.errors[key]}</li>)}</ul></div>}
        <button type="button" onClick={() => void preparePdf()} disabled={busy} className={`${actionClass} w-full`}>{busy ? "Preparando…" : "Preparar vista previa del PDF"}</button>
      </div>
      <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <div className="border border-gold/40 bg-carbon p-6 text-ivory">
          <h2 className="font-display text-3xl">Resumen del presupuesto</h2><p className="mt-4 text-sm leading-relaxed text-ivory/80">{result.isManualTotal ? "Desglose de referencia; el total acordado reemplaza la suma." : "Tarjetas + adicionales + servicio activado − descuento."}</p>
          <dl className="mt-6 space-y-3 text-sm">
            {quoteEconomicRows(result).map((item) => <div key={item.key} className="flex flex-wrap justify-between gap-2"><dt>{item.label}</dt><dd className="font-semibold">{item.pending ? "Pendiente" : money(item.amount)}</dd></div>)}
          </dl><div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-gold/40 pt-5 text-xl"><span>{result.totalLabel}</span><strong data-testid="quote-total">{result.amountsReady ? money(result.total) : "Importes pendientes"}</strong></div>
          {result.manualMismatch && <p className="mt-3 text-sm text-ivory/80">El desglose difiere del total acordado; se conserva el importe manual.</p>}
          {result.financing && <div className="mt-4 border-t border-ivory/20 pt-4"><h3 className="text-sm font-semibold">Financiación</h3><dl className="mt-3 space-y-2 text-sm">{financingRows(result).map((row) => <div key={row.label} className="flex flex-wrap justify-between gap-2"><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl></div>}
          {!result.valid && <div className="mt-4 border-t border-ivory/20 pt-4 text-sm"><p className="font-semibold">Para generar el PDF, falta completar o corregir:</p><ul className="mt-2 list-inside list-disc space-y-2">{Object.entries(result.errors).map(([key, error]) => <li key={key}>{({ client: "Nombre del cliente", event: "Tipo de evento", date: "Fecha del evento", service: "Servicio contratado", guests: "Cantidad de invitados", cardsAmount: "Costo de tarjetas", pricePerPerson: "Precio por persona", financingAmount: "Importe a financiar", serviceAmount: "Precio del servicio", installments: "Financiación", finalAmount: "Total final acordado" } as Record<string, string>)[key] ?? error}</li>)}</ul></div>}
        </div>
        <p role="status" aria-live="polite" className="mt-4 text-sm leading-relaxed">{status}</p>
      </aside>
    </div>

    <section aria-labelledby="quote-preview" className="quote-preview-section mt-14 min-w-0">
      <h2 id="quote-preview" className="quote-noprint scroll-mt-48 font-display text-3xl">Vista previa del presupuesto</h2>
      <p className="quote-noprint mt-3 text-sm text-ink/65">El detalle se actualiza al editar los datos. Revisalo antes de descargar o imprimir; si modificás algo, prepará nuevamente la vista del PDF.</p>
      {!result.valid && <p className="quote-noprint mt-3 text-sm font-semibold text-ink/75">Borrador incompleto: completá los datos y los importes para descargarlo o imprimirlo.</p>}
      <p className="quote-print-warning">Presupuesto incompleto. Completá los datos y los importes antes de imprimir.</p>
      <QuoteDocument quote={quote} result={result} />
      {pdfUrl && <div className="quote-noprint mt-6"><p className="mb-3 text-sm">Documento generado en A4. Si el visor de tu teléfono no lo muestra, abrí o descargá el archivo.</p><a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">Abrir PDF generado</a><iframe title="Vista previa PDF A4" src={pdfUrl} className="mt-4 h-[65vh] w-full max-w-4xl border border-ink/15" /></div>}
      <div className="quote-noprint mt-6 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={() => void preparePdf(true)} disabled={busy || !result.valid} className={actionClass}>Descargar PDF</button><button type="button" onClick={() => { if (validate()) window.print(); }} disabled={busy || !result.valid} className={actionClass}>Imprimir presupuesto</button><button type="button" onClick={() => void shareFile()} disabled={busy || !result.valid} className={actionClass}>Compartir PDF desde el dispositivo</button></div>
    </section>
    <section className="quote-noprint mt-10 max-w-4xl border border-gold/40 p-5 sm:p-7" aria-labelledby="quote-share"><h2 id="quote-share" className="font-display text-3xl">Compartir por WhatsApp</h2><label htmlFor="quote-message" className="mt-5 block text-sm font-semibold">Revisá o editá el mensaje antes de abrir WhatsApp</label><textarea id="quote-message" value={preparedMessage} onChange={(e) => setMessage(e.target.value)} rows={7} maxLength={4000} className={fieldClass} /><p className="mt-3 text-sm leading-relaxed text-ink/70">Elegís el destinatario en WhatsApp y confirmás el envío allí. El PDF no se adjunta automáticamente: descargalo y adjuntalo, o compartilo con el selector del dispositivo si está disponible.</p>{result.valid && preparedMessage.trim() ? <a href={buildRecipientlessWhatsAppUrl(preparedMessage)} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-5`}>Abrir WhatsApp con este mensaje</a> : <p className="mt-4 text-sm">Completá el presupuesto para habilitar el enlace de WhatsApp.</p>}</section>
  </Container></section>;
}
