import Image from "next/image";
import { cn } from "@/lib/cn";

type PhotoProps = {
  src: string;
  alt: string;
  /** Ratio CSS del contenedor, ej. "4 / 3", "3 / 4", "16 / 9". */
  ratio?: string;
  /** Sizes para next/image (obligatorio con fill para evitar CLS). */
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Clases extra para la <Image> (ej. hover zoom con un padre .group). */
  imageClassName?: string;
};

/**
 * Fotografía editorial: contenedor con ratio fijo (cero CLS) +
 * next/image en modo fill con object-cover. Punto único de uso de
 * imágenes en el sitio.
 */
export default function Photo({
  src,
  alt,
  ratio = "4 / 3",
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
}: PhotoProps) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={cn("relative overflow-hidden", className)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}