import { site } from "@/data/site";

/**
 * Número de WhatsApp en formato internacional, solo dígitos (sin "+").
 *
 * Número definitivo de Hugo, centralizado en data/site.ts para el
 * formulario de consulta y los accesos directos de la web pública.
 */
export const WHATSAPP_NUMBER = site.contacts.primary.whatsappNumber;

/** Plantilla editable de los accesos directos; independiente del formulario. */
const DIRECT_INQUIRY_MESSAGE = [
  "¡Hola! Quisiera consultar disponibilidad para un evento en MARÍA LUISA.",
  "",
  "Mis datos para la consulta:",
  "",
  "- Nombre y apellido: [Ingresar]",
  "- Tipo de evento: [Boda, 15s, Evento, Corporativo, Otro]",
  "- Fecha principal: [Día Preferencial]",
  "- Fecha alternativa: [Día Alternativo]",
  "- Cantidad estimada de invitados: [Cantidad Total]",
  "- Servicio: [Servicio Salón / Servicio Completo]",
  "",
  "Quisiera recibir información sobre disponibilidad y presupuesto para mi evento.",
  "",
  "¡Muchas gracias!",
].join("\n");

export const DIRECT_WHATSAPP_MESSAGES = {
  floating: DIRECT_INQUIRY_MESSAGE,
  social: DIRECT_INQUIRY_MESSAGE,
} as const;

/** Un único punto para codificar todos los mensajes y construir wa.me. */
function buildMessageWhatsAppUrl(message: string): string {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number) return "";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildDirectWhatsAppUrl(source: keyof typeof DIRECT_WHATSAPP_MESSAGES): string {
  return buildMessageWhatsAppUrl(DIRECT_WHATSAPP_MESSAGES[source]);
}

/** Compartir un presupuesto: el usuario elige destinatario dentro de WhatsApp. */
export function buildRecipientlessWhatsAppUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export type WhatsAppOccasion =
  | "general"
  | "boda"
  | "quince"
  | "egresados"
  | "cumpleanos"
  | "bautismo"
  | "comunion"
  | "corporativo"
  | "infantil"
  | "aireLibre";

/**
 * Plantilla de consulta para todos los accesos directos por ocasión.
 * Solo para accesos directos a WhatsApp; disponibilidad y presupuesto
 * llevan al formulario de contacto.
 */
const OCCASION_MESSAGES: Record<WhatsAppOccasion, string> = {
  general: DIRECT_INQUIRY_MESSAGE,
  boda: DIRECT_INQUIRY_MESSAGE,
  quince: DIRECT_INQUIRY_MESSAGE,
  egresados: DIRECT_INQUIRY_MESSAGE,
  cumpleanos: DIRECT_INQUIRY_MESSAGE,
  bautismo: DIRECT_INQUIRY_MESSAGE,
  comunion: DIRECT_INQUIRY_MESSAGE,
  corporativo: DIRECT_INQUIRY_MESSAGE,
  infantil: DIRECT_INQUIRY_MESSAGE,
  aireLibre: DIRECT_INQUIRY_MESSAGE,
};

/**
 * Construye la URL de wa.me con mensaje pre-cargado.
 * Devuelve "" si el número aún no fue configurado.
 */
export function buildWhatsAppUrl(
  occasion: WhatsAppOccasion = "general",
): string {
  return buildMessageWhatsAppUrl(OCCASION_MESSAGES[occasion]);
}

export type PrimaryContact = {
  /** href listo para usar en <a>. */
  href: string;
  /** Canal real al que apunta el href. */
  channel: "whatsapp" | "tel";
};

/**
 * Contacto principal para CTAs de conversión.
 * WhatsApp cuando esté configurado; teléfono confirmado mientras tanto.
 */
export function getPrimaryContact(
  occasion: WhatsAppOccasion = "general",
): PrimaryContact {
  const whatsappUrl = buildWhatsAppUrl(occasion);
  if (whatsappUrl) {
    return { href: whatsappUrl, channel: "whatsapp" };
  }
  return {
    href: `tel:${site.contacts.primary.phoneTel}`,
    channel: "tel",
  };
}

