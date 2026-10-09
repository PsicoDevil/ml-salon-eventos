import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import { navHref } from "@/data/navigation";

/**
 * 03 — FIESTAS DE 15. Sección insignia (carbón + grano) que abre el
 * recorrido de ocasiones: fotografías reales de quinceañeras del salón
 * y el CTA de disponibilidad (→ #contacto).
 */

const PROMESAS = [
  "Decoración personalizada con el nombre de la quinceañera",
  "Recepción, salón, exterior y mesa dulce en un mismo predio",
  "Coordinación de horarios con DJ, catering y brindis",
];

export default function FiestasDe15() {
  return (
    <section
      id="fiestas-de-15"
      className="grain scroll-mt-24 bg-carbon text-ivory"
    >
      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Reveal>
              <Photo
                src="/images/quince/entradaquincenera.jpg"
                alt="Entrada de la quinceañera a su fiesta de 15 en ML Salón de Eventos"
                ratio="16 / 9"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="group"
                imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
              />
            </Reveal>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <Reveal delay={0.08}>
                <Photo
                  src="/images/quince/quinceaner-torta.png"
                  alt="La torta de la fiesta de 15 junto a la decoración del salón"
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 24vw, 45vw"
                  className="group"
                  imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
                />
              </Reveal>
              <Reveal delay={0.16}>
                <Photo
                  src="/images/quince/cartel-milena.png"
                  alt="Cartel personalizado con el nombre de la quinceañera"
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 24vw, 45vw"
                  className="group"
                  imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
                />
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Reveal>
              <Kicker tone="dark">Fiestas de 15</Kicker>
              <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
                El inicio de tus{" "}
                <span className="italic">grandes historias.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75 sm:text-lg">
                La noche más esperada merece una entrada triunfal,
                ambientación pensada para la quinceañera y una fiesta que no
                baje. En ML se coordina todo: la recepción, la decoración, la
                mesa dulce y la pista.
              </p>
              <ul className="mt-8 space-y-2.5 text-sm text-ivory/70">
                {PROMESAS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10">
                <Button href={navHref("#contacto")}>
                  Consultar disponibilidad
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
