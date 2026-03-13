import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="container-custom py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-xl font-extrabold tracking-tight">
                Amur<span className="text-primary">Kor</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.description}</p>
            <div className="flex items-center gap-2">
              <KoreanFlagMini className="h-3.5 w-5 rounded-sm" />
              <span className="text-xs text-muted-foreground">🇰🇷 🇬🇧 🇷🇺</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.quickLinks}</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/catalog" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.catalog}</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.about}</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.faq}</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.contact}</Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.categories}</h4>
            <nav className="flex flex-col gap-2.5">
              <Link to="/catalog?category=engine-parts" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.categories.engine}</Link>
              <Link to="/catalog?category=brake-system" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.categories.brake}</Link>
              <Link to="/catalog?category=suspension" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.categories.suspension}</Link>
              <Link to="/catalog?category=filters" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.categories.filters}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.contact}</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+74162771307" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-3.5 w-3.5 text-primary" />
                +7 (4162) 77-13-07
              </a>
              <a href="tel:+79145505217" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-3.5 w-3.5 text-primary" />
                +7 (914) 550-52-17
              </a>
              <a href="mailto:rerekin@mail.ru" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5 text-primary" />
                rerekin@mail.ru
              </a>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>Амурская обл., г. Благовещенск,<br />ул. Кольцевая 66, оф. 210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-border/30 pt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AmurKor. {t.footer.rights}</p>
          <div className="h-px flex-1 mx-6 bg-border/20" />
          <span className="text-xs text-muted-foreground/50 font-display tracking-widest">한국 자동차 부품</span>
        </div>
      </div>
    </footer>
  );
}