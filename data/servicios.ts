/**
 * Planes de servicio.
 *
 * CONFIRMADO con el cliente (propuesta conservadora): la lista de
 * inclusiones es exactamente la acordada; no se agregan rubros.
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
    id: "plan-esencial",
    name: "Plan Esencial",
    kicker: "Lo esencial, resuelto",
    description:
      "La base operativa del evento, resuelta de punta a punta para que solo te ocupes de celebrar.",
    features: [
      "Uso del salón",
      "Logística y coordinación del evento",
      "Mozos especializados",
      "Limpieza",
    ],
  },
  {
    id: "experiencia-maria-luisa",
    name: "Experiencia María Luisa",
    kicker: "La experiencia insignia de la casa",
    description:
      "El Plan Esencial completo, más el acompañamiento personal y los detalles que hacen la diferencia.",
    features: [
      "Todo lo incluido en el Plan Esencial",
      "Asesoramiento personalizado",
      "Coordinación in situ",
      "Ambientación",
    ],
    featured: true,
  },
];
