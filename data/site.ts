/**
 * Información confirmada de ML Salón de Eventos.
 *
 * Regla del proyecto: este archivo centraliza EXCLUSIVAMENTE información
 * confirmada o explícitamente autorizada para pruebas. No inventar
 * capacidad, servicios, horarios ni teléfonos. Redes configuradas:
 * - Instagram: handle @ml_salondeeventos (perfil oficial).
 * - Facebook: página oficial "ML Salón de Eventos" (id 100086731144154,
 *   "ML Salón de Eventos | San Fernando del Valle de Catamarca").
 *
 * El contacto público es temporal. Los teléfonos definitivos de Hugo
 * y de su hermano quedan pendientes de confirmación.
 */

export const site = {
  name: "ML Salón de Eventos",
  shortName: "ML",
  claim: "El lugar donde tu celebración toma forma.",
  description:
    "ML Salón de Eventos: salón de eventos y salón de fiestas en Catamarca, camino al Dique El Jumeal. Fiestas de 15, casamientos, cumpleaños, fiestas infantiles, comuniones y bautismos, eventos corporativos y celebraciones al aire libre con pileta. Consultá disponibilidad y presupuesto.",
  address: {
    street: "Bartolomé de Castro S/N",
    reference: "Camino al Dique El Jumeal",
    city: "San Fernando del Valle de Catamarca",
    province: "Catamarca",
    country: "Argentina",
    postalCode: "", // Pendiente de confirmación — no inventar.
  },
  contacts: {
    primary: {
      name: "Contacto temporal de prueba",
      whatsappNumber: "5493834037325",
      get phoneDisplay() {
        return `+${this.whatsappNumber}`;
      },
      get phoneTel() {
        return `+${this.whatsappNumber}`;
      },
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

