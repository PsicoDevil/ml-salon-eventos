/**
 * Manifestación de la galería de ML Salón de Eventos.
 *
 * Dos niveles:
 * - galleryCollection: colección COMPLETA de /galeria, agrupada por
 *   categoría. Cada pieza declara sus dimensiones naturales (lightbox y
 *   ratio del tile masonry). Agregar entradas acá sin tocar componentes.
 * - galleryItems: selección curada de 8 piezas para el preview de la
 *   Home (una por categoría, con spans de la grilla editorial de 12
 *   columnas). La Home no muestra la colección completa.
 *
 * Reglas: solo fotografías reales de public/images/; las categorías sin
 * material propio (bautismos, comuniones) simplemente no tienen
 * entradas, por lo que sus filtros no aparecen.
 */

export type GalleryCategory =
  | "bodas"
  | "quince"
  | "egresados"
  | "cumpleanos"
  | "celebraciones"
  | "corporativos"
  | "salon"
  | "detalles"
  | "aire-libre";

export type GalleryItem = {
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Dimensiones naturales de la imagen (lightbox + tile masonry). */
  width: number;
  height: number;
  /** Ratio de crop editorial opcional (preview de la Home); por defecto, el natural. */
  ratio?: string;
  /** Span desktop en la grilla de 12 columnas (solo preview de la Home). */
  span?: string;
  /** Offset vertical opcional para el ritmo asimétrico (preview de la Home). */
  offset?: string;
  /** Sizes de next/image según el ancho que ocupa la pieza. */
  sizes?: string;
};

/** Etiquetas visibles de las categorías (orden editorial estable). */
export const galleryCategoryLabels: Record<GalleryCategory, string> = {
  bodas: "Bodas",
  quince: "Fiestas de 15",
  egresados: "Egresados",
  cumpleanos: "Cumpleaños",
  celebraciones: "Celebraciones",
  corporativos: "Corporativos",
  salon: "Salón",
  detalles: "Detalles",
  "aire-libre": "Aire libre",
};

/** Orden de las categorías para los filtros de /galeria. */
export const galleryCategories = Object.keys(
  galleryCategoryLabels,
) as GalleryCategory[];

/**
 * Colección completa de /galeria: todas las fotografías seleccionadas
 * de public/images/, agrupadas por categoría (los archivos duplicados
 * entre carpetas se listan una sola vez).
 */
