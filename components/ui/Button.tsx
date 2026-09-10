import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "outline";
type ButtonTone = "light" | "dark"; // Contexto de fondo.
type ButtonSize = "sm" | "md";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  /** Fuerza target="_blank" + rel="noopener" (enlaces externos, wa.me). */
  external?: boolean;
  onClick?: () => void;
  className?: string;
};

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.16em] transition-colors duration-300";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-5 py-2.5 text-[11px]",
  md: "px-7 py-3.5 text-xs",
};

const VARIANT_TONE_CLASSES: Record<`${ButtonVariant}-${ButtonTone}`, string> = {
  "primary-dark": "bg-ivory text-ink hover:bg-white focus-visible:outline-gold",
  "primary-light":
    "bg-ink text-ivory hover:bg-carbon-2 focus-visible:outline-violet",
  "outline-dark":
    "border border-ivory/35 text-ivory hover:border-gold hover:text-gold focus-visible:outline-gold",
  "outline-light":
    "border border-ink/25 text-ink hover:border-violet hover:text-violet focus-visible:outline-violet",
};

/**
 * Botón/enlace editorial: cuadrado, sobrio, sin sombras ni gradientes.
 * Rutas internas (empiezan con "/") usan <Link>; anclas, tel:, mailto: y
 * enlaces externos usan <a>.
 */
export default function Button({
  href,
  children,
  variant = "primary",
  tone = "dark",
  size = "md",
  external = false,
  onClick,
  className,
}: ButtonProps) {
  const classes = cn(
    BASE_CLASSES,
    SIZE_CLASSES[size],
    VARIANT_TONE_CLASSES[`${variant}-${tone}`],
    className,
  );

  const isInternal = href.startsWith("/") && !href.startsWith("//");

  if (isInternal && !external) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
