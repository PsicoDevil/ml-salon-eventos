import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Base de SEO local para ML Salón de Eventos.
 *
 * - Dominio: se toma de NEXT_PUBLIC_SITE_URL. No hay dominio confirmado
 *   todavía, por lo que el fallback es localhost (solo desarrollo).
 * - Las páginas usan buildPageMetadata() con su canonical propia.
 * - Sitemap y robots consumen SITE_URL (app/sitemap.ts, app/robots.ts).
 * - JSON-LD de EventVenue con datos confirmados de data/site.ts.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Base pública del sitio: la usan sitemap, robots y JSON-LD. */
export const SITE_URL_BASE = SITE_URL;

const DEFAULT_TITLE = `${site.name} | Salón de eventos en Catamarca`;
const DEFAULT_DESCRIPTION = site.description;

/** Palabras clave objetivo: SEO local Catamarca (consultas reales). */
const KEYWORDS = [
  "ML Salón de Eventos",
  "salón de eventos en Catamarca",
  "salón de eventos San Fernando del Valle de Catamarca",
  "fiestas de 15 Catamarca",
  "casamientos Catamarca",
  "salón para cumpleaños Catamarca",
  "fiestas infantiles Catamarca",
  "comuniones y bautismos Catamarca",
  "eventos corporativos Catamarca",
  "eventos al aire libre Catamarca",
  "salón con pileta Catamarca",
  "Dique El Jumeal",
];

/** Imagen OG editorial: fotografía real de una fiesta de 15 (16:9). */
const OG_IMAGE = "/images/quince/entradaquincenera.jpg";
const OG_IMAGE_WIDTH = 2048;
const OG_IMAGE_HEIGHT = 1152;
const OG_IMAGE_ALT = `Fiesta de 15 en ${site.name}, salón de eventos en Catamarca`;

/** Metadatos raíz: usar solo en app/layout.tsx. */
export function buildBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: `%s | ${site.name}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: KEYWORDS,
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: "/",
      siteName: site.name,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: [OG_IMAGE],
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
    keywords: KEYWORDS,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      images: [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
  };
}

/**
 * JSON-LD de EventVenue: solo datos confirmados (data/site.ts).
 * Se inyecta como script en app/layout.tsx.
 */
export function buildVenueJsonLd(): Record<string, unknown> {
  const { street, city, province, country } = site.address;
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: site.name,
    alternateName: "ML Salón de Eventos — Salón de eventos en Catamarca",
    description: site.description,
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE}`,
    telephone: site.contacts.hugo.phoneTel,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressRegion: province,
      addressCountry: country,
    },
    sameAs: [site.social.instagram.url, site.social.facebook.url],
  };
}

