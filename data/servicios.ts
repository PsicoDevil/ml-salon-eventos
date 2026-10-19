/**
 * Servicios de ML.
 *
 * CONFIRMADO con el cliente: los nombres y las listas de inclusiones son
 * exactamente los acordados; no se agregan ni se quitan rubros.
 * - "Servicio Salón": la base operativa del evento.
 * - "Experiencia María Luisa": todo el Servicio Salón más gastronomía,
 *   ambientación y entretenimiento.
 * - La pantalla para proyección está INCLUIDA en la Experiencia María
 *   Luisa; la pantalla LED es un servicio adicional con costo extra
 *   (ver los adicionales de entretenimiento).
 * Los precios se cierran por presupuesto en WhatsApp: no se muestran.
 */

export type Plan = {
  id: string;
  name: string;
  kicker: string;
  description: string;
  features: string[];
  /** Destaca la tarjeta premium (Experiencia María Luisa). */
  featured?: boolean;
};

export const planes: Plan[] = [
  {
    id: "servicio-salon",
    name: "Servicio Salón",
    kicker: "La base del evento, resuelta",
    description:
      "El salón y su operativa listos para tu celebración, para que solo te ocupes de festejar.",
    features: [
      "Uso del salón",
      "Mesas y sillas",
      "Personal de limpieza",
      "Seguridad",
      "Grupo electrógeno",
      "Juego de living",
    ],
  },
  {
    id: "experiencia-maria-luisa",
    name: "Experiencia María Luisa",
    kicker: "La experiencia insignia de la casa",
    description:
      "Todo lo incluido en el Servicio Salón, más la gastronomía, la ambientación y el entretenimiento: el evento completo, de principio a fin.",
    features: [
      "Todo lo incluido en el Servicio Salón",
      "Decoración premium",
      "Vajilla completa",
      "Mantelería",
      "Catering tradicional completo: recepción, plato principal, postre y comida de cierre",
      "Bebidas: línea Coca-Cola, agua y soda",
      "Hasta 2 vinos por mesa de adultos",
      "DJ",
      "Animación",
      "Luces y sonido",
      "Pantalla para proyección (incluida)",
      "Barra de tragos y cerveza tirada tipo chopp",
    ],
    featured: true,
  },
];

/** Propuesta confirmada; los platos principales se definen en el asesoramiento. */
export const catering = [
  { paso: "01", titulo: "Recepción", detalle: "Tartaletas y mesa de fiambres." },
  { paso: "02", titulo: "Plato principal", detalle: "El plato principal del catering tradicional, como parte de la celebración. Las opciones se definen en el asesoramiento previo." },
  { paso: "03", titulo: "Postre", detalle: "Helado o alternativa a elección." },
  { paso: "04", titulo: "Comida de cierre", detalle: "Pata flambeada o variedad de pizzas." },
] as const;

export const bebidas = ["Línea Coca-Cola, agua y soda", "Hasta 2 vinos por mesa de adultos", "Barra de tragos", "Cerveza tirada tipo chopp"] as const;
export const complementoPremium = "Una sorpresa para tu celebración: consultá por la opción de robot o espejo mágico en la Experiencia María Luisa. Disponibilidad a confirmar.";

/** No incluidos: los importes se presupuestan manualmente. */
export const adicionales = [
  { id: "pantalla-led", nombre: "Pantalla LED" },
  { id: "bar-glitter", nombre: "Bar Glitter" },
  { id: "pista-led", nombre: "Pista LED" },
  { id: "fotocabina", nombre: "Fotocabina" },
  { id: "foto-video", nombre: "Paquete premium de fotografía y video" },
] as const;
