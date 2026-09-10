import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";
import Kicker from "@/components/ui/Kicker";
import { getPrimaryContact } from "@/lib/whatsapp";

/**
 * 07 — CORPORATIVO. Compacto: una fotografía potente + texto breve +
 * CTA. Sin cards y sin servicios inventados: el texto invita a consultar.
 */
export default function Corporativo() {
  const contact = getPrimaryContact("corporativo");

  return (
    <section className="grain bg-carbon text-ivory">
      <Container className="py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-6">
            <Photo
              src="/images/corporativos/corpo.jpg"
              alt="Evento corporativo en ML Salón de Eventos"
              ratio="16 / 10"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="group"
              imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
            />
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-5 lg:col-start-8">
            <Kicker tone="dark">Corporativo</Kicker>
            <h2 className="mt-4 font-display text-4xl font-medium leading-[1.08] sm:text-5xl">
              Encuentros que también{" "}
              <span className="italic">necesitan presencia.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/70 sm:text-base">
              Agasajos y encuentros de empresas en el mismo escenario que las
              grandes celebraciones. Contanos qué tenés en mente.
            </p>
            <div className="mt-8">
              <Button
                href={contact.href}
                external={contact.channel === "whatsapp"}
              >
                Consultar disponibilidad
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}