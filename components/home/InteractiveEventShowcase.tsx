"use client";

import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Occasion } from "@/data/eventos";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";

type InteractiveEventShowcaseProps = {
  /** Datos desde data/eventos.ts (número, nombre, imagen, texto). */
  occasions: Occasion[];
  kicker?: string;
  title?: ReactNode;
};

/**
 * Pieza visual única para la sección Eventos: una fotografía
 * protagonista con navegación horizontal editorial (número + nombre).
 *
 * - Seleccionar una categoría cambia imagen, título y texto mediante
 *   crossfade + micro-desplazamiento (400–700 ms), sin mover el layout
 *   (la fotografía vive en un contenedor de ratio fijo).
 * - MotionConfig (reducedMotion="user") degrada las transiciones a
 *   cambios de opacidad cuando el usuario pide menos movimiento.
 * - Accesible: patrón tabs (tablist/tab/tabpanel) con flechas del
 *   teclado. Los slugs quedan listos para /eventos/[slug].
 */
export default function InteractiveEventShowcase({
  occasions,
  kicker = "Eventos",
  title = (
    <>
      Cada ocasión tiene <span className="italic">su propio momento.</span>
    </>
  ),
}: InteractiveEventShowcaseProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = occasions.length;
  const current = occasions[active];

  const select = useCallback(
    (index: number) => setActive(((index % total) + total) % total),
    [total],
  );

  const focusAndSelect = useCallback(
    (index: number) => {
      const next = ((index % total) + total) % total;
      select(next);
      tabRefs.current[next]?.focus();
    },
    [select, total],
  );

  const onTablistKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAndSelect(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAndSelect(active - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndSelect(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndSelect(total - 1);
    }
  };

  return (
    <div>
      {/* Encabezado editorial: titular + contador/flechas discretas */}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet">
            {kicker}
          </p>
          <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-[1.06] text-ink sm:text-5xl">
            {title}
          </h2>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <p
            aria-hidden="true"
            className="font-display text-lg italic tabular-nums text-ink/60"
          >
            {current.index}
            <span className="text-ink/35">
              {" "}
              / {String(total).padStart(2, "0")}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => select(active - 1)}
              aria-label="Evento anterior"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => select(active + 1)}
              aria-label="Evento siguiente"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/60 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* Fotografía protagonista: ratio fijo = cero salto de layout */}
      <div
        role="tabpanel"
        id="eventos-panel"
        aria-labelledby={`eventos-tab-${current.slug}`}
        tabIndex={0}
        className="relative mt-10 aspect-[4/3] overflow-hidden bg-carbon focus-visible:outline-gold sm:mt-12 sm:aspect-[16/9]"
      >
        {occasions.map((occasion, index) => (
          <motion.div
            key={occasion.slug}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === active ? 1 : 0,
              scale: index === active ? 1 : 1.04,
              x: index === active ? 0 : 20,
            }}
            transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          >
            <Image
              src={occasion.photo.src}
              alt={index === active ? occasion.photo.alt : ""}
              fill
              sizes="(min-width: 1024px) 90vw, 100vw"
              priority={index === 0}
              className="object-cover"
            />
          </motion.div>
        ))}

        {/* Velo inferior: solo para legibilidad del rótulo */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-carbon/90 via-carbon/40 to-transparent"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="absolute inset-x-0 bottom-0 p-6 pb-8 sm:p-10 sm:pb-12"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
              {current.index}
            </p>
            <h3 className="mt-2 font-display text-4xl font-medium leading-none text-ivory sm:text-6xl">
              {current.label}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/85 sm:text-base">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación horizontal editorial */}
      <div className="mt-2 border-t border-ink/10 sm:mt-4">
        <div
          role="tablist"
          aria-label="Tipos de eventos"
          onKeyDown={onTablistKeyDown}
          className="no-scrollbar -mx-6 flex snap-x items-stretch gap-8 overflow-x-auto px-6 sm:mx-0 sm:gap-10 sm:px-0 lg:justify-between"
        >
          {occasions.map((occasion, index) => {
            const isActive = index === active;
            return (
              <button
                key={occasion.slug}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`eventos-tab-${occasion.slug}`}
                aria-selected={isActive}
                aria-controls="eventos-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(index)}
                className={cn(
                  "group relative shrink-0 snap-start pb-5 pt-5 transition-colors duration-300",
                  isActive ? "text-ink" : "text-ink/60 hover:text-ink",
                )}
              >
                <span className="flex items-baseline gap-2.5 whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="font-display text-sm italic text-violet"
                  >
                    {occasion.index}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] sm:text-[13px]">
                    {occasion.label}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold motion-safe:transition-transform motion-safe:duration-500",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}