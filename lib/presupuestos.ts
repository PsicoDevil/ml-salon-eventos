import { adicionales, bebidas, catering, complementoPremium, planes } from "@/data/servicios";
import { brand } from "@/data/brand";

export type QuoteExtra = { id: string; selected: boolean; name: string; amount: string };
export type Quote = {
  client: string; event: string; date: string; time: string;
  guests: string; ticket: string; cardsAmount: string;
  cardsMode: "calculated" | "agreed" | "none"; cardsQuantity: string;
  service: string; serviceAmount: string; discount: string;
  payment: string; validity: string; notes: string; extras: QuoteExtra[];
};

export function emptyQuote(): Quote {
  return {
    client: "", event: "", date: "", time: "",
    guests: "", ticket: "", cardsAmount: "", cardsMode: "calculated", cardsQuantity: "", service: "",
    serviceAmount: "0", discount: "", payment: "", validity: "", notes: "",
    extras: adicionales.map((item) => ({ id: item.id, selected: false, name: item.nombre, amount: "" })),
  };
}

export const AGE_POLICY = [
  "De 0 a 3 años: no pagan.",
  "De 4 a 11 años: abonan el 50 % del valor de la tarjeta.",
  "Desde los 12 años: abonan el valor completo de la tarjeta.",
] as const;

