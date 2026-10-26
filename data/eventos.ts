import type { WhatsAppOccasion } from "@/lib/whatsapp";

/**
 * Ocasiones que ML acompaña, con sus fotografías reales ya organizadas
 * en public/images/.
 *
 * Reglas:
 * - El ORDEN de este array define la prioridad visual del Home:
 *   las Fiestas de 15 son la categoría insignia y van primero.
 * - Comuniones y bautismos comparten tarjeta: todavía no hay fotografía
 *   propia de la categoría, por lo que se usa una imagen editorial del
 *   salón con epígrafe honesto (sin simular ser otra cosa).
 * - Corporativos usa la foto del discurso en recepción (aprobada).
 * - Los textos son aspiracionales pero no afirman servicios no confirmados.
 * - Cada slug corresponde a la futura ruta /eventos/[slug].
 * - Egresados sigue existiendo como categoría de la galería (/galeria).
 */
export type Occasion = {
  slug: string;
  label: string;
  /** Índice editorial para la composición del Home (01, 02, …). */
  index: string;
  description: string;
  whatsappOccasion: WhatsAppOccasion;
  photo: {
    src: string;
    alt: string;
    /** Ratio CSS del contenedor (crop editorial). */
    ratio: string;
  };
};

export const occasions: Occasion[] = [
  {
    slug: "quince",
    label: "Fiestas de 15",
    index: "01",
    description:
      "La noche más esperada: entrada triunfal, ambientación personalizada y cada detalle a la altura de la quinceañera.",
    whatsappOccasion: "quince",
    photo: {
      src: "/images/quince/deco-2.png",
      alt: "Ambientación de fiesta de 15 con letras XV luminosas en ML Salón de Eventos",
      ratio: "16 / 9",
    },
  },
  {
    slug: "bodas",
    label: "Casamientos",
    index: "02",
    description:
      "El día más esperado, celebrado con la elegancia que la ocasión merece.",
    whatsappOccasion: "boda",
    photo: {
      src: "/images/salon/salondec.png",
      alt: "Casamiento ambientado en ML Salón de Eventos",
      ratio: "4 / 3",
    },
  },
  {
    slug: "cumpleanos",
    label: "Cumpleaños",
    index: "03",
    description:
      "Cada año merece su celebración. Cada cumpleaños encuentra su forma.",
    whatsappOccasion: "cumpleanos",
    photo: {
      src: "/images/cumpleanos/cumplenina.png",
      alt: "Cumpleaños celebrado en ML Salón de Eventos",
      ratio: "4 / 3",
    },
  },
  {
    slug: "infantiles",
    label: "Fiestas infantiles",
    index: "04",
    description:
      "Diversión a puro juego para los más chicos: toro mecánico, castillo inflable y juegos.",
    whatsappOccasion: "infantil",
    photo: {
      src: "/images/cumpleanos/decoinfantil.png",
      alt: "Decoración de una fiesta infantil en el salón",
      ratio: "3 / 2",
    },
  },
  {
    slug: "comuniones-bautismos",
    label: "Comuniones y bautismos",
    index: "05",
    description:
      "Celebraciones íntimas en familia, con la calidez y la atención al detalle de siempre.",
    whatsappOccasion: "comunion",
    photo: {
      src: "/images/salon/deco-torta.jpg",
      alt: "Mesa dulce ambientada para una celebración en el salón",
      ratio: "4 / 3",
    },
  },
  {
    slug: "corporativos",
    label: "Corporativos y empresariales",
    index: "06",
    description:
      "Reuniones de trabajo con la logística resuelta y la presencia que la ocasión requiere.",
    whatsappOccasion: "corporativo",
    photo: {
      src: "/images/evento-corporativo-discurso.png",
      alt: "Recepción corporativa con un discurso entre las mesas del salón",
      ratio: "16 / 9",
    },
  },
  {
    slug: "aire-libre",
    label: "Eventos al aire libre",
    index: "07",
    description:
      "Patio y parrilla para eventos diurnos. Pileta de uso diurno, sujeta a disponibilidad de bañero y presupuesto. Las celebraciones nocturnas se realizan en el interior.",
    whatsappOccasion: "aireLibre",
    photo: {
      src: "/images/aire-libre/piletadia.png",
      alt: "La pileta del espacio exterior del salón, de día",
      ratio: "4 / 3",
    },
  },
];
