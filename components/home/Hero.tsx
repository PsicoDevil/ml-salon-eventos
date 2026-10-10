import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

/**
 * 01 — HERO. Portada de revista: fotografía full viewport (la entrada
 * de la quinceañera, la ocasión insignia de la casa), contenido
 * mínimo (titular y CTAs). La marca y la ubicación viven en el header
 * y en las secciones correspondientes. Sin sliders ni animaciones pesadas.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[min(70svh,160vw)] items-end overflow-hidden bg-carbon text-ivory sm:min-h-svh">
      <Image
        src="/images/hero-quinceanera.png"
        alt="Entrada de la quinceañera ante los invitados en su fiesta de 15 en ML Salón de Eventos"
        fill
        preload
        sizes="(max-aspect-ratio: 9/5) 183vh, 100vw"
        className="object-cover object-[56%_40%] sm:object-[center_40%]"
      />

      {/* Velo sutil de legibilidad (no decorativo) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-carbon/10"
      />

      <Container className="relative z-[2] pb-16 pt-40 sm:pb-24">
        <Reveal delay={0.12}>
          <h1 className="max-w-4xl">
            <span className="block font-display text-[clamp(3rem,8vw,6.25rem)] font-medium leading-[1.0]">
              El momento <span className="italic">empieza acá.</span>
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center">
            <Button href="#contacto">
              Consultar disponibilidad
            </Button>
            <Button href="#eventos" variant="outline">
              Ver eventos
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
