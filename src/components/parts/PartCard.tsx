import { memo } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part } from "@/types";

interface PartCardProps {
  part: Part;
}

// Map category slugs to translation keys
const categoryTranslationMap: Record<string, keyof typeof import("@/lib/i18n").translations.en.categories> = {
  "engine-parts": "engine",
  "brake-system": "brake",
  "suspension": "suspension",
  "filters": "filters",
  "electrical": "electrical",
  "body-parts": "body",
  "cooling-system": "cooling",
  "transmission": "transmission",
};

// Map part slugs to translation keys
const partNameTranslationMap: Record<string, keyof typeof import("@/lib/i18n").translations.en.partNames> = {
  "engine-oil-filter-263203c30a": "engineOilFilter",
  "front-brake-pads-581012ta00": "frontBrakePadsSet",
  "air-filter-281133x000": "airFilterElement",
  "shock-absorber-front-546513s500": "shockAbsorberFrontLeft",
  "spark-plug-set-1884611070": "sparkPlugSet",
  "timing-belt-kit-243122g400": "timingBeltKit",
  "radiator-assembly-253103s050": "radiatorAssembly",
  "alternator-373002g150": "alternator",
};

export const PartCard = memo(function PartCard({ part }: PartCardProps) {
  const { t } = useLanguage();

  const getCategoryName = () => {
    const key = categoryTranslationMap[part.category.slug];
    if (key && t.categories[key]) {
      return t.categories[key];
    }
    return part.category.name;
  };

  const getPartName = () => {
    const key = partNameTranslationMap[part.slug];
    if (key && t.partNames[key]) {
      return t.partNames[key];
    }
    return part.name;
  };

  // Get image URL - handle both string and object format
  const getImageUrl = () => {
    const img = part.images[0];
    if (!img) return null;
    if (typeof img === 'string') return img;
    return img.url;
  };

  const imageUrl = getImageUrl();

  return (
    <Link to={`/part/${part.slug}`} className={`part-card group block ${!part.inStock ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={getPartName()}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute right-2 top-2">
          <span className={`stock-badge ${part.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {part.inStock ? t.common.inStock : t.common.outOfStock}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-medium text-muted-foreground">{getCategoryName()}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold group-hover:text-primary transition-colors">
          {getPartName()}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{part.articleNumber}</p>
        <p className="mt-2 text-sm font-medium text-primary">{t.common.contactForPrice}</p>
      </div>
    </Link>
  );
});

PartCard.displayName = "PartCard";
