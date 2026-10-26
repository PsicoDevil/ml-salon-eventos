import { adicionales, planes } from "@/data/servicios";
import { brand } from "@/data/brand";

export type QuoteExtra = { id: string; name: string; amount: string };
export type Quote = {
  client: string; event: string; date: string; time: string;
  // null mantiene la base automática; un string, incluso vacío, es una edición manual.
  guests: string; pricePerPerson: string; cardsAmount: string | null; cardsNotApplicable: boolean;
  service: string; serviceAmount: string; includeService: boolean; discount: string;
  finalAmount: string | null; // null usa el cálculo automático; string reemplaza ese resultado.
  installments: string; financingAmount: string | null; // null sigue el total vigente de tarjetas.
  payment: string; validity: string; notes: string; extras: QuoteExtra[];
};

export function emptyQuote(): Quote {
  return {
    client: "", event: "", date: "", time: "", guests: "", pricePerPerson: "", cardsAmount: null, cardsNotApplicable: false,
    service: "", serviceAmount: "", includeService: false, discount: "", finalAmount: null, installments: "none", financingAmount: null,
    payment: "", validity: "", notes: "",
    extras: adicionales.map((item) => ({ id: item.id, name: item.nombre, amount: "" })),
  };
}

export const AGE_POLICY = [
  "De 0 a 3 años: no pagan.",
  "De 4 a 11 años: abonan el 50 % del valor de la tarjeta.",
  "Desde los 12 años: abonan el valor completo de la tarjeta.",
] as const;

