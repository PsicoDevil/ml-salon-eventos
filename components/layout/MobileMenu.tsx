"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Kicker from "@/components/ui/Kicker";
import SocialLinks from "@/components/ui/SocialLinks";
import { navHref, navigation } from "@/data/navigation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { EASE_OUT_EXPO } from "@/lib/motion";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Menú mobile — panel dropdown compacto bajo el header (no full-screen).
 * Links compactos en Manrope con separadores sutiles + CTA principal de
 * WhatsApp (canal confirmado en lib/whatsapp.ts, sin teléfonos visibles).
 * La X del header (z-50) queda siempre visible sobre el panel (z-45) y
 * cierra; el backdrop cierra al tocar fuera. Animación corta y discreta.
 */
export default function MobileMenu({ open, onClose, toggleRef }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        toggleRef.current?.focus();
      } else if (event.key === "Tab") {
        const links = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
        const controls = [toggleRef.current, ...links].filter((element): element is HTMLElement => element !== null);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    firstLinkRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, toggleRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop: toca fuera del panel para cerrar. */}
          <motion.button
            key="menu-backdrop"
            type="button"
            aria-label="Cerrar menú"
            tabIndex={-1}
            onClick={() => {
              onClose();
              toggleRef.current?.focus();
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 cursor-default bg-carbon/70 backdrop-blur-sm min-[1440px]:hidden"
          />

          <motion.div
            key="menu-panel"
            id="menu-navegacion"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            className="fixed inset-x-4 top-24 z-[45] max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain border border-gold/25 bg-carbon sm:left-auto sm:right-10 sm:w-96 lg:right-12 min-[1440px]:hidden"
          >
            <nav aria-label="Navegación mobile">
              <ul className="divide-y divide-ivory/10 px-2 py-2">
                {navigation.map((item, index) => {
                  const isInternal =
                    item.href.startsWith("/") && !item.href.startsWith("//");
                  const classes =
                    "block min-h-11 px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:text-gold";
                  return (
                    <li key={item.href}>
                      {isInternal ? (
                        <Link
                          href={item.href}
                          ref={index === 0 ? firstLinkRef : undefined}
                          onClick={onClose}
                          className={classes}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={navHref(item.href)}
                          ref={index === 0 ? firstLinkRef : undefined}
                          onClick={onClose}
                          className={classes}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-ivory/10 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <Kicker as="p" tone="dark">
                Seguinos
              </Kicker>
              <SocialLinks className="mt-3" />
              <Button
                href={navHref("#contacto")}
                onClick={onClose}
                className="mt-5 w-full"
              >
                Consultar disponibilidad
              </Button>
              <Button
                href={buildWhatsAppUrl("general")}
                external
                onClick={onClose}
                variant="outline"
                className="mt-3 w-full"
              >
                Consultar por WhatsApp
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
