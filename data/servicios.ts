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
 *   (aclaración visible en components/home/Servicios.tsx).
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
      "Catering tradicional completo: recepción, plato principal, postre y comida de fin de fiesta",
      "Bebidas: línea Coca-Cola, agua y soda",
      "Hasta 2 vinos por mesa de adultos",
      "DJ",
      "Animación",
      "Pantalla para proyección (incluida)",
    ],
    featured: true,
  },
];
