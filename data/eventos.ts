import type { WhatsAppOccasion } from "@/lib/whatsapp";

/**
 * Ocasiones que ML acompaña, con sus fotografías reales ya organizadas
 * en public/images/.
 *
 * Reglas:
 * - Solo se listan categorías con fotografía disponible (bautismos y
 *   comuniones se incorporarán cuando exista material propio).
 * - Los textos son aspiracionales pero no afirman servicios no confirmados.
 * - Cada slug corresponde a la futura ruta /eventos/[slug].
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
    slug: "bodas",
    label: "Bodas",
    index: "01",
    description:
      "El día más esperado, celebrado con la elegancia que la ocasión merece.",
    whatsappOccasion: "boda",
    photo: {
      src: "/images/bodas/bodadeco.jpg",
      alt: "Celebración de boda en ML Salón de Eventos",
      ratio: "4 / 3",
    },
  },
  {
    slug: "quince",
    label: "Fiestas de 15",
    index: "02",
    description: "Una fiesta a la altura de un momento que no se repite.",
    whatsappOccasion: "quince",
    photo: {
      src: "/images/quince/entradaquincenera.jpg",
      alt: "Entrada de la quinceañera a su fiesta",
      ratio: "16 / 9",
    },
  },
  {
    slug: "egresados",
    label: "Egresados",
    index: "03",
    description: "La despedida que cierra una etapa y abre todo lo que viene.",
    whatsappOccasion: "egresados",
    photo: {
      src: "/images/egresados/fiestajovenes.jpg",
      alt: "Fiesta de egresados en el salón",
      ratio: "16 / 9",
    },
  },
  {
    slug: "cumpleanos",
    label: "Cumpleaños",
    index: "04",
    description:
      "Cada año merece su celebración. Cada cumpleaños encuentra su forma.",
    whatsappOccasion: "cumpleanos",
    photo: {
      src: "/images/cumpleanos/cumplenina.jpg",
      alt: "Cumpleaños celebrado en el salón",
      ratio: "4 / 3",
    },
  },
  {
    slug: "celebraciones",
    label: "Celebraciones",
    index: "05",
    description:
      "Bautismos, comuniones y encuentros familiares que piden un lugar especial.",
    whatsappOccasion: "celebracion",
    photo: {
      src: "/images/celebraciones/gente-bailando.jpg",
      alt: "Invitados bailando durante una celebración",
      ratio: "3 / 2",
    },
  },
  {
    slug: "corporativos",
    label: "Corporativos",
    index: "06",
    description:
      "Encuentros de empresas con la presencia que la ocasión requiere.",
    whatsappOccasion: "corporativo",
    photo: {
      src: "/images/corporativos/salon-gente.jpg",
      alt: "Encuentro corporativo en el salón",
      ratio: "3 / 2",
    },
  },
];