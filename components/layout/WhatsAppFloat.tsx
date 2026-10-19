"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

/**
 * CTA flotante de WhatsApp — contacto temporal centralizado en
 * data/site.ts. Fijo abajo a la derecha, visible en todo el sitio
 * por encima del contenido; el menú móvil (z-40) lo cubre al abrirse.
 * Sobrio y plano, coherente con el sistema de botones cuadrados.
 * No renderiza nada si el número no estuviera configurado.
 */
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const href = buildDirectWhatsAppUrl("floating");
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [obstructed, setObstructed] = useState(false);

  useEffect(() => {
    let frame = 0;
    // Se oculta si cruza texto o controles; conserva su caja para medirla.
    const checkOverlap = () => {
      frame = 0;
      const link = linkRef.current;
      if (!link) return;
      const floating = link.getBoundingClientRect();
      const content = document.querySelectorAll(
        "main a, main button, main input, main select, main textarea, main label, main h1, main h2, main h3, main p, main li, main figcaption, footer a, footer p, footer address",
      );
      setObstructed(Array.from(content).some((element) => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0 &&
          box.left < floating.right + 8 && box.right > floating.left - 8 &&
          box.top < floating.bottom + 8 && box.bottom > floating.top - 8;
      }));
    };
    const scheduleCheck = () => {
      if (!frame) frame = window.requestAnimationFrame(checkOverlap);
    };
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);
    window.visualViewport?.addEventListener("resize", scheduleCheck);
    const observer = new ResizeObserver(scheduleCheck);
    document.querySelectorAll("main, footer").forEach((element) => observer.observe(element));
    scheduleCheck();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
      window.visualViewport?.removeEventListener("resize", scheduleCheck);
    };
  }, []);

  if (!href || pathname.startsWith("/gestion/")) return null;

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      aria-hidden={obstructed || undefined}
      tabIndex={obstructed ? -1 : undefined}
      className={cn(
        "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-30 inline-flex min-h-11 items-center gap-2.5 border border-gold/40 bg-carbon/95 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:text-gold focus-visible:outline-gold sm:bottom-6 sm:right-6 sm:px-5 sm:text-[11px]",
        obstructed && "invisible pointer-events-none",
      )}
    >
      <WhatsAppIcon className="h-5 w-5 shrink-0 sm:h-4 sm:w-4" />
      <span className="hidden sm:inline">Consultar por WhatsApp</span>
    </a>
  );
}
