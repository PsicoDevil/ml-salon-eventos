import type { ReactNode } from "react";
import Kicker from "@/components/ui/Kicker";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/** Encabezado de sección: kicker + titular display + bajada opcional. */
export default function SectionHeading({
  kicker,
  title,
  description,
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <Kicker tone={tone}>{kicker}</Kicker>
      <h2
        className={cn(
          "mt-5 text-balance font-display text-4xl font-medium leading-[1.08] sm:text-5xl",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-6 max-w-xl text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-ivory/70" : "text-ink/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
