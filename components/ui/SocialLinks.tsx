import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";
import { buildDirectWhatsAppUrl } from "@/lib/whatsapp";

type SocialLinksProps = {
  /** Contexto de fondo: "dark" = sobre carbón, "light" = sobre marfil. */
  tone?: "dark" | "light";
  className?: string;
  iconClassName?: string;
  /** En el encabezado móvil, WhatsApp permanece como acceso flotante. */
  variant?: "default" | "header";
};

/**
 * Redes sociales verificadas de ML (data/site.ts):
 * iconos accesibles con aria-label y title, hover dorado, foco visible.
 */
const socialProfiles = [
  {
    name: "WhatsApp",
    label: "Contactar por WhatsApp",
    href: buildDirectWhatsAppUrl("social"),
    Icon: WhatsAppIcon,
  },
  {
    name: "Instagram",
    label: `${site.name} en Instagram`,
    href: site.social.instagram.url,
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    label: `${site.name} en Facebook`,
    href: site.social.facebook.url,
    Icon: FacebookIcon,
  },
] as const;

export default function SocialLinks({
  tone = "dark",
  className,
  iconClassName,
  variant = "default",
}: SocialLinksProps) {
  return (
    <ul
      className={cn("flex items-center", variant === "header" ? "gap-0 min-[1440px]:gap-2" : "gap-2", className)}
      aria-label="WhatsApp y redes sociales de ML Salón de Eventos"
    >
      {socialProfiles.filter(({ href }) => href).map(({ name, label, href, Icon }) => (
        <li key={name} className={variant === "header" && name === "WhatsApp" ? "hidden min-[1440px]:block" : undefined}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={cn(
              "inline-flex items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
              variant === "header" ? "h-11 w-11 max-[1439px]:border-transparent min-[1440px]:h-10 min-[1440px]:w-10" : "h-10 w-10",
              tone === "dark"
                ? "border-ivory/20 text-ivory/75 hover:border-gold hover:text-gold"
                : "border-ink/15 text-ink/60 hover:border-gold hover:text-gold",
            )}
          >
            <Icon className={cn("h-4 w-4", iconClassName)} />
          </a>
        </li>
      ))}
    </ul>
  );
}
