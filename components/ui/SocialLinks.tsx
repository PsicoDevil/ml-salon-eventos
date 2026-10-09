import { FacebookIcon, InstagramIcon } from "@/components/ui/icons";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

type SocialLinksProps = {
  /** Contexto de fondo: "dark" = sobre carbón, "light" = sobre marfil. */
  tone?: "dark" | "light";
  className?: string;
  iconClassName?: string;
};

/**
 * Redes sociales verificadas de ML (data/site.ts):
 * iconos accesibles con aria-label y title, hover dorado, foco visible.
 */
const socialProfiles = [
  {
    name: "Instagram",
    href: site.social.instagram.url,
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: site.social.facebook.url,
    Icon: FacebookIcon,
  },
] as const;

export default function SocialLinks({
  tone = "dark",
  className,
  iconClassName,
}: SocialLinksProps) {
  return (
    <ul
      className={cn("flex items-center gap-2", className)}
      aria-label="Redes sociales de ML Salón de Eventos"
    >
      {socialProfiles.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} en ${name}`}
            title={`${site.name} en ${name}`}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300",
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
