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
 * Las consultas por WhatsApp se dirigen al número definitivo de Hugo.
 * Los teléfonos confirmados de Hugo y Walter se muestran en Contacto y al pie.
 */

export const site = {
  name: "ML Salón de Eventos",
  shortName: "ML",
  claim: "El lugar donde tu celebración toma forma.",
  description:
    "ML Salón de Eventos: salón de eventos y salón de fiestas en Catamarca, en Av. Bartolomé de Castro 2100. Fiestas de 15, casamientos, cumpleaños, fiestas infantiles, comuniones y bautismos, eventos corporativos y celebraciones al aire libre con pileta. Consultá disponibilidad y presupuesto.",
  address: {
    street: "Av. Bartolomé de Castro 2100",
    city: "San Fernando del Valle de Catamarca",
    province: "Catamarca",
    country: "Argentina",
    postalCode: "K4700",
    get full(): string {
      return `${this.street}, ${this.postalCode} ${this.city}, ${this.province}, ${this.country}.`;
    },
  },
  contacts: {
    publicPhones: [
      { name: "Hugo", phoneDisplay: "3834 781774", phoneTel: "3834781774" },
      { name: "Walter", phoneDisplay: "3834 653348", phoneTel: "3834653348" },
    ],
    primary: {
      name: "Hugo",
      whatsappNumber: "5493834781774",
      get phoneDisplay() {
        return `+${this.whatsappNumber}`;
      },
      get phoneTel() {
        return `+${this.whatsappNumber}`;
      },
    },
  },
  email: "hmelo77@hotmail.com",
  get mapsUrl(): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.address.full.slice(0, -1))}`;
  },
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