/** Centavos enteros: no se suman importes binarios de punto flotante. */
export function cents(value: string): number | undefined {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return;
  const [integer, decimal = ""] = normalized.split(".");
  const result = Number(integer) * 100 + Number(decimal.padEnd(2, "0"));
  return Number.isSafeInteger(result) ? result : undefined;
}
export function money(value: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value / 100);
}
export function quoteDate(value: string): string {
  return value ? value.split("-").reverse().join("/") : "";
}
export function calculateQuote(quote: Quote) {
  const errors: Record<string, string> = {};
  for (const key of ["client", "event", "service"] as const) {
    if (!quote[key].trim()) errors[key] = "Completá este dato.";
  }
  const parsedDate = new Date(`${quote.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(quote.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== quote.date) errors.date = "Ingresá una fecha válida.";
  if (!planes.some((plan) => plan.id === quote.service)) errors.service = "Seleccioná un servicio.";
  let guests: number | undefined;
  if (quote.guests.trim()) {
    const value = Number(quote.guests);
    if (!/^\d+$/.test(quote.guests) || !Number.isSafeInteger(value)) errors.guests = "Usá un entero mayor o igual a cero.";
    else guests = value;
  }
  const amount = (key: "ticket" | "cardsAmount" | "serviceAmount" | "discount", optional = false) => {
    const value = optional && !quote[key].trim() ? 0 : cents(quote[key]);
    if (value === undefined) errors[key] = "Ingresá un importe no negativo, con hasta dos decimales.";
    return value ?? 0;
  };
  const hasCards = quote.cardsMode !== "none";
  if (!["calculated", "agreed", "none"].includes(quote.cardsMode)) errors.cardsMode = "Elegí cómo presupuestar las tarjetas.";
  const ticket = hasCards && quote.ticket.trim() ? amount("ticket") : undefined;
  let cards = 0, cardsQuantity: number | undefined;
  if (quote.cardsMode === "calculated") {
    if (!/^\d+$/.test(quote.cardsQuantity) || !Number.isSafeInteger(Number(quote.cardsQuantity)) || Number(quote.cardsQuantity) < 1) errors.cardsQuantity = "Indicá cuántas tarjetas a valor completo querés presupuestar.";
    else cardsQuantity = Number(quote.cardsQuantity);
    if (ticket === undefined) errors.ticket = "Ingresá el precio por tarjeta para calcular el importe.";
    cards = (cardsQuantity ?? 0) * (ticket ?? 0);
  } else if (quote.cardsMode === "agreed") {
    cards = amount("cardsAmount");
    if (!quote.cardsAmount.trim()) errors.cardsAmount = "Ingresá el total acordado de tarjetas.";
  }
  const cardsPending = !!(errors.cardsMode || errors.cardsAmount || !Number.isSafeInteger(cards) || (quote.cardsMode === "calculated" && (errors.cardsQuantity || errors.ticket)));
  const service = amount("serviceAmount"), discount = amount("discount", true);
  const extras = quote.extras.filter((extra) => extra.selected).map((extra) => {
    const value = cents(extra.amount);
    if (!extra.name.trim()) errors[`${extra.id}-name`] = "Indicá el nombre del adicional.";
    if (value === undefined) errors[`${extra.id}-amount`] = "Ingresá un importe no negativo, con hasta dos decimales.";
    return { ...extra, cents: value ?? 0 };
  });
  const extraTotal = extras.reduce((sum, extra) => sum + extra.cents, 0);
  const subtotal = cards + service + extraTotal;
  if (![cards, extraTotal, subtotal].every(Number.isSafeInteger)) errors.total = "Los valores exceden el rango de cálculo seguro.";
  if (discount > subtotal) errors.discount = "El descuento no puede superar el subtotal.";
  const amountsReady = !cardsPending && !Object.keys(errors).some((key) => ["serviceAmount", "discount", "total"].includes(key) || key.endsWith("-amount"));
  return { errors, valid: Object.keys(errors).length === 0, amountsReady, guests, ticket, hasCards, cards, cardsQuantity, cardsPending, service, extras, extraTotal, discount, total: Math.max(0, subtotal - discount) };
}

/** Único desglose económico para el resumen, la vista previa y el PDF. */
export function quoteEconomicRows(result: ReturnType<typeof calculateQuote>) {
  return [
    { key: "service", label: "Servicio", amount: result.service, pending: !!result.errors.serviceAmount },
    ...(result.hasCards ? [{ key: "cards", label: "Tarjetas", amount: result.cards, pending: result.cardsPending }] : []),
    { key: "extras", label: "Adicionales", amount: result.extraTotal, pending: Object.keys(result.errors).some((key) => key.endsWith("-amount")) },
    ...(result.discount > 0 || result.errors.discount ? [{ key: "discount", label: "Descuento", amount: -result.discount, pending: !!result.errors.discount }] : []),
  ];
}

export function cardsExplanation(quote: Quote, result = calculateQuote(quote)): string {
  if (!result.hasCards) return "Sin tarjetas: se utiliza el importe del servicio.";
  if (result.cardsPending || result.errors.total) return quote.cardsMode === "calculated" ? "Completá la cantidad de tarjetas y el precio unitario para calcular." : "Completá el importe total acordado de tarjetas.";
  return quote.cardsMode === "calculated"
    ? `${result.cardsQuantity} tarjetas × ${money(result.ticket ?? 0)} = ${money(result.cards)}.`
    : `Total acordado de tarjetas: ${money(result.cards)}. No se multiplica por invitados ni por precio unitario.`;
}

export type QuoteBlock = { kind: "section" | "line" | "row" | "total"; text: string; value?: string };
export function quoteBlocks(quote: Quote, result = calculateQuote(quote)): QuoteBlock[] {
  const plan = planes.find((item) => item.id === quote.service);
  const blocks: QuoteBlock[] = [];
  const section = (text: string) => blocks.push({ kind: "section", text });
  const line = (text: string) => blocks.push({ kind: "line", text });
  const row = (text: string, value: string) => blocks.push({ kind: "row", text, value });
  section("Datos del evento");
  if (quote.client.trim()) line(`Cliente: ${quote.client.trim()}`);
  if (quote.event.trim()) line(`Evento: ${quote.event.trim()}`);
  if (quote.date) line(`Fecha: ${quoteDate(quote.date)}${quote.time ? ` - Horario: ${quote.time}` : ""}`);
  if (result.guests !== undefined) line(`Invitados: ${result.guests}`);
  if (plan) line(`Servicio: ${plan.name}`);
  if (result.hasCards) {
    section("Tarjetas");
    if (result.ticket !== undefined) line(`${quote.cardsMode === "calculated" ? "Precio por tarjeta" : "Precio unitario de referencia (informativo)"}: ${result.errors.ticket ? "Pendiente" : money(result.ticket)}`);
    row(quote.cardsMode === "calculated" ? "Tarjetas calculadas" : "Importe total de tarjetas acordado", result.cardsPending ? "Pendiente" : money(result.cards));
  }
  section("Detalle del servicio");
  row("Subtotal del servicio (sin tarjetas)", result.errors.serviceAmount ? "Pendiente" : money(result.service));
  for (const feature of plan?.features ?? []) {
    if (feature === "Todo lo incluido en el Servicio Salón") planes[0].features.forEach(line);
    else line(feature);
  }
  if (plan?.featured) {
    section("Propuesta gastronómica");
    catering.forEach((item) => line(`${item.titulo}: ${item.detalle}`));
    line(`Bebidas y barra: ${bebidas.join(". ")}.`);
    line(complementoPremium);
  }
  section("Adicionales con costo extra");
  if (result.extras.length) result.extras.forEach((extra) => row(extra.name.trim(), result.errors[`${extra.id}-amount`] ? "Pendiente" : money(extra.cents)));
  else line("Sin adicionales seleccionados.");
  section("Resumen de importes");
  quoteEconomicRows(result).forEach((item) => row(item.label, item.pending ? "Pendiente" : money(item.amount)));
  blocks.push({ kind: "total", text: "TOTAL FINAL", value: result.amountsReady ? money(result.total) : "Pendiente" });
  section("Política de edades");
  AGE_POLICY.forEach(line);
  if (quote.payment.trim()) { section("Condiciones de pago"); line(quote.payment.trim()); }
  if (quote.validity.trim()) { section("Vigencia del presupuesto"); line(quote.validity.trim()); }
  if (quote.notes.trim()) { section("Observaciones"); line(quote.notes.trim()); }
  return blocks;
}

export function quoteMessage(quote: Quote, result = calculateQuote(quote)): string {
  return [
    `Hola, te comparto el presupuesto de ${brand.commercialName}.`,
    `Cliente: ${quote.client.trim()}`,
    `Evento: ${quote.event.trim()}`,
    `Fecha: ${quoteDate(quote.date)}${quote.time ? ` - ${quote.time}` : ""}`,
    ...(result.guests !== undefined ? [`Invitados: ${result.guests}`] : []),
    `Total: ${result.amountsReady ? money(result.total) : "Pendiente"}`,
    "Podés revisar el detalle en el PDF del presupuesto.",
  ].join("\n");
}