export const galleryCollection: GalleryItem[] = [
  // ── Bodas ──────────────────────────────────────────────────────────
  { src: "/images/bodas/boda1.jpg", alt: "Boda celebrada en el salón", category: "bodas", width: 591, height: 1280 },
  { src: "/images/bodas/boda2.jpg", alt: "Momento de la celebración de boda", category: "bodas", width: 591, height: 1280 },
  { src: "/images/bodas/boda3.jpg", alt: "Boda celebrada en el salón", category: "bodas", width: 1067, height: 1263 },
  { src: "/images/bodas/boda4.jpg", alt: "Retrato de la celebración de boda", category: "bodas", width: 1536, height: 2048 },
  { src: "/images/bodas/boda5.jpg", alt: "Invitados en la fiesta de boda", category: "bodas", width: 1536, height: 2048 },
  { src: "/images/bodas/boda6.jpg", alt: "Celebración de boda en el salón", category: "bodas", width: 2048, height: 1536 },
  { src: "/images/bodas/bodaauto.jpg", alt: "El auto de los novios en la llegada", category: "bodas", width: 960, height: 720 },
  { src: "/images/bodas/bodadeco.jpg", alt: "Ambientación de la boda en el salón", category: "bodas", width: 2048, height: 1536 },

  // ── Fiestas de 15 ──────────────────────────────────────────────────
  { src: "/images/quince/entradaquincenera.jpg", alt: "Entrada de la quinceañera a su fiesta", category: "quince", width: 2048, height: 1152 },
  { src: "/images/quince/quinceaner-torta.png", alt: "Torta de la fiesta de 15", category: "quince", width: 1600, height: 1067 },
  { src: "/images/quince/salonbonito.jpg", alt: "Salón ambientado para una fiesta de 15", category: "quince", width: 2048, height: 1365 },
  { src: "/images/quince/salonvistadeco.jpg", alt: "Salón vestido para una fiesta de 15", category: "quince", width: 2048, height: 1536 },

  // ── Egresados ──────────────────────────────────────────────────────
  { src: "/images/egresados/egresados.jpg", alt: "Fiesta de egresados en el salón", category: "egresados", width: 1536, height: 2048 },
  { src: "/images/egresados/fiestajovenes.jpg", alt: "Pista de baile en la fiesta de egresados", category: "egresados", width: 1280, height: 720 },
  // ── Cumpleaños ─────────────────────────────────────────────────────
  { src: "/images/cumpleanos/animadoresinfantil.jpg", alt: "Animación infantil en el cumpleaños", category: "cumpleanos", width: 1440, height: 1440 },
  { src: "/images/cumpleanos/animadorfiesta.jpg", alt: "Animador durante la fiesta infantil", category: "cumpleanos", width: 2048, height: 1153 },
  { src: "/images/cumpleanos/cumplenina.jpg", alt: "Cumpleaños celebrado en el salón", category: "cumpleanos", width: 2048, height: 1536 },
  { src: "/images/cumpleanos/decoinfantil.jpg", alt: "Decoración del cumpleaños infantil", category: "cumpleanos", width: 1280, height: 853 },

  // ── Celebraciones ──────────────────────────────────────────────────
  { src: "/images/celebraciones/comida-mesa.jpg", alt: "Mesa compartida durante la celebración", category: "celebraciones", width: 1280, height: 853 },
  { src: "/images/celebraciones/entradacomida.jpg", alt: "Entrada de los platos a la mesa", category: "celebraciones", width: 2048, height: 1536 },
  { src: "/images/celebraciones/gente-bailando.jpg", alt: "Invitados bailando durante la celebración", category: "celebraciones", width: 1280, height: 786 },
  { src: "/images/celebraciones/gentecomiendo.jpg", alt: "Invitados disfrutando de la cena", category: "celebraciones", width: 960, height: 720 },
  { src: "/images/celebraciones/mesas-cena.jpg", alt: "Mesas preparadas para la cena", category: "celebraciones", width: 1080, height: 730 },

  // ── Corporativos ───────────────────────────────────────────────────
  { src: "/images/corporativos/catering.jpg", alt: "Catering del evento corporativo", category: "corporativos", width: 1280, height: 853 },
  { src: "/images/corporativos/chefmesaconcomida.jpg", alt: "Chef sirviendo en la mesa del evento", category: "corporativos", width: 1071, height: 736 },
  { src: "/images/corporativos/corpo.jpg", alt: "Evento corporativo en el salón", category: "corporativos", width: 1280, height: 853 },
  { src: "/images/corporativos/salon-gente.jpg", alt: "Encuentro corporativo en el salón", category: "corporativos", width: 1280, height: 853 },
  // ── Salón ──────────────────────────────────────────────────────────
  { src: "/images/salon/deco-2.png", alt: "Ambientación del salón", category: "salon", width: 1280, height: 960 },
  { src: "/images/salon/deco-torta.jpg", alt: "Mesa dulce de la celebración", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/deco3.jpg", alt: "Ambientación del salón para la fiesta", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/deco5.jpg", alt: "Detalles de la ambientación del salón", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/deco7.jpg", alt: "Ambientación cálida del salón", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/deco9.jpg", alt: "Ambientación del salón para la celebración", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/decoboda.jpg", alt: "Ambientación de boda en el salón", category: "salon", width: 591, height: 1280 },
  { src: "/images/salon/decoboda3.jpg", alt: "Detalles de la decoración de boda", category: "salon", width: 591, height: 1280 },
  { src: "/images/salon/decocumple.jpg", alt: "Decoración de cumpleaños en el salón", category: "salon", width: 1600, height: 1200 },
  { src: "/images/salon/decocumpleano.jpg", alt: "Ambientación de cumpleaños", category: "salon", width: 1536, height: 2048 },
  { src: "/images/salon/decoracion-cumpleanos.jpg", alt: "Globos y decoración de cumpleaños", category: "salon", width: 1280, height: 852 },
  { src: "/images/salon/decoracion.jpg", alt: "Detalles de la decoración del salón", category: "salon", width: 853, height: 1280 },
  { src: "/images/salon/decosalon4.jpg", alt: "Salón ambientado para la celebración", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/decosalon6.png", alt: "Salón vestido para la celebración", category: "salon", width: 1280, height: 960 },
  { src: "/images/salon/fiestatematica.jpg", alt: "Fiesta temática en el salón", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/ingressodiasalon.jpg", alt: "Ingreso del salón, de día", category: "salon", width: 960, height: 1280 },
  { src: "/images/salon/mesas.jpg", alt: "Mesas del salón vestidas para la celebración", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/puerta-salon.png", alt: "Puerta del salón", category: "salon", width: 1280, height: 960 },
  { src: "/images/salon/salon-deco.jpg", alt: "Ambientación del salón", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/salondec.png", alt: "Interior del salón decorado", category: "salon", width: 1448, height: 1086 },
  { src: "/images/salon/salondecoo8.jpg", alt: "Ambientación del salón para la noche", category: "salon", width: 2048, height: 1536 },
  { src: "/images/salon/torta-felizcumple.png", alt: "Torta de cumpleaños", category: "salon", width: 960, height: 1280 },

  // ── Detalles ───────────────────────────────────────────────────────
  { src: "/images/detalles/banos.jpg", alt: "Baños del salón", category: "detalles", width: 2048, height: 1536 },
  { src: "/images/detalles/cartel-milena.png", alt: "Cartel personalizado de la fiesta", category: "detalles", width: 2048, height: 1366 },
  { src: "/images/detalles/carteleriaegresados.jpg", alt: "Cartelería de la fiesta de egresados", category: "detalles", width: 2048, height: 1536 },

  // ── Aire libre ─────────────────────────────────────────────────────
  { src: "/images/aire-libre/asado-dia-exterior.jpg", alt: "Asado en el espacio exterior, de día", category: "aire-libre", width: 2048, height: 1536 },
  { src: "/images/aire-libre/asado-exterior-dia.jpg", alt: "Parrilla en el espacio exterior", category: "aire-libre", width: 2048, height: 1536 },
  { src: "/images/aire-libre/asadores.jpg", alt: "Asadores del espacio exterior", category: "aire-libre", width: 2048, height: 1536 },
  { src: "/images/aire-libre/decopatiodia.png", alt: "Patio del espacio exterior, de día", category: "aire-libre", width: 1448, height: 1086 },
  { src: "/images/aire-libre/decoracion-entrada.jpg", alt: "Decoración de la entrada", category: "aire-libre", width: 2048, height: 1536 },
  { src: "/images/aire-libre/ninospileta.jpg", alt: "Chicos disfrutando de la pileta", category: "aire-libre", width: 2048, height: 1366 },
  { src: "/images/aire-libre/pileta-tarde.jpg", alt: "La pileta al atardecer", category: "aire-libre", width: 2048, height: 1536 },
  { src: "/images/aire-libre/piletadia.png", alt: "La pileta del espacio exterior, de día", category: "aire-libre", width: 1448, height: 1086 },
  { src: "/images/bodas/piletanoche.jpg", alt: "La pileta iluminada de noche", category: "aire-libre", width: 2048, height: 1536 },
];

/**
 * Preview de la Home: selección curada de 8 piezas (una por categoría,
 * sin repeticiones). La colección completa vive en /galeria.
 */
export const galleryItems: GalleryItem[] = [
  {
    src: "/images/bodas/boda6.jpg",
    alt: "Celebración de boda en el salón",
    category: "bodas",
    width: 2048,
    height: 1536,
    ratio: "16 / 10",
    span: "lg:col-span-8",
    sizes: "(min-width: 1024px) 64vw, 100vw",
  },
  {
    src: "/images/egresados/egresados.jpg",
    alt: "Fiesta de egresados",
    category: "egresados",
    width: 1536,
    height: 2048,
    ratio: "4 / 5",
    span: "lg:col-span-4",
    offset: "lg:mt-20",
    sizes: "(min-width: 1024px) 32vw, 100vw",
  },
  {
    src: "/images/quince/salonvistadeco.jpg",
    alt: "Salón vestido para una fiesta de 15",
    category: "quince",
    width: 2048,
    height: 1536,
    span: "lg:col-span-4",
    sizes: "(min-width: 1024px) 32vw, 100vw",
  },
  {
    src: "/images/celebraciones/mesas-cena.jpg",
    alt: "Mesas preparadas para la cena",
    category: "celebraciones",
    width: 1080,
    height: 730,
    ratio: "3 / 4",
    span: "lg:col-span-3",
    sizes: "(min-width: 1024px) 24vw, 100vw",
  },
  {
    src: "/images/corporativos/salon-gente.jpg",
    alt: "Encuentro corporativo en el salón",
    category: "corporativos",
    width: 1280,
    height: 853,
    span: "lg:col-span-5",
    offset: "lg:mt-12",
    sizes: "(min-width: 1024px) 40vw, 100vw",
  },
  {
    src: "/images/aire-libre/piletadia.png",
    alt: "La pileta del espacio exterior, de día",
    category: "aire-libre",
    width: 1448,
    height: 1086,
    ratio: "16 / 10",
    span: "lg:col-span-7",
    sizes: "(min-width: 1024px) 56vw, 100vw",
  },
  {
    src: "/images/cumpleanos/cumplenina.jpg",
    alt: "Cumpleaños celebrado en el salón",
    category: "cumpleanos",
    width: 2048,
    height: 1536,
    ratio: "4 / 5",
    span: "lg:col-span-5 lg:col-start-8",
    sizes: "(min-width: 1024px) 40vw, 100vw",
  },
  {
    src: "/images/salon/deco3.jpg",
    alt: "Ambientación del salón para la fiesta",
    category: "salon",
    width: 2048,
    height: 1536,
    ratio: "21 / 9",
    span: "lg:col-span-12",
    sizes: "(min-width: 1024px) 92vw, 100vw",
  },
];