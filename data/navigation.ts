/**
 * Navegación principal.
 *
 * Anclas para las secciones del Home; las páginas existentes usan su
 * ruta real. La barra de escritorio omite "Inicio" (la marca del header
 * ya enlaza a la home); el menú mobile y el footer la incluyen.
 * Cuando se construyan las páginas faltantes, reemplazar:
 *   Eventos  → /eventos
 *   Contacto → /contacto
 */

export type NavItem = {
  label: string;
  href: string;
};

export const navigation: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Fiestas de 15", href: "#fiestas-de-15" },
  { label: "Eventos", href: "#eventos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "#contacto" },
];

/** Versión compacta para la barra de navegación de escritorio. */
export const navigationDesktop: NavItem[] = navigation.filter(
  (item) => item.href !== "/",
);

/**
 * Los enlaces con ancla (#…) apuntan a secciones del Home.
 * Al prefijar "/" funcionan desde cualquier página: Next.js navega
 * a "/" y hace scroll a la sección correspondiente.
 */
export function navHref(href: string): string {
  return href.startsWith("#") ? `/${href}` : href;
}

