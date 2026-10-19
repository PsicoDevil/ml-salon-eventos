import { site } from "@/data/site";

/**
 * Enlace de Google Maps provisto por el cliente y centralizado en data/site.ts.
 */
export function getMapsUrl(): string {
  return site.mapsUrl;
}
