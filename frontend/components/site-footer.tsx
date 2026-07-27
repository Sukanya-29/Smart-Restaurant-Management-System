import { UtensilsCrossed, Mail, Phone, MapPin } from "lucide-react"

const nav = [
  { label: "Home", href: "#home" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
]

const socials = [
  { label: "Email us", href: "mailto:hello@vibebite.com", icon: Mail },
  { label: "Call us", href: "tel:+10000000000", icon: Phone },
  { label: "Find us", href: "#contact", icon: MapPin },
]

export const SiteFooter = () => {
  return (
    <footer id="contact" className="px-4 pb-10">
      <div className="mx-auto max-w-6xl rounded-[2.5rem] border border-border/60 bg-card p-8 sm:p-12">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <a href="#home" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <UtensilsCrossed className="size-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-2xl font-semibold text-foreground">VibeBite</span>
          </a>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary"
              >
                <social.icon className="size-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>&copy; {new Date().getFullYear()} VibeBite. All rights reserved.</p>
          <p>Crafted for a premium dining experience.</p>
        </div>
      </div>
    </footer>
  )
}
