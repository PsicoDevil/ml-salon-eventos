import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { navHref } from "@/data/navigation";

/**
 * 06 — AIRE LIBRE. Sección clara que presenta el exterior del salón
 * (patio, parrilla y pileta) para eventos diurnos: las fotografías son
 * de día y el texto aclara que las noches transcurren en el interior.
 */
export default function AireLibre() {
  const promesas = [
    "Eventos diurnos: mediodía y tarde",
    "Parrilla y asadores para el clásico asado",
    "Pileta con solárium para las piletadías",
  ];

  return (
    <section className="bg-ivory-2">
      <Container className="py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <Kicker>Aire libre</Kicker>
              <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] text-ink sm:text-5xl">
                Patio, parrilla y pileta,{" "}
                <span className="italic">a cielo abierto.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70 sm:text-lg">
                El exterior del salón es el escenario ideal para los eventos
                de día: cumpleaños y agasajos con asado, piletadía para los
                más chicos y juntadas al sol. Las celebraciones nocturnas
                transcurren en el interior del salón.
              </p>
              <ul className="mt-8 space-y-2.5 text-sm text-ink/70">
                {promesas.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button href={navHref("#contacto")} tone="light">
                  Consultar disponibilidad
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <figure>
                <Photo
                  src="/images/aire-libre/piletadia.png"
                  alt="La pileta del espacio exterior del salón, de día"
                  ratio="16 / 10"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="group"
                  imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
                />
                <figcaption className="mt-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/55">
                  <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
                  Piletadía, al sol
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.16}>
              <figure className="ml-auto mt-6 w-full sm:w-2/3">
                <Photo
                  src="/images/aire-libre/asado-dia-exterior.jpg"
                  alt="Asado preparado en el patio exterior del salón, de día"
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="group"
                  imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
                />
                <figcaption className="mt-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/55">
                  <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
                  El asado, al mediodía
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
