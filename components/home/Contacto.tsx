import ContactForm from "@/components/home/ContactForm";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SocialLinks from "@/components/ui/SocialLinks";
import { site } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * 13 — CONTACTO. Ancla #contacto: formulario de consulta que abre
 * WhatsApp con el mensaje estructurado (lib/whatsapp.ts) + canales
 * confirmados (teléfono, email, redes verificadas, ubicación).
 */
export default function Contacto() {
  const { street, reference, city, province } = site.address;

  const dtClasses =
    "text-[11px] font-semibold uppercase tracking-[0.24em] text-gold";
  const ddClasses = "mt-3 text-sm leading-relaxed text-ivory/80";

  return (
    <section
      id="contacto"
      className="grain scroll-mt-24 bg-carbon text-ivory"
    >
      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Contacto
              </p>
              <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] sm:text-5xl">
                Contanos tu fecha y{" "}
                <span className="italic">armamos la propuesta.</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/75 sm:text-lg">
                Completá la consulta con los datos de tu evento: la respuesta
                llega por WhatsApp con disponibilidad y presupuesto.
              </p>

              <dl className="mt-10 space-y-7">
                <div>
                  <dt className={dtClasses}>Contactos</dt>
                  <dd className={ddClasses}>
                    <a
                      href={`tel:${site.contacts.hugo.phoneTel}`}
                      className="block transition-colors hover:text-gold"
                    >
                      {site.contacts.hugo.phoneDisplay} ·{" "}
                      {site.contacts.hugo.name}
                    </a>
                    <a
                      href={`mailto:${site.email}`}
                      className="block transition-colors hover:text-gold"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className={dtClasses}>Ubicación</dt>
                  <dd className={ddClasses}>
                    {street} · {reference}
                    <br />
                    {city}, {province}
                  </dd>
                </div>

                <div>
                  <dt className={dtClasses}>Seguinos</dt>
                  <dd className="mt-3">
                    <SocialLinks tone="dark" />
                  </dd>
                </div>

                <div>
                  <dt className={dtClasses}>WhatsApp directo</dt>
                  <dd className={ddClasses}>
                    <a
                      href={buildWhatsAppUrl("general")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-gold/50 underline-offset-4 transition-colors hover:text-gold"
                    >
                      Escribinos por WhatsApp
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.12}>
              <div className="border border-ivory/15 bg-carbon/40 p-6 sm:p-9">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
