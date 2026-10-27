import Image from "next/image";
import { brand } from "@/data/brand";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmarkOnMobile?: boolean;
  variant?: "default" | "header";
};

/**
 * La variante header sustituye el monograma por el emblema oficial.
 * Los demás usos conservan la configuración y presentación anteriores.
 * Marca ML. Usa el logo real (data/brand.ts → logoSrc) cuando exista;
 * mientras tanto, monograma tipográfico refinado: monograma + hairline
 * dorada vertical + wordmark en dos niveles. El color lo hereda del
 * contenedor (text-ivory / text-ink).
 */
const SIZE_CLASSES = {
  sm: { image: "h-8", monogram: "text-2xl", gap: "gap-4", rule: "h-6" },
  md: { image: "h-10", monogram: "text-3xl", gap: "gap-5", rule: "h-8" },
  lg: { image: "h-12", monogram: "text-4xl", gap: "gap-6", rule: "h-9" },
} as const;

export default function Logo({ className, size = "md", showWordmarkOnMobile = false, variant = "default" }: LogoProps) {
  const sizes = SIZE_CLASSES[size];

  if (brand.logoSrc && variant !== "header") {
    return (
      <span className={cn("inline-flex items-center", className)}>
        <Image
          src={brand.logoSrc}
          alt={brand.logoAlt}
          width={200}
          height={48}
          className={cn(sizes.image, "w-auto")}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex shrink-0 items-center", variant === "header" ? "gap-2 sm:gap-4" : showWordmarkOnMobile ? "gap-2.5 sm:gap-6" : sizes.gap, className)}>
      {variant === "header" ? (
        <Image
          src="/images/hero/logodiamante.png"
          alt="María Luisa — emblema dorado ML con diamante"
          width={1254}
          height={1254}
          sizes="(min-width: 1440px) 88px, (min-width: 640px) 78px, 70px"
          loading="eager"
          className="h-[70px] w-[70px] shrink-0 object-contain sm:h-[78px] sm:w-[78px] min-[1440px]:h-[88px] min-[1440px]:w-[88px]"
        />
      ) : (
        <span
          className={cn(
            "font-display font-medium leading-none tracking-[0.08em]",
            showWordmarkOnMobile ? "text-3xl sm:text-4xl" : sizes.monogram,
          )}
        >
          {brand.monogram}
        </span>
      )}
      <span
        aria-hidden
        className={cn("w-px bg-gold/50", sizes.rule)}
      />
      {variant === "header" ? (
        <span className="flex shrink-0 flex-col items-center gap-1 whitespace-nowrap text-center uppercase">
          <span className="font-display text-[13px] font-semibold leading-none tracking-[0.04em] text-gold sm:text-lg">{brand.commercialName}</span>
          <span className="text-[7px] font-medium leading-none tracking-[0.18em] text-ivory/85 sm:text-[8px] sm:tracking-[0.22em]">SALÓN DE EVENTOS</span>
        </span>
      ) : (
        <span className={cn("flex-col leading-relaxed", showWordmarkOnMobile ? "flex max-w-22 sm:max-w-none" : "hidden sm:flex")}>
          <span className={cn("font-semibold uppercase", showWordmarkOnMobile ? "text-[9px] tracking-[0.22em] sm:text-[10px] sm:tracking-[0.3em]" : "text-[10px] tracking-[0.3em]")}>
            {brand.wordmark}
          </span>
        </span>
      )}
    </span>
  );
}
