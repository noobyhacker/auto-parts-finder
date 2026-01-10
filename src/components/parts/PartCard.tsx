import { memo } from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part } from "@/types";

interface PartCardProps {
  part: Part;
}

export const PartCard = memo(function PartCard({ part }: PartCardProps) {
  const { t } = useLanguage();

  return (
    <Link to={`/part/${part.slug}`} className={`part-card group block ${!part.inStock ? 'opacity-60' : ''}`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {part.images[0] ? (
          <img
            src={part.images[0].url}
            alt={part.name}
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
        <p className="text-xs font-medium text-muted-foreground">{part.category.name}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold group-hover:text-primary transition-colors">
          {part.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{part.articleNumber}</p>
        <p className="mt-2 font-display text-lg font-bold text-primary">${part.price.toFixed(2)}</p>
      </div>
    </Link>
  );
});

PartCard.displayName = "PartCard";
