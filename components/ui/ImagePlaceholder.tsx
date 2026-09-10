import Hairline from "@/components/ui/Hairline";
import { cn } from "@/lib/cn";

type ImagePlaceholderProps = {
  /** Etiqueta editorial del slot, ej. "El salón", "Bodas". */
  label?: string;
  /** Ratio CSS, ej. "3 / 2", "4 / 5". */
  ratio?: string;
  tone?: "carbon" | "ivory";
  className?: string;
};

/**
 * Placeholder premium: una pieza deliberada del diseño (monograma +
 * hairlines + grano), NO un mensaje de "imagen no disponible".
 * Cuando lleguen las fotografías reales, este componente se reemplaza
 * por next/image sin alterar el layout.
 */
export default function ImagePlaceholder({
  label,
  ratio = "3 / 2",
  tone = "carbon",
  className,
}: ImagePlaceholderProps) {
  const isDark = tone === "carbon";

  return (
    <div
      aria-hidden="true"
      style={{ aspectRatio: ratio }}
      className={cn(
        "grain relative flex items-center justify-center overflow-hidden",
        isDark ? "bg-carbon text-ivory" : "bg-ivory-2 text-ink",
        className,
      )}
    >
      {/* Marco interior */}
      <span
        className={cn(
          "pointer-events-none absolute inset-4 border sm:inset-5",
          isDark ? "border-gold/25" : "border-gold/40",
        )}
      />

      {/* Composición central */}
      <div className="relative z-[2] flex flex-col items-center px-6 text-center">
        {label ? (
          <span
            className={cn(
              "mb-6 text-[10px] font-semibold uppercase tracking-[0.3em]",
              isDark ? "text-ivory/60" : "text-ink/60",
            )}
          >
            {label}
          </span>
        ) : null}
        <span className="font-display text-5xl font-medium leading-none tracking-[0.12em] sm:text-6xl">
          ML
        </span>
        <Hairline
          className={cn("my-4 w-10", isDark ? "bg-gold/60" : "bg-gold/70")}
        />
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.32em]",
            isDark ? "text-ivory/55" : "text-ink/55",
          )}
        >
          Salón de Eventos
        </span>
      </div>
    </div>
  );
}
