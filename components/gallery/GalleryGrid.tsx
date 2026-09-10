"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Lightbox from "@/components/gallery/Lightbox";
import type { GalleryItem } from "@/data/galeria";
import { cn } from "@/lib/cn";

type GalleryGridProps = {
  items: GalleryItem[];
};

/**
 * Grilla editorial asimétrica (spans definidos por pieza en
 * data/galeria.ts) con lightbox accesible (components/gallery/Lightbox.tsx):
 * cada miniatura es un <button> con nombre accesible y el foco vuelve a
 * la miniatura de origen al cerrar el visor.
 */
export default function GalleryGrid({ items }: GalleryGridProps) {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setActive((current) =>
        current === null
          ? current
          : (current + delta + items.length) % items.length,
      );
    },
    [items.length],
  );

  return (
    <>
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setActive(index);
            }}
            aria-label={`Ampliar fotografía: ${item.alt}`}
            className={cn(
              "group col-span-12 block text-left",
              item.span,
              item.offset,
            )}
          >
            <span
              style={{
                aspectRatio: item.ratio ?? `${item.width} / ${item.height}`,
              }}
              className="relative block w-full overflow-hidden"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={item.sizes ?? "100vw"}
                className="object-cover motion-safe:transition-transform motion-safe:duration-700 group-hover:scale-[1.02]"
              />
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <Lightbox
            items={items}
            active={active}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </>
  );
}