import Container from "@/components/ui/Container";
import InteractiveEventShowcase from "@/components/home/InteractiveEventShowcase";
import { occasions } from "@/data/eventos";

/**
 * 03 — EVENTOS. Experiencia interactiva y lineal (reemplaza la lista
 * vertical): una pieza visual única con fotografía protagonista y
 * navegación horizontal editorial. La lógica vive en
 * components/home/InteractiveEventShowcase.tsx; los datos, en
 * data/eventos.ts. Cada slug queda preparado para /eventos/[slug].
 */
export default function Eventos() {
  return (
    <section id="eventos" className="scroll-mt-24 bg-ivory-2">
      <Container className="py-20 sm:py-28">
        <InteractiveEventShowcase occasions={occasions} />
      </Container>
    </section>
  );
}