import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { getMapsUrl } from "@/lib/maps";

/**
 * 04 — EL ESPACIO. Composición fotográfica editorial: una única imagen
 * protagonista a gran escala con el texto superpuesto en su zona baja
 * (velo carbón muy sutil + blur, solo detrás del texto). Sin tarjetas,
 * sin collage, sin grilla: la fotografía protagoniza.
 */
export default function ElEspacio() {
  const { street, reference, city, province } = site.address;

  return (
    <section id="el-espacio" className="grain scroll-mt-24 bg-carbon text-ivory">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <div className="relative">
            <Photo
              src="/images/salon/marialuisa.png"
              alt="El salón principal de ML Salón de Eventos"
              ratio="16 / 9"
              sizes="(min-width: 1024px) 92vw, 100vw"
              className="group"
              imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
            />

            {/* Texto sobre la foto. Desktop: superpuesto en la zona baja,
                sobre un velo carbón muy sutil con blur leve (solo detrás
                del texto). Mobile: fluye bajo la imagen sobre el carbón
                de la sección, siempre perfectamente legible. */}
            <div className="relative z-10 sm:absolute sm:inset-x-0 sm:bottom-0">
              <div className="bg-carbon/60 pb-2 pt-8 backdrop-blur-md sm:mb-10 sm:ml-10 sm:mr-auto sm:max-w-md sm:bg-carbon/45 sm:p-8 sm:pb-0 sm:pt-0 sm:backdrop-blur-sm lg:mb-14 lg:ml-14">
                <Kicker tone="dark">El espacio</Kicker>
                <h2 className="mt-4 font-display text-5xl font-medium leading-[1.04] sm:text-6xl">
                  Este es <span className="italic">el lugar.</span>
                </h2>
                <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/80">
                  {street} · {reference}
                  <br />
                  {city}, {province}
                </p>
                <Button
                  href={getMapsUrl()}
                  variant="outline"
                  tone="dark"
                  size="sm"
                  external
                  className="mt-5"
                >
                  Cómo llegar
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
