import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * CTA flotante de WhatsApp — canal único confirmado (Hugo, ver
 * lib/whatsapp.ts). Fijo abajo a la derecha, visible en todo el sitio
 * por encima del contenido; el menú móvil (z-40) lo cubre al abrirse.
 * Sobrio y plano, coherente con el sistema de botones cuadrados.
 * No renderiza nada si el número no estuviera configurado.
 */
export default function WhatsAppFloat() {
  const href = buildWhatsAppUrl("general");
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2.5 border border-gold/40 bg-carbon/95 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-ivory backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:text-gold focus-visible:outline-gold sm:bottom-6 sm:right-6 sm:px-5 sm:text-[11px]"
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
      Consultar por WhatsApp
    </a>
  );
}
