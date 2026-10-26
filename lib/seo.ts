import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Base de SEO local para ML Salón de Eventos.
 *
 * - Dominio: se toma de NEXT_PUBLIC_SITE_URL. Sin dominio público válido,
 *   se omiten canonical, URLs sociales, sitemap y URLs del JSON-LD.
 * - Las páginas usan buildPageMetadata() con su canonical propia.
 * - Sitemap y robots consumen SITE_URL (app/sitemap.ts, app/robots.ts).
 * - JSON-LD de EventVenue con datos confirmados de data/site.ts.
 */

function configuredSiteUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return undefined;
  try {
    const url = new URL(configured);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username || url.password ||
      /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(url.hostname) ||
      url.hostname.endsWith(".localhost")
    ) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

const SITE_URL = configuredSiteUrl();

/** Base pública del sitio: la usan sitemap, robots y JSON-LD. */
export const SITE_URL_BASE = SITE_URL;

const DEFAULT_TITLE = `${site.name} | Salón de eventos en Catamarca`;
const DEFAULT_DESCRIPTION = site.description;

/** Palabras clave objetivo: SEO local Catamarca (consultas reales). */
const KEYWORDS = [
  "ML Salón de Eventos",
  "salón de eventos en Catamarca",
  "salón de eventos San Fernando del Valle de Catamarca",
  "salón de fiestas en Catamarca",
  "fiestas de 15 Catamarca",
  "casamientos Catamarca",
  "salón para casamientos Catamarca",
  "salón para cumpleaños Catamarca",
  "fiestas infantiles Catamarca",
  "comuniones y bautismos Catamarca",
  "eventos corporativos Catamarca",
  "eventos al aire libre Catamarca",
  "salón con pileta Catamarca",
  "Av. Bartolomé de Castro 2100",
];

/** Imagen OG editorial: fotografía real de una fiesta de 15 (16:9). */
const OG_IMAGE = "/images/quince/entradaquincenera-192d60b00a59.jpg";
const OG_IMAGE_WIDTH = 1365;
const OG_IMAGE_HEIGHT = 768;
const OG_IMAGE_ALT = `Fiesta de 15 en ${site.name}, salón de eventos en Catamarca`;

/** Metadatos raíz: usar solo en app/layout.tsx. */
export function buildBaseMetadata(): Metadata {
  return {
    ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
    title: {
      default: DEFAULT_TITLE,
      template: `%s | ${site.name}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: KEYWORDS,
    ...(SITE_URL ? { alternates: { canonical: "/" } } : {}),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "es_AR",
      ...(SITE_URL ? { url: "/" } : {}),
      siteName: site.name,
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: SITE_URL ? [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      images: SITE_URL ? [OG_IMAGE] : [],
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
    ...(SITE_URL ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title,
      description,
      ...(SITE_URL ? { url: path } : {}),
      images: SITE_URL ? [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
        },
      ] : [],
    },
  };
}

/**
 * JSON-LD de EventVenue: solo datos confirmados (data/site.ts).
 * Se inyecta como script en app/layout.tsx.
 */
export function buildVenueJsonLd(): Record<string, unknown> {
  const { street, postalCode, city, province, country } = site.address;
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: site.name,
    alternateName: "ML Salón de Eventos — Salón de eventos en Catamarca",
    description: site.description,
    ...(SITE_URL ? { url: SITE_URL, image: `${SITE_URL}${OG_IMAGE}` } : {}),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      postalCode,
      addressLocality: city,
      addressRegion: province,
      addressCountry: country,
    },
    sameAs: [site.social.instagram.url, site.social.facebook.url],
  };
}

