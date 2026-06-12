import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/hooks/useLanguage";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { to: "/catalog", label: t.nav.catalog },
    { to: "/about", label: t.nav.about },
    { to: "/faq", label: t.nav.faq },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center group">
            <img src={logo} alt="AmurKor" className="h-9 sm:h-11 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar — desktop */}
          <div className="hidden md:block w-64 lg:w-80">
            <SearchAutocomplete
              inputClassName="h-9 text-sm"
              navigateToCatalogOnEnter
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <a
              href="tel:+74162771307"
              className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary lg:flex ml-1"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>+7 (4162) 77-13-07</span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border/40 py-4 md:hidden animate-slide-up space-y-4">
            {/* Mobile search */}
            <SearchAutocomplete
              inputClassName="h-9 text-sm"
              navigateToCatalogOnEnter
            />
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-display text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+74162771307" className="flex items-center gap-2 text-xs font-medium text-primary">
                <Phone className="h-3.5 w-3.5" />
                +7 (4162) 77-13-07
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
