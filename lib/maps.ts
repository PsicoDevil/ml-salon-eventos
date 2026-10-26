import { site } from "@/data/site";

/**
 * Búsqueda de la dirección confirmada y centralizada en data/site.ts, sin coordenadas.
 */
export function getMapsUrl(): string {
  return site.mapsUrl;
}
