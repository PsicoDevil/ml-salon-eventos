"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { navigation } from "@/data/navigation";
import { getPrimaryContact } from "@/lib/whatsapp";
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
  const contact = getPrimaryContact("general");

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
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
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 cursor-default bg-carbon/70 backdrop-blur-sm md:hidden"
          />

          <motion.div
            key="menu-panel"
            id="menu-navegacion"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
            className="fixed inset-x-4 top-20 z-[45] overflow-hidden border border-gold/25 bg-carbon md:hidden"
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
                          href={item.href}
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
              <Button
                href={contact.href}
                external={contact.channel === "whatsapp"}
                onClick={onClose}
                className="w-full"
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
