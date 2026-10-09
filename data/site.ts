/**
 * Información confirmada de ML Salón de Eventos.
 *
 * Regla del proyecto: este archivo centraliza EXCLUSIVAMENTE información
 * confirmada. No inventar capacidad, servicios, horarios ni canal de
 * WhatsApp (ver lib/whatsapp.ts). Las redes sociales están verificadas:
 * - Instagram: handle @ml_salondeeventos (perfil oficial).
 * - Facebook: página oficial "ML Salón de Eventos" (id 100086731144154,
 *   "ML Salón de Eventos | San Fernando del Valle de Catamarca").
 *
 * phoneTel es el número confirmado reexpresado en formato internacional
 * (transformación mecánica: prefijo país +54, sin el 0 del área).
 */

export const site = {
  name: "ML Salón de Eventos",
  shortName: "ML",
  claim: "El lugar donde tu celebración toma forma.",
  description:
    "ML Salón de Eventos: salón de eventos en Catamarca, camino al Dique El Jumeal. Fiestas de 15, casamientos, cumpleaños, fiestas infantiles, comuniones y bautismos, eventos corporativos y celebraciones al aire libre con pileta. Consultá disponibilidad y presupuesto.",
  address: {
    street: "Bartolomé de Castro S/N",
    reference: "Camino al Dique El Jumeal",
    city: "San Fernando del Valle de Catamarca",
    province: "Catamarca",
    country: "Argentina",
    postalCode: "", // Pendiente de confirmación — no inventar.
  },
  contacts: {
    hugo: {
      name: "Hugo",
      phoneDisplay: "0383 478-1774",
      phoneTel: "+543834781774",
    },
  },
  email: "hmelo77@hotmail.com",
  social: {
    instagram: {
      handle: "@ml_salondeeventos",
      url: "https://www.instagram.com/ml_salondeeventos/",
    },
    facebook: {
      name: "ML Salón de Eventos",
      url: "https://www.facebook.com/profile.php?id=100086731144154",
    },
  },
} as const;

