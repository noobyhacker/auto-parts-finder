import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">AP</span>
              </div>
              <span className="font-display text-xl font-bold">
                Auto<span className="text-primary">Parts</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Quality auto parts for Korean, Japanese, and American vehicles. Fast shipping and excellent customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalog" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Parts Catalog
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/catalog?category=engine-parts" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Engine Parts
              </Link>
              <Link to="/catalog?category=brake-system" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Brake System
              </Link>
              <Link to="/catalog?category=suspension" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Suspension
              </Link>
              <Link to="/catalog?category=filters" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                Filters
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                +1 (234) 567-890
              </a>
              <a href="mailto:info@autoparts.com" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                info@autoparts.com
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
            © {new Date().getFullYear()} AutoParts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
