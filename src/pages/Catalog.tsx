import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PartGrid } from "@/components/parts/PartGrid";
import { PartFiltersComponent } from "@/components/parts/PartFilters";
import { PartSort } from "@/components/parts/PartSort";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { getMockParts } from "@/lib/mock-data";
import type { Part, PartFilters, VehicleSelection } from "@/types";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("createdAt:desc");
  const [filters, setFilters] = useState<PartFilters>({});

  // Parse initial filters from URL
  useEffect(() => {
    const categorySlug = searchParams.get("category");
    // In a real app, you'd look up the category ID from the slug
    // For now, we'll just set it if present
    if (categorySlug) {
      const categoryMap: Record<string, number> = {
        "engine-parts": 1,
        "brake-system": 2,
        "suspension": 3,
        "filters": 4,
        "electrical": 5,
        "body-parts": 6,
        "cooling-system": 7,
        "transmission": 8,
      };
      setFilters((f) => ({ ...f, categoryId: categoryMap[categorySlug] }));
    }
  }, [searchParams]);

  // Fetch parts
  useEffect(() => {
    const fetchParts = async () => {
      setIsLoading(true);
      try {
        const result = await getMockParts(filters, sort);
        setParts(result.parts);
        setTotal(result.total);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParts();
  }, [filters, sort]);

  const handleVehicleSelect = (selection: VehicleSelection) => {
    const params = new URLSearchParams(searchParams);
    if (selection.brandId) params.set("brand", selection.brandId.toString());
    if (selection.modelId) params.set("model", selection.modelId.toString());
    if (selection.year) params.set("year", selection.year.toString());
    if (selection.engine) params.set("engine", selection.engine);
    setSearchParams(params);
    // In real app, would filter parts by vehicle
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Parts Catalog</h1>
          <p className="mt-1 text-muted-foreground">
            Browse our selection of quality auto parts
          </p>
        </div>

        {/* Vehicle Selector */}
        <div className="mb-8 rounded-lg border border-border/50 bg-card/50 p-4">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            Filter by Vehicle
          </h2>
          <VehicleSelector onSelect={handleVehicleSelect} showButton={false} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-lg border border-border/50 bg-card/50 p-4">
              <h2 className="mb-4 text-sm font-semibold">Filters</h2>
              <PartFiltersComponent filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Parts Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Mobile Filters */}
                <div className="lg:hidden">
                  <PartFiltersComponent filters={filters} onFiltersChange={setFilters} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {total} {total === 1 ? "part" : "parts"} found
                </p>
              </div>
              <PartSort value={sort} onChange={setSort} />
            </div>

            {/* Grid */}
            <PartGrid parts={parts} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
