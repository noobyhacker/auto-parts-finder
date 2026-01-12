import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCategories } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import type { Category, PartFilters } from "@/types";

interface PartFiltersProps {
  filters: PartFilters;
  onFiltersChange: (filters: PartFilters) => void;
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

export function PartFiltersComponent({ filters, onFiltersChange }: PartFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const handleStockToggle = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStockOnly: checked || undefined,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.categoryId || filters.inStockOnly;

  const getCategoryName = (category: Category) => {
    const key = categoryTranslationMap[category.slug];
    if (key && t.categories[key]) {
      return t.categories[key];
    }
    return category.name;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">{t.footer.categories}</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`filter-chip ${filters.categoryId === category.id ? 'active' : ''}`}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{t.common.inStockOnly}</h4>
        <Switch
          checked={filters.inStockOnly || false}
          onCheckedChange={handleStockToggle}
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full gap-2" onClick={handleClearAll}>
          <X className="h-4 w-4" />
          {t.common.clearAllFilters}
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t.common.filters}
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>{t.common.filters}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
