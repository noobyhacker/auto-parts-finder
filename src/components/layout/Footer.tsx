import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">AK</span>
              </div>
              <span className="font-display text-xl font-bold">
                Amur<span className="text-primary">Kor</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-2">
              <KoreanFlagMini className="h-4 w-6 rounded shadow-sm" />
              <span className="text-xs text-muted-foreground">🇰🇷 🇬🇧 🇷🇺</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.footer.quickLinks}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalog" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.nav.catalog}
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.nav.about}
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.nav.faq}
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.nav.contact}
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.footer.categories}
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalog?category=engine-parts" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.categories.engine}
              </Link>
              <Link to="/catalog?category=brake-system" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.categories.brake}
              </Link>
              <Link to="/catalog?category=suspension" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.categories.suspension}
              </Link>
              <Link to="/catalog?category=filters" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                {t.categories.filters}
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              {t.footer.contact}
            </h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                +1 (234) 567-890
              </a>
              <a href="mailto:info@amurkor.ru" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                info@amurkor.ru
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Auto Street, Motor City, MC 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AmurKor. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
