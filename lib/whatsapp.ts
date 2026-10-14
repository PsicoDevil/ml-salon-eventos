import { site } from "@/data/site";

/**
 * Número de WhatsApp en formato internacional, solo dígitos (sin "+").
 *
 * NÚMERO TEMPORAL DE PRUEBA (549 383 403-7325): se usa durante las
 * pruebas del formulario y de los CTAs. El número definitivo de Hugo
 * (y el alternativo de su hermano) quedan pendientes de confirmación:
 * al confirmarse se actualiza el contacto centralizado en data/site.ts.
 */
export const WHATSAPP_NUMBER = site.contacts.primary.whatsappNumber;

export const DIRECT_WHATSAPP_MESSAGES = {
  floating: "Hola, ¿cómo están? Quisiera recibir información sobre ML Salón de Eventos y consultar por un evento.",
  social: "Hola, llegué a través de la web de ML Salón de Eventos. Quisiera consultar por sus servicios y disponibilidad.",
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
 * Mensajes contextuales por ocasión.
 * Solo para accesos directos a WhatsApp; disponibilidad y presupuesto
 * llevan al formulario de contacto.
 */
const OCCASION_MESSAGES: Record<WhatsAppOccasion, string> = {
  general: "Hola, quisiera consultar disponibilidad para un evento.",
  boda: "Hola, quisiera consultar disponibilidad para un casamiento.",
  quince: "Hola, quisiera consultar disponibilidad para una fiesta de 15.",
  egresados:
    "Hola, quisiera consultar disponibilidad para una fiesta de egresados.",
  cumpleanos: "Hola, quisiera consultar disponibilidad para un cumpleaños.",
  bautismo: "Hola, quisiera consultar disponibilidad para un bautismo.",
  comunion:
    "Hola, quisiera consultar disponibilidad para una comunión o bautismo.",
  corporativo:
    "Hola, quisiera consultar disponibilidad para un evento corporativo o empresarial.",
  infantil:
    "Hola, quisiera consultar disponibilidad para una fiesta infantil.",
  aireLibre:
    "Hola, quisiera consultar disponibilidad para un evento al aire libre.",
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
  "Experiencia María Luisa",
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
    "¡Hola! Quiero consultar por un evento en ML Salón de Eventos.",
    "",
    "*DATOS DEL CLIENTE*",
    `• Nombre y apellido: ${inquiry.nombre.trim().replace(/\s+/g, " ")}`,
    `• Tipo de evento: ${inquiry.tipoEvento}`,
    "",
    "*DATOS DEL EVENTO*",
    `• Fecha principal: ${
      inquiry.fechaPrincipal ? formatDateEs(inquiry.fechaPrincipal) : "A definir"
    }`,
    `• Fecha alternativa: ${
      inquiry.fechaAlternativa
        ? formatDateEs(inquiry.fechaAlternativa)
        : "Sin definir"
    }`,
    `• Cantidad de invitados: ${inquiry.personas}`,
    "",
    "*SERVICIO DE INTERÉS*",
    `• ${inquiry.servicio}`,
    "",
    "Quisiera consultar disponibilidad para la fecha indicada y recibir información sobre el presupuesto.",
    "",
    "¡Gracias!",
  ].join("\n");
}

/** URL de wa.me con la consulta del formulario pre-cargada. */
export function buildInquiryWhatsAppUrl(inquiry: EventInquiry): string {
  if (validateInquiry(inquiry)) return "";
  return buildMessageWhatsAppUrl(buildInquiryMessage(inquiry));
}

