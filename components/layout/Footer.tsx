import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import Logo from "@/components/brand/Logo";
import Hairline from "@/components/ui/Hairline";
import Kicker from "@/components/ui/Kicker";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";

/**
 * Footer carbón: marca, ubicación real, contactos confirmados y navegación.
 * Sin información inventada: solo lo confirmado por ML.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { street, reference, city, province, country } = site.address;

  return (
    <footer id="contacto" className="scroll-mt-24 bg-carbon text-ivory">
      <Hairline className="bg-gold/25" />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
          <div>
            <Link
              href="/"
              aria-label={`${site.name} — Inicio`}
              className="inline-block"
            >
              <Logo size="md" className="text-ivory" />
            </Link>
            <p className="mt-6 max-w-xs font-display text-xl italic leading-snug text-ivory/75">
              {site.claim}
            </p>
          </div>

          <div>
            <Kicker as="h2" tone="dark">
              Ubicación
            </Kicker>
            <address className="mt-5 text-sm not-italic leading-relaxed text-ivory/70">
              {street}
              <br />
              {reference}
              <br />
              {city}
              <br />
              {province} · {country}
            </address>
          </div>

          <div>
            <Kicker as="h2" tone="dark">
              Contacto
            </Kicker>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              <li>
                <a
                  href={`tel:${site.contacts.hugo.phoneTel}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {site.contacts.hugo.phoneDisplay} · {site.contacts.hugo.name}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.contacts.walther.phoneTel}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  {site.contacts.walther.phoneDisplay} ·{" "}
                  {site.contacts.walther.name}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <Kicker as="h2" tone="dark">
              Navegación
            </Kicker>
            <ul className="mt-5 space-y-3 text-sm text-ivory/70">
              {navigation.map((item) => {
                const isInternal =
                  item.href.startsWith("/") && !item.href.startsWith("//");
                return (
                  <li key={item.href}>
                    {isInternal ? (
                      <Link
                        href={item.href}
                        className="transition-colors hover:text-gold"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="transition-colors hover:text-gold"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-ivory/10 pt-6 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>
          <p>
            {city} · {province} · {country}
          </p>
        </div>
      </Container>
    </footer>
  );
}
