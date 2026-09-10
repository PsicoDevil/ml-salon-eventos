"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/galeria";

type LightboxProps = {
  items: GalleryItem[];
  active: number;
  onClose: () => void;
  /** Delta +1 / -1; el cierre circular lo resuelve el contenedor. */
  onStep: (delta: number) => void;
};

/**
 * Visor ampliado accesible: diálogo modal con Escape, flechas del
 * teclado, foco al botón de cierre, scroll del body bloqueado y labels
 * descriptivos. El montaje/desmontaje (y la salida animada) lo controla
 * el contenedor con <AnimatePresence>; acá se definen entrada/salida.
 * La imagen se muestra completa (object-contain) con sus dimensiones
 * naturales declaradas en data/galeria.ts.
 */
export default function Lightbox({
  items,
  active,
  onClose,
  onStep,
}: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const item = items[active];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      role="dialog"
      aria-modal="true"
      aria-label={`Fotografía ${active + 1} de ${items.length}: ${item.alt}`}
      className="fixed inset-0 z-[70] flex flex-col bg-carbon/95"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-5 py-4 sm:px-8"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
          {active + 1} / {items.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar visor"
          className="inline-flex h-10 w-10 items-center justify-center text-ivory transition-colors hover:text-gold"
        >
          <X className="h-6 w-6" aria-hidden />
        </button>
      </div>

      <div
        className="flex flex-1 items-center justify-center gap-2 px-2 pb-6 sm:gap-6 sm:px-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-label="Fotografía anterior"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-ivory/70 transition-colors hover:text-gold"
        >
          <ChevronLeft className="h-7 w-7" aria-hidden />
        </button>

        <Image
          key={item.src}
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          priority
          sizes="(min-width: 1024px) 80vw, 100vw"
          className="h-auto max-h-[72vh] w-auto max-w-full object-contain"
        />

        <button
          type="button"
          onClick={() => onStep(1)}
          aria-label="Fotografía siguiente"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-ivory/70 transition-colors hover:text-gold"
        >
          <ChevronRight className="h-7 w-7" aria-hidden />
        </button>
      </div>
    </motion.div>
  );
}