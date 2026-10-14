import Image from "next/image";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * 09 — CTA FINAL. Cierre oscuro con fotografía a sangre bajo un velo
 * carbón profundo: el final natural de una experiencia premium.
 * Conversión: formulario de consulta y WhatsApp (lib/whatsapp.ts).
 */
export default function CtaFinal() {
  return (
    <section className="grain relative overflow-hidden bg-carbon text-ivory">
      <Image
        src="/images/salon/decoboda.jpg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-carbon/95 via-carbon/85 to-carbon/95"
      />

      <Container className="relative z-[2] py-28 text-center sm:py-40">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            Reservá tu fecha
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance font-display text-5xl font-medium leading-[1.04] sm:text-6xl lg:text-7xl">
            ¿Imaginamos <span className="italic">tu próximo evento?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="#contacto">
              Solicitar presupuesto
            </Button>
            <Button
              href={buildWhatsAppUrl("general")}
              external
              variant="outline"
              tone="dark"
            >
              Consultar por WhatsApp
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
