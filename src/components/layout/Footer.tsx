import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { KoreanFlagMini } from "@/components/icons/KoreanFlag";
import { getTelegramLink, getWhatsAppLink, getMaxLink } from "@/lib/contact-links";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="container-custom py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.contact}</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+821035891980" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-3.5 w-3.5 text-primary" />
                010-3589-1980
              </a>
              <p className="text-xs text-muted-foreground/80 pl-6 -mt-1">{t.footer.sharedNumberNote}</p>
              <a href="mailto:amurkor@mail.ru" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-3.5 w-3.5 text-primary" />
                amurkor@mail.ru
              </a>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <span>서울특별시 동대문구 황물로 17가길 2,<br />1층, 4호</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business info */}
        <div className="mt-10 pt-6 border-t border-border/30 grid gap-2 sm:grid-cols-[auto,1fr] sm:gap-x-6">
          <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-foreground">{t.footer.businessInfo}</h4>
          <dl className="text-xs text-muted-foreground grid gap-1 sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="font-semibold">{t.footer.brnLabel}:</dt>
              <dd>577-81-03812</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold">{t.footer.representativeLabel}:</dt>
              <dd>REREKIN SERGEI</dd>
            </div>
          </dl>
        </div>

        {/* Messenger links */}
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={getTelegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-[#0088cc] hover:border-[#0088cc]/40 transition-colors"
          >
            <svg className="h-3.5 w-3.5 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </a>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-[#25D366] hover:border-[#25D366]/40 transition-colors"
          >
            <svg className="h-3.5 w-3.5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href={getMaxLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-[#168acd] hover:border-[#168acd]/40 transition-colors"
          >
            <svg className="h-3.5 w-3.5 text-[#168acd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            MAX
          </a>
        </div>

        <div className="mt-8 border-t border-border/30 pt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AmurKor. {t.footer.rights}</p>
          <div className="h-px flex-1 mx-6 bg-border/20" />
          <span className="text-xs text-muted-foreground/50 font-display tracking-widest">한국 자동차 부품</span>
        </div>
      </div>
    </footer>
  );
}