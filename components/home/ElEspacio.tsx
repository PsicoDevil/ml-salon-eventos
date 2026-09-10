import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";
import { getMapsUrl } from "@/lib/maps";

/**
 * 04 — EL ESPACIO. Composición arquitectónica: encabezado editorial,
 * una fotografía protagonista de gran superficie y una secundaria que
 * se superpone. Comunica "este es el lugar", sin describir capacidades.
 */
export default function ElEspacio() {
  const { street, reference, city, province } = site.address;

  return (
    <section id="el-espacio" className="grain scroll-mt-24 bg-carbon text-ivory">
      <Container className="py-20 sm:py-28">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Kicker tone="dark">El espacio</Kicker>
              <h2 className="mt-4 font-display text-5xl font-medium leading-[1.04] sm:text-6xl">
                Este es <span className="italic">el lugar.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1}>
              <p className="max-w-xs text-sm leading-relaxed text-ivory/70">
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
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.08} className="mt-12 sm:mt-14">
          <Photo
            src="/images/salon/mesas.jpg"
            alt="Mesas del salón vestidas para una celebración"
            ratio="16 / 8"
            sizes="(min-width: 1024px) 92vw, 100vw"
            className="group"
            imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
          />
        </Reveal>

        <Reveal
          delay={0.18}
          className="relative z-10 mt-6 w-2/3 sm:w-1/2 lg:-mt-24 lg:ml-8 lg:w-2/5"
        >
          <Photo
            src="/images/salon/decosalon4.jpg"
            alt="Salón ambientado para una celebración"
            ratio="4 / 5"
            sizes="(min-width: 1024px) 26vw, 60vw"
            className="ring-1 ring-carbon"
          />
        </Reveal>
      </Container>
    </section>
  );
}
