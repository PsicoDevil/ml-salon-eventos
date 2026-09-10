import { MapPin } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { getMapsUrl } from "@/lib/maps";

/**
 * 08 — UBICACIÓN. Compacta y discreta: dirección confirmada + enlace a
 * Google Maps construido sin coordenadas inventadas (lib/maps.ts).
 */
export default function Ubicacion() {
  const { street, reference, city, province, country } = site.address;

  return (
    <section id="ubicacion" className="scroll-mt-24 bg-ivory">
      <Container className="py-16 sm:py-20">
        <Reveal>
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Kicker>Ubicación</Kicker>
              <h2 className="mt-3 font-display text-3xl font-medium leading-snug text-ink sm:text-4xl">
                Camino al Dique <span className="italic">El Jumeal.</span>
              </h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-ink/65">
                {street} · {reference} — {city}, {province}, {country}
              </address>
            </div>
            <Button
              href={getMapsUrl()}
              variant="outline"
              tone="light"
              size="sm"
              external
              className="shrink-0 self-start sm:self-auto"
            >
              <MapPin className="h-4 w-4" aria-hidden />
              Abrir en Google Maps
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}