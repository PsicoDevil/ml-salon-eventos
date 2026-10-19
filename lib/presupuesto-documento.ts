import { brand } from "@/data/brand";
import { bebidas, catering, complementoPremium, planes } from "@/data/servicios";
import { site } from "@/data/site";
import { AGE_POLICY, calculateQuote, cardsExplanation, money, quoteDate, quoteEconomicRows, type Quote } from "@/lib/presupuestos";

export const QUOTE_LOGO = "/images/brand/maria-luisa-logo.png";

export type DocumentRow = { label: string; value: string; monetary?: boolean; total?: boolean };
export type DocumentSection = { title: string; rows: DocumentRow[]; note?: string; quiet?: boolean };

/** Presentación compartida por HTML e impresión/PDF; no calcula importes. */
export function quoteDocument(quote: Quote, result = calculateQuote(quote)) {
  const plan = planes.find((item) => item.id === quote.service);
  const sections: DocumentSection[] = [];
  const data: DocumentRow[] = [{ label: "Cliente", value: quote.client.trim() || "Pendiente" }];
  if (result.guests !== undefined) data.push({ label: "Invitados (referencia)", value: String(result.guests) });
  if (result.cardsQuantity !== undefined) data.push({ label: "Tarjetas a valor completo", value: String(result.cardsQuantity) });
  if (result.ticket !== undefined) data.push({ label: quote.cardsMode === "calculated" ? "Tarjeta por persona" : "Precio unitario de referencia", value: `${result.errors.ticket ? "Pendiente" : money(result.ticket)}${quote.cardsMode === "agreed" ? " · Informativo; no se suma al total." : ""}` });
  sections.push({ title: "Datos del evento", rows: data });
  sections.push({ title: "Valores del servicio", rows: [
    { label: "Servicio contratado", value: plan?.name ?? "Pendiente" },
    ...(result.hasCards ? [{ label: quote.cardsMode === "calculated" ? "Cálculo de tarjetas" : "Total acordado de tarjetas", value: cardsExplanation(quote, result) }] : []),
    { label: "Importe separado del servicio", value: result.errors.serviceAmount ? "Pendiente" : result.hasCards && result.service === 0 ? "Cubierto por las tarjetas · $ 0,00 adicionales" : money(result.service), monetary: result.service !== 0 || !result.hasCards },
    ...(quote.payment.trim() ? [{ label: "Condiciones de pago", value: quote.payment.trim() }] : []),
  ] });

  const included: DocumentRow[] = [];
  if (plan?.featured) {
    catering.forEach((item) => included.push({ label: item.titulo, value: item.detalle }));
    included.push({ label: "Bebidas y barra", value: `${bebidas.join(". ")}.` });
    // Agrupar las prestaciones vigentes sin duplicar el catering ni las bebidas.
    const details = plan.features.filter((feature) => feature !== "Todo lo incluido en el Servicio Salón" && !/^(Catering tradicional|Bebidas:|Hasta 2 vinos|Barra de tragos)/.test(feature));
    const entertainment = details.filter((feature) => /^(Decoración|DJ$|Animación$|Luces y sonido$)/.test(feature));
    included.push({ label: "Servicio y equipamiento", value: [...planes[0].features, ...details.filter((feature) => !entertainment.includes(feature))].join(" · ") });
    included.push({ label: "Decoración y entretenimiento", value: entertainment.join(" · ") });
  } else if (plan) {
    included.push({ label: "Servicio y equipamiento", value: plan.features.join(" · ") });
  }
  if (included.length) sections.push({ title: "El servicio incluye", rows: included, ...(plan?.featured ? { note: complementoPremium } : {}) });
  if (result.extras.length) sections.push({ title: "Adicionales con costo extra", rows: result.extras.map((extra) => ({ label: extra.name.trim() || "Adicional", value: result.errors[`${extra.id}-amount`] ? "Pendiente" : money(extra.cents), monetary: true })) });
  sections.push({ title: "Resumen de importes", rows: [
    ...quoteEconomicRows(result).map((item) => ({ label: item.label, value: item.pending ? "Pendiente" : money(item.amount), monetary: true })),
    { label: "TOTAL FINAL", value: result.amountsReady ? money(result.total) : "Pendiente", monetary: true, total: true },
  ], ...(!result.extras.length ? { note: "Sin adicionales seleccionados." } : {}) });
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
    address: [site.address.street, site.address.reference, site.address.city, site.address.province, site.address.country].join(", "),
    mapsUrl: site.mapsUrl,
  };
}
