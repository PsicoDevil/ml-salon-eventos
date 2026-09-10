import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

/** Contenedor editorial: ancho máximo + respiración lateral. */
export default function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
