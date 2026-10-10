import { Wine } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

/**
 * 08 — CATERING. La secuencia gastronómica del evento (recepción →
 * plato principal → postre → fin de fiesta) más el bloque de bebidas.
 * El menú y la selección exacta se definen en el asesoramiento previo.
 */

/** Secuencia gastronómica del evento. */
const PASOS = [
  {
    paso: "01",
    titulo: "Recepción",
    detalle:
      "La primera etapa del catering tradicional completo, para recibir a tus invitados.",
  },
  {
    paso: "02",
    titulo: "Plato principal",
    detalle:
      "El plato principal del catering tradicional, como parte de la celebración.",
  },
  {
    paso: "03",
    titulo: "Postre",
    detalle:
      "El momento dulce del menú, incluido en el catering tradicional completo.",
  },
  {
    paso: "04",
    titulo: "Fin de fiesta",
    detalle:
      "Comida de fin de fiesta para acompañar el cierre de la celebración.",
  },
];

/** Rubros de bebidas del servicio. */
const BEBIDAS = [
  "Línea Coca-Cola, agua y soda",
  "Hasta 2 vinos por mesa de adultos",
];

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
                completo, de la recepción a la comida de fin de fiesta. El menú se
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
              <Photo
                src="/images/celebraciones/comida-mesa.jpg"
                alt="La mesa servida durante la celebración en ML Salón de Eventos"
                ratio="4 / 3"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="group"
                imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
              />

              <div className="mt-6 border border-ivory/15 p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <Wine className="h-4 w-4 text-gold" aria-hidden="true" />
                  <Kicker as="p" tone="dark">
                    Bebidas
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
