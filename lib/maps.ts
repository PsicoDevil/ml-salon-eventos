import { site } from "@/data/site";

/**
 * URL de búsqueda en Google Maps construida SOLO con la dirección
 * confirmada en data/site.ts. No se inventan coordenadas: Maps resuelve
 * la dirección textual.
 */
export function getMapsUrl(): string {
  const query = [
    site.address.street,
    site.address.reference,
    site.address.city,
    site.address.province,
    site.address.country,
  ].join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}