/** Todos los importes se calculan en centavos enteros. */
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
  for (const key of ["client", "event", "service"] as const) if (!quote[key].trim()) errors[key] = "Completá este dato.";
  const parsedDate = new Date(`${quote.date}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(quote.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== quote.date) errors.date = "Ingresá una fecha válida.";
  if (!planes.some((plan) => plan.id === quote.service)) errors.service = "Seleccioná un servicio.";
  let guests: number | undefined;
  if (quote.guests.trim()) {
    const value = Number(quote.guests);
    if (!/^\d+$/.test(quote.guests) || !Number.isSafeInteger(value)) errors.guests = "Usá un entero mayor o igual a cero.";
    else guests = value;
  }
  const amount = (key: "serviceAmount" | "discount", optional = false) => {
    const value = optional && !quote[key].trim() ? 0 : cents(quote[key]);
    if (value === undefined) errors[key] = "Ingresá un importe no negativo, con hasta dos decimales. Si es cero, escribí 0 para confirmarlo.";
    return value ?? 0;
  };
  const pricePerPerson = quote.pricePerPerson.trim() ? cents(quote.pricePerPerson) : undefined;
  if (!quote.cardsNotApplicable && quote.pricePerPerson.trim() && pricePerPerson === undefined) errors.pricePerPerson = "Ingresá un precio válido, no negativo y con hasta dos decimales.";
  const product = guests !== undefined && pricePerPerson !== undefined ? guests * pricePerPerson : undefined;
  const automaticCards = product !== undefined && Number.isSafeInteger(product) ? product : undefined;
  let cards = 0;
  if (!quote.cardsNotApplicable) {
    if (quote.cardsAmount !== null) {
      const agreed = cents(quote.cardsAmount);
      if (agreed === undefined) errors.cardsAmount = "Ingresá un total de tarjetas válido. Un campo vacío no equivale a cero.";
      cards = agreed ?? 0;
    } else {
      if (guests === undefined && !errors.guests) errors.guests = "Ingresá la cantidad para el cálculo inicial o ajustá manualmente el total de tarjetas.";
      if (pricePerPerson === undefined && !errors.pricePerPerson) errors.pricePerPerson = "Ingresá el precio por persona o ajustá manualmente el total de tarjetas.";
      if (automaticCards === undefined) errors.cardsAmount = product !== undefined ? "El cálculo de tarjetas excede el rango seguro." : "Falta cantidad o precio para calcular las tarjetas. También podés ingresar un total manual.";
      cards = automaticCards ?? 0;
    }
  }
  const service = quote.includeService ? amount("serviceAmount") : 0, discount = amount("discount", true);
  if (!["none", "3", "6", "12"].includes(quote.installments)) errors.installments = "Elegí sin financiación, 3, 6 o 12 cuotas.";
  const extras = quote.extras.flatMap((extra) => {
    if (!extra.amount.trim()) return [];
    const value = cents(extra.amount);
    if (value === undefined) {
      errors[`${extra.id}-amount`] = "Ingresá un precio válido, no negativo y con hasta dos decimales.";
      return [];
    }
    if (value === 0) return [];
    if (!extra.name.trim()) errors[`${extra.id}-name`] = "Indicá el nombre del adicional.";
    return [{ ...extra, cents: value }];
  });
  const extraTotal = extras.reduce((sum, extra) => sum + extra.cents, 0);
  const subtotal = cards + service + extraTotal;
  if (![cards, extraTotal, subtotal].every(Number.isSafeInteger)) errors.total = "Los valores exceden el rango de cálculo seguro.";
  if (discount > subtotal) errors.discount = "El descuento no puede superar el subtotal.";
  const automaticReady = !Object.keys(errors).some((key) => ["cardsAmount", "serviceAmount", "discount", "total"].includes(key) || key.endsWith("-amount"));
  const automaticTotal = Math.max(0, subtotal - discount);
  const isManualTotal = quote.finalAmount !== null;
  const manualTotal = quote.finalAmount === null ? undefined : cents(quote.finalAmount);
  if (isManualTotal && manualTotal === undefined) errors.finalAmount = "Ingresá un total final acordado válido y no negativo. Un campo vacío no equivale a cero.";
  const amountsReady = automaticReady && !errors.finalAmount;
  const total = isManualTotal ? manualTotal ?? 0 : automaticTotal;
  const totalLabel = isManualTotal ? "Total final acordado" : "Total final";
  const manualMismatch = isManualTotal && amountsReady && total !== automaticTotal;
  const financingAmount = quote.financingAmount === null ? (amountsReady ? cards : undefined) : cents(quote.financingAmount);
  if (quote.installments !== "none" && financingAmount === undefined && quote.financingAmount !== null) errors.financingAmount = "Ingresá un importe a financiar válido. Un campo vacío no equivale a cero.";
  let financing: { count: number; regular: number; last: number; total: number } | undefined;
  if (amountsReady && !errors.installments && financingAmount !== undefined && quote.installments !== "none") {
    const count = Number(quote.installments);
    let regular = Math.round(financingAmount / count);
    // Para totales de pocos centavos, evitar una última cuota negativa.
    if (financingAmount - regular * (count - 1) < 0) regular = Math.floor(financingAmount / count);
    financing = { count, regular, last: financingAmount - regular * (count - 1), total: financingAmount };
  }
  return { errors, valid: Object.keys(errors).length === 0, amountsReady, automaticReady, automaticTotal, isManualTotal, manualMismatch, totalLabel, guests, pricePerPerson, automaticCards, cards, cardsPending: !!errors.cardsAmount, includeService: quote.includeService, service, extras, extraTotal, discount, total, financingAmount, financing };
}

/** Único desglose económico compartido por resumen, documento y PDF. */
export function quoteEconomicRows(result: ReturnType<typeof calculateQuote>) {
  return [
    ...(result.includeService ? [{ key: "service", label: "Servicio", amount: result.service, pending: !!result.errors.serviceAmount }] : []),
    { key: "cards", label: "Tarjetas", amount: result.cards, pending: result.cardsPending },
    { key: "extras", label: "Adicionales", amount: result.extraTotal, pending: Object.keys(result.errors).some((key) => key.endsWith("-amount")) },
    ...(result.discount > 0 || result.errors.discount ? [{ key: "discount", label: "Descuento", amount: -result.discount, pending: !!result.errors.discount }] : []),
  ];
}

export function financingRows(result: ReturnType<typeof calculateQuote>) {
  const plan = result.financing;
  if (!plan) return [];
  return [
    { label: "Importe a financiar", value: money(plan.total) },
    { label: "Cantidad de cuotas", value: String(plan.count) },
    ...(plan.regular === plan.last
      ? [{ label: "Valor de cada cuota", value: money(plan.regular) }]
      : [{ label: `Primeras ${plan.count - 1} cuotas (cada una)`, value: money(plan.regular) }, { label: "Última cuota", value: money(plan.last) }]),
  ];
}

export function quoteMessage(quote: Quote, result = calculateQuote(quote)): string {
  return [
    `Hola, te comparto el presupuesto de ${brand.commercialName}.`,
    `Cliente: ${quote.client.trim()}`, `Evento: ${quote.event.trim()}`,
    `Fecha: ${quoteDate(quote.date)}${quote.time ? ` - ${quote.time}` : ""}`,
    ...(result.guests !== undefined ? [`Invitados: ${result.guests}`] : []),
    `${result.isManualTotal ? result.totalLabel : "Total"}: ${result.amountsReady ? money(result.total) : "Pendiente"}`,
    ...financingRows(result).map((row) => `${row.label}: ${row.value}`),
    "Podés revisar el detalle en el PDF del presupuesto.",
  ].join("\n");
}
