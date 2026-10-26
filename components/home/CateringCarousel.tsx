"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cateringFotos } from "@/data/catering-fotos";
import { cn } from "@/lib/cn";

const control = "inline-flex h-11 w-11 shrink-0 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function CateringCarousel() {
  const [active, setActive] = useState(0);
  const [requested, setRequested] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const [loadError, setLoadError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(regionRef, { once: true, margin: "300px" });
  const reducedMotion = useReducedMotion();
  const slidesId = useId();
  const rotating = nearViewport && reducedMotion === false && !paused && !hovered;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      // Do not advance an unseen carousel in a background tab.
      if (!document.hidden) {
        setActive((current) => {
          let next = (current + 1) % cateringFotos.length;
          while (failed.has(next) && next !== current) {
            next = (next + 1) % cateringFotos.length;
          }
          return loaded.has(next) ? next : current;
        });
      }
    }, 4500);
    return () => window.clearInterval(timer);
  }, [rotating, loaded, failed]);

  function select(index: number) {
    setPaused(true);
    setLoadError(false);
    const next = (index + cateringFotos.length) % cateringFotos.length;
    if (failed.has(next)) {
      setLoadError(true);
      setRequested(null);
    } else if (loaded.has(next)) {
      setActive(next);
      setRequested(null);
    } else {
      // Keep the current photograph visible until the requested one is decoded.
      setRequested(next);
    }
  }

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Fotografías de Catering"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(true);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          select(active + (event.key === "ArrowLeft" ? -1 : 1));
        }
      }}
    >
      <div id={slidesId} className="relative aspect-[3/2] overflow-hidden bg-carbon" aria-busy={requested !== null || (!loaded.has(active) && !loadError)} aria-live={rotating ? "off" : "polite"} aria-atomic="true">
        {cateringFotos.map((photo, index) => (
          <div
            key={photo.src}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${cateringFotos.length}`}
            aria-hidden={index !== active}
            className={cn("absolute inset-0 motion-safe:transition-opacity motion-safe:duration-500", index === active && loaded.has(index) ? "opacity-100" : "pointer-events-none opacity-0")}
          >
            {nearViewport && (
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                loading="eager"
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
                className={photo.fit === "contain" ? "object-contain" : "object-cover"}
                onLoad={() => {
                  setLoaded((current) => new Set(current).add(index));
                  if (requested === index) {
                    setActive(index);
                    setRequested(null);
                  }
                }}
                onError={() => {
                  setFailed((current) => new Set(current).add(index));
                  if (requested === index || active === index) {
                    setLoadError(true);
                    setRequested(null);
                    setPaused(true);
                  }
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-2 border border-t-0 border-ivory/15 p-2 sm:flex-nowrap sm:p-3">
        <button type="button" className={control} aria-label="Fotografía anterior" aria-controls={slidesId} onClick={() => select(active - 1)}>
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="order-last flex w-full flex-wrap items-center justify-center sm:order-none sm:min-w-0 sm:w-auto" aria-label="Elegir fotografía">
          {cateringFotos.map((photo, index) => (
            <button key={photo.src} type="button" aria-label={`Ver fotografía ${index + 1}: ${photo.alt}`} aria-current={index === active ? "true" : undefined} aria-controls={slidesId} onClick={() => select(index)} className="flex h-11 w-8 shrink-0 items-center justify-center focus-visible:outline-2 focus-visible:outline-gold">
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", index === active ? "bg-gold" : "bg-ivory/35")} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {!reducedMotion && (
            <button type="button" className={control} aria-label={paused ? "Reanudar presentación" : "Pausar presentación"} aria-controls={slidesId} onClick={() => setPaused((current) => !current)}>
              {paused ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
            </button>
          )}
          <button type="button" className={control} aria-label="Fotografía siguiente" aria-controls={slidesId} onClick={() => select(active + 1)}>
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p role="status" className={loadError ? "mt-3 text-sm text-ivory/75" : "sr-only"}>
        {loadError ? "No se pudo cargar esta fotografía. Podés elegir otra con los controles." : requested !== null ? `Cargando fotografía ${requested + 1} de ${cateringFotos.length}.` : ""}
      </p>
    </div>
  );
}
