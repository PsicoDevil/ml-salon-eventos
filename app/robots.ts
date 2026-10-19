import type { MetadataRoute } from "next";
import { SITE_URL_BASE } from "@/lib/seo";

/**
 * robots.txt (convención Next.js: MetadataRoute.Robots).
 * Sitio público: indexable por completo, con referencia al sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/gestion/",
    },
    ...(SITE_URL_BASE ? { sitemap: `${SITE_URL_BASE}/sitemap.xml` } : {}),
  };
}
