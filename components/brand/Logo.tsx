import Image from "next/image";
import { brand } from "@/data/brand";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmarkOnMobile?: boolean;
};

/**
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

export default function Logo({ className, size = "md", showWordmarkOnMobile = false }: LogoProps) {
  const sizes = SIZE_CLASSES[size];

  if (brand.logoSrc) {
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
    <span className={cn("inline-flex shrink-0 items-center", showWordmarkOnMobile ? "gap-4 sm:gap-6" : sizes.gap, className)}>
      <span
        className={cn(
          "font-display font-medium leading-none tracking-[0.08em]",
          showWordmarkOnMobile ? "text-3xl sm:text-4xl" : sizes.monogram,
        )}
      >
        {brand.monogram}
      </span>
      <span
        aria-hidden
        className={cn("w-px bg-gold/50", sizes.rule)}
      />
      <span className={cn("flex-col leading-relaxed", showWordmarkOnMobile ? "flex max-w-28 sm:max-w-none" : "hidden sm:flex")}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
          {brand.wordmark}
        </span>
      </span>
    </span>
  );
}
