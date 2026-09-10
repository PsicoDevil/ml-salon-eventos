"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Logo from "@/components/brand/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";
import { getPrimaryContact } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

/**
 * Header fijo — barra premium oscura. Sobre el hero: carbón 0.92 con
 * blur moderado (site-header-scrim); al hacer scroll: carbón sólido.
 * Misma barra, dos estados. Active state editorial: hairline dorada
 * bajo la sección visible (IntersectionObserver; /galeria via
 * pathname). El CTA principal degrada a teléfono mientras el canal de
 * WhatsApp no esté confirmado (ver lib/whatsapp.ts).
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const contact = getPrimaryContact("general");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active state: la última sección de navegación visible en viewport.
     Fuera de la home el valor se deriva a null en render (sin setState
     síncrono en el efecto); al volver a "/" el observer lo recalcula. */
  const activeHref = pathname === "/" ? activeSection : null;
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = navigation
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    const elements = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled
          ? "border-b border-gold/25 bg-carbon"
          : "site-header-scrim border-b border-gold/20",
      )}
    >
      <Container className="flex h-20 items-center justify-between lg:h-[84px]">
        <Link
          href="/"
          aria-label={`${site.name} — Inicio`}
          className="flex items-center"
        >
          <Logo size="lg" className="text-ivory" />
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-11">
            {navigation.map((item) => {
              const isInternal =
                item.href.startsWith("/") && !item.href.startsWith("//");
              const isActive = isInternal
                ? pathname === item.href
                : activeHref === item.href;
              const classes = cn(
                "group relative font-sans text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
                isActive ? "text-ivory" : "text-ivory hover:text-gold",
              );
              return (
                <li key={item.href}>
                  {isInternal ? (
                    <Link href={item.href} className={classes}>
                      {item.label}
                      <NavRule active={isActive} />
                    </Link>
                  ) : (
                    <a href={item.href} className={classes}>
                      {item.label}
                      <NavRule active={isActive} />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            href={contact.href}
            external={contact.channel === "whatsapp"}
            size="sm"
            className="hidden h-11 border border-gold/40 bg-ivory px-7 text-[11px] tracking-[0.18em] text-ink hover:bg-white hover:border-gold md:inline-flex"
          >
            Consultar disponibilidad
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-navegacion"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex h-11 w-11 items-center justify-center text-ivory transition-colors hover:text-gold md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={closeMenu} toggleRef={toggleRef} />
    </header>
  );
}

/** Hairline dorada de la navegación: visible en hover y en estado activo. */
function NavRule({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute -bottom-2 left-0 h-px bg-gold transition-all duration-300",
        active ? "w-full" : "w-0 group-hover:w-full",
      )}
    />
  );
}
