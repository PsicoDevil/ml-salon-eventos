import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import Hairline from "@/components/ui/Hairline";
import Reveal from "@/components/ui/Reveal";
import GalleryCollection from "@/components/gallery/GalleryCollection";
import { galleryCollection } from "@/data/galeria";
import { getPrimaryContact } from "@/lib/whatsapp";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Galería",
  description:
    "Conocé ML Salón de Eventos a través de una selección de celebraciones, espacios y momentos vividos en Catamarca.",
  path: "/galeria",
});

/**
 * /galeria — archivo visual completo de ML Salón de Eventos:
 * filtros por categoría + composición masonry + lightbox accesible.
 */
export default function GaleriaPage() {
  const contact = getPrimaryContact("general");
  const externalProps =
    contact.channel === "whatsapp"
      ? { target: "_blank" as const, rel: "noopener noreferrer" }
      : {};

  return (
    <div className="bg-ivory">
      <Container className="pb-10 pt-32 sm:pt-40">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet">
            Galería
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-medium leading-[1.04] text-ink sm:text-6xl">
            Momentos reales, <span className="italic">celebrados acá.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            El archivo visual de ML: celebraciones, ambientaciones y
            espacios, tal como se vivieron.
          </p>
        </Reveal>
      </Container>

      <Container className="pb-20 sm:pb-28">
        <Reveal delay={0.1}>
          <GalleryCollection items={galleryCollection} />
        </Reveal>
      </Container>

      <Container className="pb-24 sm:pb-32">
        <Hairline className="bg-ink/10" />
        <Reveal className="pt-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-display text-2xl italic leading-snug text-ink sm:text-3xl">
              ¿Te imaginás tu celebración acá?
            </p>
            <a
              href={contact.href}
              {...externalProps}
              className="group inline-flex items-center gap-4 self-start text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-violet sm:self-auto"
            >
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-14"
              />
              Consultar disponibilidad
            </a>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}