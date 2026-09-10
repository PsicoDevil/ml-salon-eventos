import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type KickerProps = {
  children: ReactNode;
  /** Contexto de fondo: "light" = sobre marfil, "dark" = sobre carbón. */
  tone?: "light" | "dark";
  as?: "p" | "span" | "h2" | "h3";
  className?: string;
};

/**
 * Micro-etiqueta en versalitas con tracking amplio.
 * Sobre claro usa violeta (acento limitado), sobre oscuro usa dorado.
 * Ambas combinaciones cumplen contraste AA para texto pequeño.
 */
export default function Kicker({
  children,
  tone = "light",
  as: Tag = "p",
  className,
}: KickerProps) {
  return (
    <Tag
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.24em]",
        tone === "dark" ? "text-gold" : "text-violet",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
