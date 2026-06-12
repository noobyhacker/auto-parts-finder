import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/hooks/useLanguage";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { to: "/catalog", label: t.nav.catalog },
    { to: "/about",   label: t.nav.about },
    { to: "/faq",     label: t.nav.faq },
    { to: "/contact", label: t.nav.contact },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative font-display text-xs font-semibold uppercase tracking-widest transition-colors duration-200 py-1",
      isActive
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground",
    ].join(" ");

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      "font-display text-xs font-semibold uppercase tracking-widest transition-colors",
      isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
    ].join(" ");

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b border-border/40 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-sm"
          : "bg-background/80 backdrop-blur-md",
      ].join(" ")}
    >
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center group">
            <img src={logo} alt="AmurKor" className="h-9 sm:h-11 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <a
              href="tel:+74162771307"
              className="hidden items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary lg:flex ml-2"
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
          <div className="border-t border-border/40 py-4 md:hidden animate-slide-up">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={mobileNavClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
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
