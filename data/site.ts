/**
 * Información confirmada de ML Salón de Eventos.
 *
 * Regla del proyecto: este archivo centraliza EXCLUSIVAMENTE información
 * confirmada. No inventar capacidad, servicios, horarios, redes sociales
 * ni canal de WhatsApp (ver lib/whatsapp.ts).
 *
 * phoneTel es el número confirmado reexpresado en formato internacional
 * (transformación mecánica: prefijo país +54, sin el 0 del área).
 */

export const site = {
  name: "ML Salón de Eventos",
  shortName: "ML",
  claim: "El lugar donde tu celebración toma forma.",
  description:
    "Salón de eventos en San Fernando del Valle de Catamarca, camino al Dique El Jumeal. Bodas, fiestas de 15, egresados, cumpleaños, bautismos, comuniones, celebraciones y eventos corporativos. Consultá disponibilidad.",
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
    walther: {
      name: "Walther",
      phoneDisplay: "0383 465-3348",
      phoneTel: "+543834653348",
    },
  },
  email: "hmelo77@hotmail.com",
} as const;
