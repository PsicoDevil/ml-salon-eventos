import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Base de SEO local para ML Salón de Eventos.
 *
 * - Dominio: se toma de NEXT_PUBLIC_SITE_URL. No hay dominio confirmado
 *   todavía, por lo que el fallback es localhost (solo desarrollo).
 * - Las páginas futuras usan buildPageMetadata() con su canonical propia.
 * - Sitemap, robots y JSON-LD completos llegan en fases posteriores.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DEFAULT_TITLE = `${site.name} | Salón de eventos en Catamarca`;
const DEFAULT_DESCRIPTION = site.description;

/** Metadatos raíz: usar solo en app/layout.tsx. */
export function buildBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: `%s | ${site.name}`,
    },
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: "/",
      siteName: site.name,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

/** Metadatos por página: título + canonical + OG coherentes. */
export function buildPageMetadata(options: {
  title: string;
  description?: string;
  /** Ruta para canonical y OG url, ej. "/eventos/bodas". */
  path?: string;
}): Metadata {
  const { title, description = DEFAULT_DESCRIPTION, path = "/" } = options;
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
    },
  };
}
