import { cn } from "@/lib/cn";

type HairlineProps = {
  className?: string;
};

/** Regla decorativa de 1px. Detalle metálico sutil, nunca protagonista. */
export default function Hairline({ className }: HairlineProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("block h-px w-full bg-gold/30", className)}
    />
  );
}
