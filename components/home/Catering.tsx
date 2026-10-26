import { Wine } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import CateringCarousel from "@/components/home/CateringCarousel";
import Reveal from "@/components/ui/Reveal";
import { catering as PASOS, bebidas as BEBIDAS } from "@/data/servicios";

/**
 * 08 — CATERING. La secuencia gastronómica del evento (recepción →
 * plato principal → postre → fin de fiesta) más el bloque de bebidas.
 * El menú y la selección exacta se definen en el asesoramiento previo.
 */

export default function Catering() {
  return (
    <section className="grain bg-carbon text-ivory">
      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <Reveal>
              <Kicker tone="dark">Catering</Kicker>
              <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
                La mesa,{" "}
                <span className="italic">también protagonista.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75 sm:text-lg">
                La Experiencia María Luisa incluye catering tradicional
                completo, de la recepción a la comida de cierre. El menú se
                define en el asesoramiento previo a tu evento.
              </p>
            </Reveal>

            <ol className="mt-10">
              {PASOS.map((item, index) => (
                <Reveal key={item.paso} delay={index * 0.06}>
                  <li className="border-t border-ivory/10 py-5">
                    <div className="flex gap-5">
                      <span
                        aria-hidden="true"
                        className="font-display text-lg italic leading-none text-gold/90"
                      >
                        {item.paso}
                      </span>
                      <div>
                        <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em]">
                          {item.titulo}
                        </h3>
                        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ivory/65">
                          {item.detalle}
                        </p>
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <CateringCarousel />

              <div className="mt-6 border border-ivory/15 p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <Wine className="h-4 w-4 text-gold" aria-hidden="true" />
                  <Kicker as="p" tone="dark">
                    Bebidas y barra
                  </Kicker>
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-ivory/70">
                  {BEBIDAS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-ivory/10 pt-4 text-xs leading-relaxed text-ivory/45">
                  La selección completa se coordina en el asesoramiento previo.
                </p>
              </div>

              <div className="mt-8">
                <Button
                  href="#contacto"
                  variant="outline"
                  tone="dark"
                >
                  Solicitar presupuesto
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
