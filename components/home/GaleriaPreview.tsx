import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { galleryItems } from "@/data/galeria";

/**
 * 06 — GALERÍA (preview). Selección curada de 8 piezas en composición
 * editorial asimétrica con lightbox accesible. La colección completa
 * vive en /galeria; el enlace de cierre es editorial, no un botón.
 */
export default function GaleriaPreview() {
  return (
    <section id="galeria" className="scroll-mt-24 bg-ivory-2">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <SectionHeading
            kicker="Galería"
            title={
              <>
                Momentos reales, <span className="italic">celebrados acá.</span>
              </>
            }
            description="Una selección de lo que ya pasó en el salón. Tocá cualquier imagen para verla en grande."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-14 sm:mt-16">
          <GalleryGrid items={galleryItems} />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-14 flex justify-center sm:mt-16">
            <Link
              href="/galeria"
              className="group inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:text-violet"
            >
              <span
                aria-hidden="true"
                className="h-px w-8 bg-gold transition-all duration-300 group-hover:w-14"
              />
              Ver toda la galería
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}