/**
 * Navegación principal.
 *
 * Anclas para las secciones del Home; las páginas existentes usan su
 * ruta real. Cuando se construyan las páginas faltantes, reemplazar:
 *   Eventos  → /eventos
 *   Contacto → /contacto
 */

export type NavItem = {
  label: string;
  href: string;
};

export const navigation: NavItem[] = [
  { label: "Eventos", href: "#eventos" },
  { label: "El Espacio", href: "#el-espacio" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "#contacto" },
];
