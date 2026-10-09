import type { MetadataRoute } from "next";
import { SITE_URL_BASE } from "@/lib/seo";

/**
 * Sitemap del sitio (convención Next.js: MetadataRoute.Sitemap).
 * Páginas existentes hoy: Home (/) y Galería (/galeria).
 * Cuando se sumen /eventos y /contacto, agregarlas acá.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL_BASE}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL_BASE}/galeria`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
