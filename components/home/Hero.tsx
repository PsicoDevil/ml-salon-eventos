import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { getPrimaryContact } from "@/lib/whatsapp";

/**
 * 01 — HERO. Portada de revista: fotografía full viewport, contenido
 * mínimo (marca + lugar, titular, CTAs). La marca ya vive en el header;
 * acá se presenta como lockup editorial, sin elementos innecesarios
 * sobre la fotografía. Sin sliders ni animaciones pesadas.
 */
export default function Hero() {
  const contact = getPrimaryContact("general");

  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-carbon text-ivory">
      <Image
        src="/images/salon/salondec.png"
        alt="Interior del salón de ML Salón de Eventos decorado para una celebración"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Velo sutil de legibilidad (no decorativo) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-carbon/10"
      />

      <Container className="relative z-[2] pb-16 pt-40 sm:pb-24">
        <Reveal>
          <div className="flex items-center gap-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-ivory/90">
              ML Salón de Eventos
            </p>
            <span aria-hidden="true" className="h-px w-10 bg-gold/60" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">
              Catamarca
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,8vw,6.25rem)] font-medium leading-[1.0]">
            El momento <span className="italic">empieza acá.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              href={contact.href}
              external={contact.channel === "whatsapp"}
            >
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
