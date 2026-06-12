import { memo } from "react";
import { Link } from "react-router-dom";
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
  "general": "general",
  "general-parts": "general",
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
    if (!part.category) return null;
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

  return (
    <Link to={`/part/${part.slug}`} className={`part-card group block ${!part.inStock ? 'opacity-60' : ''}`}>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground">{getCategoryName()}</p>
          <span className={`stock-badge ${part.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {part.inStock ? t.common.inStock : t.common.outOfStock}
          </span>
        </div>
        <h3
          className="line-clamp-2 min-h-[2.8em] text-[15px] leading-[1.4] font-semibold tracking-normal text-foreground transition-colors group-hover:text-primary"
          style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
        >
          {getPartName()}
        </h3>
        {(part.articleNumber || part.oemNumber) && (
          <p
            className="mt-1 text-[13px] leading-5 text-muted-foreground tabular-nums tracking-[0.01em]"
            style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}
          >
            {[part.articleNumber, part.oemNumber].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className="mt-2 text-sm font-medium text-primary">{t.common.contactForPrice}</p>
      </div>
    </Link>
  );
});

PartCard.displayName = "PartCard";
