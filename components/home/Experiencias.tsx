import Container from "@/components/ui/Container";
import Kicker from "@/components/ui/Kicker";
import Photo from "@/components/ui/Photo";
import Reveal from "@/components/ui/Reveal";

/**
 * 05 — EXPERIENCIAS. Editorial fotográfico: dos fotografías en par, a
 * la misma escala, lado a lado (una columna en mobile), con pequeños
 * epígrafes. Sin grilla de cards; sin promesas comerciales: los
 * epígrafes describen la foto.
 */
export default function Experiencias() {
  return (
    <section className="bg-ivory">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker>Experiencias</Kicker>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-medium leading-[1.06] text-ink sm:text-5xl">
                Los detalles que{" "}
                <span className="italic">hacen a la noche.</span>
              </h2>
            </div>
            <p className="max-w-xs pb-1 text-sm leading-relaxed text-ink/60">
              Del brindis a la mesa dulce, del salón al exterior.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <Reveal delay={0.08}>
            <figure>
              <Photo
                src="/images/detalles/copasexterior.png"
                alt="Copas durante el brindis en el espacio exterior"
                ratio="4 / 3"
                sizes="(min-width: 640px) 50vw, 100vw"
                className="group"
                imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
              />
              <figcaption className="mt-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/55">
                <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
                La mesa, el centro de la noche
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.16}>
            <figure>
              <Photo
                src="/images/aire-libre/piletanoche.png"
                alt="Pileta del espacio exterior al atardecer"
                ratio="4 / 3"
                sizes="(min-width: 640px) 50vw, 100vw"
                className="group"
                imageClassName="motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
              />
              <figcaption className="mt-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/55">
                <span aria-hidden="true" className="h-px w-8 bg-gold/60" />
                El exterior, al atardecer
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}