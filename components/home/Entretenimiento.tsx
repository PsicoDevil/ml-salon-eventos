import {
  MonitorPlay,
  Music2,
  Sparkles,
  Speaker,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Reveal from "@/components/ui/Reveal";
import { adicionales, complementoPremium } from "@/data/servicios";

/**
 * 09 — ENTRETENIMIENTO Y TECNOLOGÍA. Los rubros del servicio en fichas
 * sobrias: DJ, animación, proyección y sonido. La nota de pantalla LED
 * es literal del brief: servicio adicional con costo extra.
 */

type Bloque = {
  id: string;
  titulo: string;
  detalle: string;
  icono: LucideIcon;
  nota?: string;
};

const BLOQUES: Bloque[] = [
  {
    id: "dj",
    titulo: "DJ",
    detalle:
      "Música para cada momento de la noche: de la recepción a la pista, con la lectura del público que mantiene viva la fiesta.",
    icono: Music2,
  },
  {
    id: "animacion",
    titulo: "Animación",
    detalle:
      "Juegos, coreografías y momentos pensados para que nadie se quede sentado. Los más chicos, siempre acompañados.",
    icono: Sparkles,
  },
  {
    id: "proyeccion",
    titulo: "Proyección",
    detalle:
      "Videos y fotos del agasajado proyectados en el momento justo: la develación que siempre sorprende.",
    icono: MonitorPlay,
    nota: "Pantalla para proyección incluida en la Experiencia María Luisa. Pantalla LED: adicional con costo extra.",
  },
  {
    id: "sonido",
    titulo: "Sonido e iluminación",
    detalle:
      "El audio y las luces del salón, coordinados con el servicio gastronómico para que la energía no baje.",
    icono: Speaker,
  },
];

export default function Entretenimiento() {
  return (
    <section className="bg-ivory">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <Kicker>Entretenimiento y tecnología</Kicker>
            <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] text-ink sm:text-5xl">
              La fiesta también se{" "}
              <span className="italic">escucha y se ve.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">
              DJ, animación y proyección se coordinan con el servicio
              gastronómico para que cada momento suene y se vea como debe.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BLOQUES.map((bloque, index) => {
            const Icono = bloque.icono;
            return (
              <Reveal key={bloque.id} delay={index * 0.08}>
                <article className="flex h-full flex-col border border-ink/10 bg-ivory-2 p-6 sm:p-7">
                  <Icono className="h-5 w-5 text-violet" aria-hidden="true" />
                  <h3 className="mt-5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink">
                    {bloque.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">
                    {bloque.detalle}
                  </p>
                  {bloque.nota && (
                    <p className="mt-auto border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink/55 [margin-top:1.25rem]">
                      {bloque.nota}
                    </p>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-10 border border-gold/40 p-6 sm:p-7">
            <h3 className="font-display text-2xl text-ink">Adicionales con costo extra</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">Se presupuestan por separado y no están incluidos en la Experiencia María Luisa.</p>
            <ul className="mt-5 grid gap-3 text-sm text-ink/80 sm:grid-cols-2">
              {adicionales.map((item) => <li key={item.id}>• {item.nombre}</li>)}
            </ul>
            <p className="mt-6 border-t border-ink/10 pt-5 text-sm leading-relaxed text-ink/70">{complementoPremium}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <Button href="#contacto" tone="light">
              Coordinar entretenimiento
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
