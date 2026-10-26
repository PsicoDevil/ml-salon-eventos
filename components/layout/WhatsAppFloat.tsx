"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/icons";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";

/**
 * CTA flotante de WhatsApp — contacto temporal centralizado en
 * data/site.ts. Fijo abajo a la derecha, visible en todo el sitio
 * por encima del contenido, sin reubicaciones ni ocultación durante el scroll.
 * Verde reconocible, con área táctil amplia y contraste para el ícono.
 * No renderiza nada si el número no estuviera configurado.
 */
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const href = buildDirectWhatsAppUrl("floating");
  if (!href || pathname.startsWith("/gestion/") || pathname === "/presupuestoml" || pathname.startsWith("/presupuestoml/")) return null;

  return (
    <>
      {/* Permite desplazar los últimos enlaces del footer por encima del flotante. */}
      <div aria-hidden="true" className="h-[calc(6rem+env(safe-area-inset-bottom))] shrink-0 bg-carbon sm:hidden" />
      <a
        id="whatsapp-floating"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultar por WhatsApp"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-[80] inline-flex h-14 w-14 items-center justify-center gap-2.5 rounded-full border border-white/25 bg-[#128c4e] text-[10px] font-medium uppercase tracking-[0.16em] text-white shadow-lg transition-colors duration-300 hover:bg-[#0d733e] focus-visible:outline-gold sm:bottom-6 sm:right-6 sm:z-30 sm:h-auto sm:min-h-12 sm:w-auto sm:rounded-sm sm:px-5 sm:py-3 sm:text-[11px]"
      >
        <WhatsAppIcon className="h-7 w-7 shrink-0 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Consultar por WhatsApp</span>
      </a>
    </>
  );
}
