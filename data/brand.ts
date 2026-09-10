/**
 * Configuración de marca.
 *
 * logoSrc apunta al logo REAL cuando exista en public/images/. Hoy el
 * archivo todavía no fue provisto (la carpeta branding/ no existe), por
 * lo que se usa el fallback tipográfico del componente Logo. Al
 * incorporar el archivo, completar la ruta y nada más necesita cambios.
 * No inventar ni rediseñar el logo.
 */
export const brand = {
  logoSrc: "",
  logoAlt: "ML Salón de Eventos",
  monogram: "ML",
  wordmark: "Salón de Eventos",
} as const;