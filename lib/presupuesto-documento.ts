import { brand } from "@/data/brand";
import { bebidas, catering, complementoPremium, planes } from "@/data/servicios";
import { AGE_POLICY, calculateQuote, financingRows, money, quoteDate, quoteEconomicRows, type Quote } from "@/lib/presupuestos";

export const QUOTE_LOGO = "/images/brand/maria-luisa-logo.png";

export type DocumentRow = { label: string; value: string; monetary?: boolean; total?: boolean };
export type DocumentSection = { title: string; rows: DocumentRow[]; note?: string; quiet?: boolean };

/** Presentación compartida por HTML e impresión/PDF; no calcula importes. */
export function quoteDocument(quote: Quote, result = calculateQuote(quote)) {
  const plan = planes.find((item) => item.id === quote.service);
  const sections: DocumentSection[] = [];
  const data: DocumentRow[] = [{ label: "Cliente", value: quote.client.trim() || "Pendiente" }];
  if (result.guests !== undefined) data.push({ label: "Cantidad de personas", value: String(result.guests) });
  if (!quote.cardsNotApplicable && result.pricePerPerson !== undefined) data.push({ label: "Precio por persona", value: money(result.pricePerPerson) });
  sections.push({ title: "Datos del evento", rows: data });
  sections.push({ title: "Valores del servicio", rows: [
    { label: "Servicio contratado", value: plan ? plan.selectionName ?? plan.name : "Pendiente" },
    ...(result.includeService ? [{ label: "Precio del servicio", value: result.errors.serviceAmount ? "Pendiente" : money(result.service), monetary: true }] : []),
    ...(quote.payment.trim() ? [{ label: "Condiciones de pago", value: quote.payment.trim() }] : []),
  ] });

  const included: DocumentRow[] = [];
  if (plan?.featured) {
    catering.forEach((item) => included.push({ label: item.titulo, value: item.detalle }));
    included.push({ label: "Bebidas y barra", value: `${bebidas.join(". ")}.` });
    // Agrupar las prestaciones vigentes sin duplicar el catering ni las bebidas.
    const details = plan.features.filter((feature) => feature !== "Todo lo incluido en el Servicio Salón" && !/^(Catering tradicional|Bebidas:|Hasta 2 vinos|Barra de tragos|Cerveza tirada)/.test(feature));
    const entertainment = details.filter((feature) => /^(Decoración|DJ$|Animación$|Luces y sonido$)/.test(feature));
    included.push({ label: "Servicio y equipamiento", value: [...planes[0].features, ...details.filter((feature) => !entertainment.includes(feature))].join(" · ") });
    included.push({ label: "Decoración y entretenimiento", value: entertainment.join(" · ") });
  } else if (plan) {
    included.push({ label: "Servicio y equipamiento", value: plan.features.join(" · ") });
  }
  if (included.length) sections.push({ title: "El servicio incluye", rows: included, ...(plan?.featured ? { note: complementoPremium } : {}) });
  if (result.extras.length) sections.push({ title: "Adicionales con costo extra", rows: result.extras.map((extra) => ({ label: extra.name.trim() || "Adicional", value: result.errors[`${extra.id}-amount`] ? "Pendiente" : money(extra.cents), monetary: true })) });
  sections.push({ title: result.isManualTotal ? "Desglose de referencia" : "Resumen de importes", rows: [
    ...quoteEconomicRows(result).map((item) => ({ label: item.label, value: item.pending ? "Pendiente" : money(item.amount), monetary: true })),
    { label: result.totalLabel.toUpperCase(), value: result.amountsReady ? money(result.total) : "Pendiente", monetary: true, total: true },
  ], ...(result.isManualTotal ? { note: `El desglose es una referencia. El importe acordado reemplaza el cálculo automático; no se vuelven a sumar sus conceptos.${result.includeVat ? " Sobre esa base se agrega el IVA del 21 % una sola vez." : ""}` } : result.includeVat ? { note: "Importes ingresados sin IVA. El descuento se aplica antes del IVA del 21 %, que se suma una sola vez." } : quote.cardsNotApplicable ? { note: "No corresponden tarjetas; importe confirmado en $0." } : quote.cardsAmount !== null ? { note: "Total de tarjetas ajustado según las condiciones acordadas." } : !result.extras.length ? { note: "Sin adicionales seleccionados." } : {}) });
  if (result.financing) sections.push({ title: "Financiación", rows: financingRows(result).map((row) => ({ ...row, monetary: true })), note: "Forma de pago del importe indicado; no se suma al total del presupuesto." });
  sections.push({ title: "Política de edades", quiet: true, rows: AGE_POLICY.map((value) => ({ label: "", value })) });
  if (quote.validity.trim() || quote.notes.trim()) sections.push({ title: "Vigencia y observaciones", quiet: true, rows: [
    ...(quote.validity.trim() ? [{ label: "Vigencia", value: quote.validity.trim() }] : []),
    ...(quote.notes.trim() ? [{ label: "Observaciones", value: quote.notes.trim() }] : []),
  ] });
  return {
    name: brand.commercialName, monogram: brand.monogram, logo: QUOTE_LOGO,
    event: quote.event.trim() || "Evento a confirmar",
    schedule: [quoteDate(quote.date), quote.time.trim()].filter(Boolean).join(" · "),
    sections,
  };
}
