import { site } from "@/data/site";

/**
 * Número de WhatsApp en formato internacional, solo dígitos (sin "+").
 *
 * PENDIENTE DE CONFIRMACIÓN: aún no está definido cuál de los dos teléfonos
 * confirmados corresponde al canal de WhatsApp:
 *   0383 478-1774 · Hugo
 *   0383 465-3348 · Walther
 *
 * Mientras esté vacío, los CTA principales degradan con elegancia a una
 * llamada telefónica al contacto confirmado (Hugo). Nada se inventa.
 */
export const WHATSAPP_NUMBER = "";

export type WhatsAppOccasion =
  | "general"
  | "boda"
  | "quince"
  | "egresados"
  | "cumpleanos"
  | "bautismo"
  | "comunion"
  | "celebracion"
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
  celebracion:
    "Hola, quisiera consultar disponibilidad para una celebración.",
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
