import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { planes } from "@/data/servicios";

/**
 * 07 — SERVICIOS. Los dos servicios de ML (data/servicios.ts) en tarjetas
 * editoriales: Servicio Salón y Experiencia María Luisa (destacada).
 * Sin precios: los presupuestos se cierran por WhatsApp.
 */
export default function Servicios() {
  return (
    <section id="servicios" className="scroll-mt-24 bg-ivory">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <Kicker>Servicios</Kicker>
            <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] text-ink sm:text-5xl">
              Dos formas de festejar,{" "}
              <span className="italic">una misma dedicación.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              Elegí el servicio que mejor acompañe tu fecha. Los presupuestos
              se arman a medida para cada evento: consultá por WhatsApp.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {planes.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.12} className="min-w-0">
              <article
                className={`flex h-full flex-col border p-7 sm:p-10 ${
                  plan.featured
                    ? "border-gold/50 bg-ivory-2"
                    : "border-ink/10 bg-ivory"
                }`}
              >
                <div className="flex flex-col items-start justify-between gap-4 xl:flex-row">
                  <div className="min-w-0">
                    <Kicker as="p">{plan.kicker}</Kicker>
                    <h3 className="mt-3 font-display text-3xl font-medium leading-tight text-ink">
                      {plan.name}
                    </h3>
                  </div>
                  {plan.featured && (
                    <span className="shrink-0 bg-violet px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">
                      Servicio insignia
                    </span>
                  )}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-ink/70">
                  {plan.description}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-ink/80"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-violet"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 border-t border-ink/10 pt-6">
                  <Button href="#contacto" tone="light" size="sm">
                    {plan.featured
                      ? "Solicitar presupuesto"
                      : "Consultar disponibilidad"}
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
