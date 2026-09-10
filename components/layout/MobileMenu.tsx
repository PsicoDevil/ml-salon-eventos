"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { navigation } from "@/data/navigation";
import { site } from "@/data/site";
import { getPrimaryContact } from "@/lib/whatsapp";
import { fadeUp, staggerContainer } from "@/lib/motion";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
};

/**
 * Panel móvil full-screen sobre carbón. Sin dropdowns.
 * Accesible: foco al primer enlace al abrir, Escape cierra y devuelve
 * el foco al botón, scroll del body bloqueado mientras está abierto.
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
        <motion.div
          id="menu-navegacion"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-40 flex flex-col bg-carbon md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-1 flex-col justify-center gap-2 px-8"
          >
            {navigation.map((item, index) => {
              const isInternal =
                item.href.startsWith("/") && !item.href.startsWith("//");
              const classes =
                "block py-2 font-display text-4xl text-ivory transition-colors hover:text-gold";
              return (
                <motion.li key={item.href} variants={fadeUp}>
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
                </motion.li>
              );
            })}
          </motion.ul>

          <div className="border-t border-ivory/10 px-8 py-8">
            <Button
              href={contact.href}
              external={contact.channel === "whatsapp"}
              onClick={onClose}
              className="w-full"
            >
              Consultar disponibilidad
            </Button>
            <p className="mt-6 text-sm text-ivory/60">
              {site.contacts.hugo.phoneDisplay} · {site.contacts.hugo.name}
            </p>
            <p className="mt-1 text-sm text-ivory/60">
              {site.contacts.walther.phoneDisplay} · {site.contacts.walther.name}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
