"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Lightbox from "@/components/gallery/Lightbox";
import type { GalleryCategory, GalleryItem } from "@/data/galeria";
import { galleryCategories, galleryCategoryLabels } from "@/data/galeria";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";

type GalleryCollectionProps = {
  items: GalleryItem[];
};

type Filter = "todas" | GalleryCategory;

const MASONRY_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Archivo visual completo de /galeria: filtros editoriales (solo
 * categorías con fotografías) + composición masonry en columnas con
 * ratios naturales + lightbox accesible (components/gallery/Lightbox.tsx).
 * Sin grilla uniforme ni cards: la fotografía protagoniza. MotionConfig
 * (reducedMotion="user") degrada las transiciones.
 */
export default function GalleryCollection({ items }: GalleryCollectionProps) {
  const [filter, setFilter] = useState<Filter>("todas");
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const availableCategories = useMemo(
    () =>
      galleryCategories.filter((category) =>
        items.some((item) => item.category === category),
      ),
    [items],
  );

  const filtered = useMemo(
    () =>
      filter === "todas"
        ? items
        : items.filter((item) => item.category === filter),
    [filter, items],
  );

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setActive((current) =>
        current === null
          ? current
          : (current + delta + filtered.length) % filtered.length,
      );
    },
    [filtered.length],
  );

  const selectFilter = (next: Filter) => {
    setFilter(next);
    setActive(null);
  };

  const filters: { key: Filter; label: string }[] = [
    { key: "todas", label: "Todas" },
    ...availableCategories.map((category) => ({
      key: category as Filter,
      label: galleryCategoryLabels[category],
    })),
  ];

  return (
    <div>
      {/* Filtros editoriales: fila horizontal, scroll controlado en mobile */}
      <div className="no-scrollbar -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
        <div
          role="group"
          aria-label="Filtrar la galería por categoría"
          className="flex min-w-max items-stretch gap-8 sm:gap-10"
        >
          {filters.map(({ key, label }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectFilter(key)}
                aria-pressed={isActive}
                className={cn(
                  "group relative shrink-0 pb-4 pt-1 transition-colors duration-300",
                  isActive ? "text-ink" : "text-ink/55 hover:text-ink",
                )}
              >
                <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em]">
                  {label}
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

      {/* Masonry editorial: columnas con ratios naturales */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="mt-10 columns-1 gap-5 sm:columns-2 sm:gap-6 lg:columns-3"
        >
          {filtered.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActive(index);
              }}
              aria-label={`Ampliar fotografía: ${item.alt}`}
              className="group mb-5 block w-full break-inside-avoid text-left sm:mb-6"
            >
              <span
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
                className="relative block w-full overflow-hidden bg-carbon/5"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={MASONRY_SIZES}
                  className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
                />
              </span>
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      <p role="status" className="sr-only">
        Mostrando {filtered.length} fotografías
      </p>

      <AnimatePresence>
        {active !== null && (
          <Lightbox
            items={filtered}
            active={active}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </div>
  );
}