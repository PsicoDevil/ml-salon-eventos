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
  | "corporativo";

/** Mensajes contextuales por ocasión. */
const OCCASION_MESSAGES: Record<WhatsAppOccasion, string> = {
  general: "Hola, quisiera consultar disponibilidad para un evento.",
  boda: "Hola, quisiera consultar disponibilidad para una boda.",
  quince: "Hola, quisiera consultar disponibilidad para una fiesta de 15.",
  egresados:
    "Hola, quisiera consultar disponibilidad para una fiesta de egresados.",
  cumpleanos: "Hola, quisiera consultar disponibilidad para un cumpleaños.",
  bautismo: "Hola, quisiera consultar disponibilidad para un bautismo.",
  comunion: "Hola, quisiera consultar disponibilidad para una comunión.",
  corporativo:
    "Hola, quisiera consultar disponibilidad para un evento corporativo.",
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
