import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchDialog } from "@/components/search/SearchDialog";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">AP</span>
              </div>
              <span className="hidden font-display text-xl font-bold sm:block">
                Auto<span className="text-primary">Parts</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link 
                to="/catalog" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Catalog
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
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
                className="hidden sm:flex" 
                onClick={() => navigate("/catalog")}
              >
                Find Parts
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
            <div className="border-t border-border/50 py-4 md:hidden">
              <nav className="flex flex-col gap-3">
                <Link 
                  to="/catalog" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Catalog
                </Link>
                <Link 
                  to="/contact" 
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <Phone className="h-4 w-4" />
                  <span>+1 (234) 567-890</span>
                </a>
                <Button className="w-full" onClick={() => { navigate("/catalog"); setIsMenuOpen(false); }}>
                  Find Parts
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
