import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PartGrid } from "@/components/parts/PartGrid";
import { PartFiltersComponent } from "@/components/parts/PartFilters";
import { PartSort } from "@/components/parts/PartSort";
import { VehicleSelector } from "@/components/vehicle/VehicleSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getParts } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part, PartFilters, VehicleSelection } from "@/types";

const PAGE_SIZE = 12;

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt:desc");
  const [filters, setFilters] = useState<PartFilters>({});
  const [searchInput, setSearchInput] = useState("");
  const { t } = useLanguage();

  // Parse initial filters from URL
  useEffect(() => {
    const categoryId = searchParams.get("category");
    const searchTerm = searchParams.get("search");
    
    const newFilters: PartFilters = {};
    if (categoryId) newFilters.categoryId = categoryId;
    if (searchTerm) {
      newFilters.searchTerm = searchTerm;
      setSearchInput(searchTerm);
    }
    
    setFilters(newFilters);
  }, [searchParams]);

  // Fetch parts (reset on filter/sort change)
  useEffect(() => {
    const fetchParts = async () => {
      setIsLoading(true);
      setPage(1);
      try {
        const result = await getParts(filters, sort, 1, PAGE_SIZE);
        setParts(result.parts);
        setTotal(result.total);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParts();
  }, [filters, sort]);

  // Load more parts
  const loadMore = useCallback(async () => {
    if (isLoadingMore || parts.length >= total) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getParts(filters, sort, nextPage, PAGE_SIZE);
      setParts((prev) => [...prev, ...result.parts]);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, parts.length, total, page, filters, sort]);

  const handleVehicleSelect = (selection: VehicleSelection) => {
    const params = new URLSearchParams(searchParams);
    if (selection.brandId) params.set("brand", selection.brandId.toString());
    if (selection.modelId) params.set("model", selection.modelId.toString());
    if (selection.year) params.set("year", selection.year.toString());
    if (selection.engine) params.set("engine", selection.engine);
    setSearchParams(params);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    setSearchParams(params);
    setFilters((f) => ({ ...f, searchTerm: searchInput.trim() || undefined }));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const hasMore = parts.length < total;

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">{t.catalogPage.title}</h1>
          <p className="mt-1 text-muted-foreground">
            {t.catalogPage.subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.vehicle.enterOEM}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              {t.common.search}
            </Button>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div className="mb-8 rounded-lg border border-border/50 bg-card/50 p-4">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            {t.vehicle.filterByVehicle}
          </h2>
          <VehicleSelector onSelect={handleVehicleSelect} showButton={false} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-lg border border-border/50 bg-card/50 p-4">
              <h2 className="mb-4 text-sm font-semibold">{t.common.filters}</h2>
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
                  {total} {total === 1 ? t.common.part : t.common.parts} {t.common.found}
                </p>
              </div>
              <PartSort value={sort} onChange={setSort} />
            </div>

            {/* Grid */}
            <PartGrid parts={parts} isLoading={isLoading} />

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="min-w-[200px]"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.common.loading}
                    </>
                  ) : (
                    `Load More (${parts.length}/${total})`
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
