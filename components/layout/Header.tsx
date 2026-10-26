"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo from "@/components/brand/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import { navHref, navigation, navigationDesktop } from "@/data/navigation";
import { site } from "@/data/site";
import SocialLinks from "@/components/ui/SocialLinks";
import { cn } from "@/lib/cn";

/**
 * Header fijo — barra premium oscura. Sobre el hero: carbón 0.92 con
 * blur moderado (site-header-scrim); al hacer scroll: carbón sólido.
 * Misma barra, dos estados. Active state editorial: hairline dorada
 * bajo la sección visible (IntersectionObserver; /galeria via
 * pathname). El CTA principal apunta a la sección de contacto del Home
 * (formulario de consulta); las redes sociales viven junto al CTA.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1440px)");
    const onResize = () => {
      if (desktop.matches) closeMenu();
    };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, [closeMenu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500",
        scrolled
          ? "border-b border-gold/25 bg-carbon"
          : "site-header-scrim border-b border-gold/20",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-2 px-4 sm:gap-8 sm:px-10 lg:px-12 min-[1440px]:h-[88px]">
        <Link
          href="/"
          aria-label={`${site.name} — Inicio`}
          onClick={closeMenu}
          className="relative z-[51] flex shrink-0 items-center"
        >
          <Logo size="lg" showWordmarkOnMobile className="text-ivory" />
        </Link>

        <nav aria-label="Navegación principal" className="hidden shrink-0 min-[1440px]:block">
          <ul className="flex items-center gap-8">
            {navigationDesktop.map((item) => {
              const isInternal =
                item.href.startsWith("/") && !item.href.startsWith("//");
              const isActive = isInternal
                ? pathname === item.href
                : activeHref === item.href;
              const classes = cn(
                "group relative inline-flex min-h-11 items-center whitespace-nowrap font-sans text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
                isActive ? "text-ivory" : "text-ivory hover:text-gold",
              );
              return (
                <li key={item.href}>
                  {isInternal ? (
                    <Link href={item.href} className={classes} aria-current={isActive ? "page" : undefined}>
                      {item.label}
                      <NavRule active={isActive} />
                    </Link>
                  ) : (
                    <a href={navHref(item.href)} className={classes} aria-current={isActive ? "location" : undefined}>
                      {item.label}
                      <NavRule active={isActive} />
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <div className="min-[1440px]:border-l min-[1440px]:border-ivory/15 min-[1440px]:pl-5">
            <SocialLinks variant="header" />
          </div>
          <div className="hidden lg:block">
            <Button
              href={pathname === "/" ? "#contacto" : navHref("#contacto")}
              size="sm"
              className="min-h-11 whitespace-nowrap border border-gold/40 hover:border-gold"
            >
              Consultar disponibilidad
            </Button>
          </div>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-navegacion"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="relative z-[51] inline-flex h-11 w-11 shrink-0 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold min-[1440px]:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" aria-hidden />
            ) : (
              <Menu className="h-6 w-6" aria-hidden />
            )}
          </button>
        </div>
      </div>

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
        "absolute bottom-0 left-0 h-px bg-gold transition-all duration-300",
        active ? "w-full" : "w-0 group-hover:w-full",
      )}
    />
  );
}
