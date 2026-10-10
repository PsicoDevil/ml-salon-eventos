import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
};

/**
 * Iconos de marca en trazo (24×24, currentColor, strokeWidth 2).
 * lucide-react ya no distribuye iconos de marcas, por lo que se
 * implementan inline con la misma estética que el resto del sistema.
 */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4", className)}
      {...iconProps}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4", className)}
      {...iconProps}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-4 w-4", className)} {...iconProps}>
      <path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z" />
      <path d="m8 7 1.5 3-1 1c1 2 2 3 4 4l1-1 3 1.5c-.3 1.5-1.3 2-2.5 1.8C10 16.5 7.5 14 6.7 10 6.5 8.8 7 7.3 8 7Z" />
    </svg>
  );
}
