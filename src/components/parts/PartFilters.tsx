import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getMockCategories } from "@/lib/mock-data";
import type { Category, PartFilters } from "@/types";

interface PartFiltersProps {
  filters: PartFilters;
  onFiltersChange: (filters: PartFilters) => void;
}

export function PartFiltersComponent({ filters, onFiltersChange }: PartFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getMockCategories().then(setCategories);
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
    });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = () => {
    onFiltersChange({
      ...filters,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 500 ? priceRange[1] : undefined,
    });
  };

  const handleStockToggle = (checked: boolean) => {
    onFiltersChange({
      ...filters,
      inStockOnly: checked || undefined,
    });
  };

  const handleClearAll = () => {
    setPriceRange([0, 500]);
    onFiltersChange({});
  };

  const hasActiveFilters = filters.categoryId || filters.minPrice || filters.maxPrice || filters.inStockOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Categories</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`filter-chip ${filters.categoryId === category.id ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            min={0}
            max={500}
            step={10}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">In Stock Only</h4>
        <Switch
          checked={filters.inStockOnly || false}
          onCheckedChange={handleStockToggle}
        />
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full gap-2" onClick={handleClearAll}>
          <X className="h-4 w-4" />
          Clear All Filters
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
              Filters
              {hasActiveFilters && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
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
