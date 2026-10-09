import { site } from "@/data/site";

/**
 * Número de WhatsApp en formato internacional, solo dígitos (sin "+").
 *
 * Confirmado: el canal de WhatsApp de ML es el teléfono de Hugo
 * (0383 478-1774 → 543834781774). Es el único contacto público del sitio.
 */
export const WHATSAPP_NUMBER = "543834781774";

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

/** Mensajes contextuales por ocasión. */
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
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number) return "";
  const text = encodeURIComponent(OCCASION_MESSAGES[occasion]);
  return `https://wa.me/${number}?text=${text}`;
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
    href: `tel:${site.contacts.hugo.phoneTel}`,
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

/** Planes de servicio consultables (detalle en data/servicios.ts). */
export const SERVICE_PLAN_OPTIONS = [
  "Plan Esencial",
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
    "Hola, quiero consultar disponibilidad para un evento.",
    "",
    `Nombre: ${inquiry.nombre}`,
    `Tipo de evento: ${inquiry.tipoEvento}`,
    `Fecha principal: ${
      inquiry.fechaPrincipal ? formatDateEs(inquiry.fechaPrincipal) : "A definir"
    }`,
    `Fecha alternativa: ${
      inquiry.fechaAlternativa
        ? formatDateEs(inquiry.fechaAlternativa)
        : "Sin fecha alternativa"
    }`,
    `Cantidad estimada de personas: ${inquiry.personas}`,
    `Servicio: ${inquiry.servicio}`,
  ].join("\n");
}

/** URL de wa.me con la consulta del formulario pre-cargada. */
export function buildInquiryWhatsAppUrl(inquiry: EventInquiry): string {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number) return "";
  const text = encodeURIComponent(buildInquiryMessage(inquiry));
  return `https://wa.me/${number}?text=${text}`;
}