/* ────────────────────────────────────────────────────────────────────
   Formulario de consulta → WhatsApp
   El mensaje sigue la plantilla estructurada definida en el brief.
   ──────────────────────────────────────────────────────────────────── */

/** Tipos de evento del formulario de consulta (orden del menú). */
export const EVENT_TYPE_OPTIONS = [
  "Fiesta de 15",
  "Casamiento",
  "Cumpleaños",
  "Fiesta infantil",
  "Comunión",
  "Bautismo",
  "Evento corporativo",
  "Evento empresarial",
  "Congreso / reunión",
  "Evento al aire libre",
  "Otro",
] as const;

/** Servicios consultables en el formulario (detalle en data/servicios.ts). */
export const SERVICE_PLAN_OPTIONS = [
  "Servicio Salón",
  "Servicio Completo",
] as const;

export type EventInquiry = {
  nombre: string;
  tipoEvento: string;
  /** Fecha ISO yyyy-mm-dd (input type="date") o "". */
  fechaPrincipal: string;
  /** Fecha ISO yyyy-mm-dd (input type="date") o "". */
  fechaAlternativa: string;
  /** Cantidad estimada de personas (como texto del input). */
  personas: string;
  /** Plan de servicio elegido. */
  servicio: string;
};

/** Valida también los valores que HTML required no detecta, como espacios. */
export function validateInquiry(inquiry: EventInquiry): string | undefined {
  if (inquiry.nombre.trim().split(/\s+/).length < 2) {
    return "Ingresá tu nombre y apellido.";
  }
  if (!EVENT_TYPE_OPTIONS.some((option) => option === inquiry.tipoEvento)) {
    return "Seleccioná un tipo de evento.";
  }
  const validDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };
  if (!validDate(inquiry.fechaPrincipal)) return "Ingresá una fecha principal válida.";
  if (inquiry.fechaAlternativa && !validDate(inquiry.fechaAlternativa)) {
    return "Ingresá una fecha alternativa válida.";
  }
  const guests = Number(inquiry.personas);
  if (!Number.isSafeInteger(guests) || guests < 1) {
    return "Ingresá una cantidad de invitados entera y mayor que cero.";
  }
  if (!SERVICE_PLAN_OPTIONS.some((option) => option === inquiry.servicio)) {
    return "Seleccioná el servicio para tu evento.";
  }
}

/**
 * Formatea una fecha ISO (yyyy-mm-dd) como dd/mm/aaaa.
 * Se separa manualmente para evitar desfases de zona horaria
 * (new Date("yyyy-mm-dd") interpreta UTC).
 */
export function formatDateEs(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

/** Mensaje estructurado de la consulta, según la plantilla del brief. */
export function buildInquiryMessage(inquiry: EventInquiry): string {
  return [
    "¡Hola! Quisiera consultar disponibilidad para un evento en MARÍA LUISA.",
    "",
    "*Mis datos para la consulta:*",
    "",
    `• *Nombre y apellido:* ${inquiry.nombre.trim().replace(/\s+/g, " ")}`,
    `• *Tipo de evento:* ${inquiry.tipoEvento}`,
    `• *Fecha principal:* ${formatDateEs(inquiry.fechaPrincipal)}`,
    ...(inquiry.fechaAlternativa.trim()
      ? [`• *Fecha alternativa:* ${formatDateEs(inquiry.fechaAlternativa)}`]
      : []),
    `• *Cantidad estimada de invitados:* ${inquiry.personas}`,
    `• *Servicio:* ${inquiry.servicio}`,
    "",
    "Quisiera recibir información sobre disponibilidad y presupuesto para mi evento.",
    "",
    "¡Muchas gracias!",
  ].join("\n");
}

/** URL de wa.me con la consulta del formulario pre-cargada. */
export function buildInquiryWhatsAppUrl(inquiry: EventInquiry): string {
  if (validateInquiry(inquiry)) return "";
  return buildMessageWhatsAppUrl(buildInquiryMessage(inquiry));
}

