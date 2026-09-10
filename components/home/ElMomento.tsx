import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

/**
 * 02 — EL MOMENTO. Composición editorial: la fotografía protagonista
 * sangra hasta el borde derecho con gran escala; el texto respira en
 * una columna estrecha. Sin bloque tradicional ni espacio vacío.
 */
export default function ElMomento() {
  return (
    <section className="bg-ivory">
      <Container className="py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <Reveal>
              <Kicker>El momento</Kicker>
              <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] text-ink sm:text-5xl lg:text-[3.4rem]">
                Celebraciones que{" "}
                <span className="italic">quedan en la memoria.</span>
              </h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-ink/70 sm:text-lg">
                ML Salón de Eventos es un espacio pensado para acompañar
                momentos especiales, desde celebraciones sociales y familiares
                hasta encuentros corporativos.
              </p>
              <span
                aria-hidden="true"
                className="mt-8 hidden h-px w-16 bg-gold/60 lg:block"
              />
              <p className="mt-6 hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-ink/50 lg:block">
                San Fernando del Valle de Catamarca
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-8 lg:-mr-12">
            <Photo
              src="/images/salon/decoracion.jpg"
              alt="Detalles de la decoración del salón"
              ratio="4 / 5"
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="group"
              imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}