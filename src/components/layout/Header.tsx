import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Phone, Building2, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search/SearchDialog";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navLinks = [
    { to: "/catalog", label: t.nav.catalog },
    { to: "/about", label: t.nav.about, icon: Building2 },
    { to: "/faq", label: t.nav.faq, icon: HelpCircle },
    { to: "/contact", label: t.nav.contact, icon: Mail },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary group-hover:shadow-lg group-hover:shadow-primary/25 transition-shadow">
                <span className="font-display text-lg font-bold text-primary-foreground">KP</span>
              </div>
              <span className="hidden font-display text-xl font-bold sm:block">
                Korean<span className="text-primary">Parts</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to} 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">{t.common.search}</span>
              </Button>

              {/* Phone - Desktop */}
              <a 
                href="tel:+1234567890" 
                className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary lg:flex"
              >
                <Phone className="h-4 w-4" />
                <span>+1 (234) 567-890</span>
              </a>

              {/* CTA Button */}
              <Button 
                className="hidden sm:flex btn-glow" 
                onClick={() => navigate("/catalog")}
              >
                {t.nav.findParts}
              </Button>

              {/* Mobile Menu Toggle */}
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
            <div className="border-t border-border/50 py-4 md:hidden animate-slide-up">
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link 
                    key={link.to}
                    to={link.to} 
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.icon && <link.icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                ))}
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <Phone className="h-4 w-4" />
                  <span>+1 (234) 567-890</span>
                </a>
                <Button className="w-full btn-glow" onClick={() => { navigate("/catalog"); setIsMenuOpen(false); }}>
                  {t.nav.findParts}
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}
