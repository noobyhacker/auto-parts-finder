import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useLoaderData } from "react-router-dom";
import { Loader2, Package2, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PartGrid } from "@/components/parts/PartGrid";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { Button } from "@/components/ui/button";
import { getParts } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import { getCatalogFirstPage } from "@/lib/catalog-build";
import type { Part, PartFilters } from "@/types";

const PAGE_SIZE = 12;

// Build-time loader: bakes the first, unfiltered listing page into the
// pre-rendered HTML so /catalog shows real content without JS.
export async function loader() {
  return getCatalogFirstPage(PAGE_SIZE);
}

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initial = (useLoaderData() as { parts: Part[]; total: number } | null) ?? null;
  const hasInitial = !!initial && initial.parts.length > 0 && !searchParams.get("search");
  const [parts, setParts] = useState<Part[]>(initial?.parts ?? []);
  const [isLoading, setIsLoading] = useState(!hasInitial);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(initial?.total ?? 0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PartFilters>(() => {
    const searchTerm = searchParams.get("search") ?? undefined;
    return searchTerm ? { searchTerm } : {};
  });
  // Skip the first client fetch when the loader already seeded page 1.
  const seededRef = useRef(hasInitial);
  const { t } = useLanguage();

  useEffect(() => {
    const searchTerm = searchParams.get("search") ?? undefined;
    setFilters(searchTerm ? { searchTerm } : {});
  }, [searchParams]);

  useEffect(() => {
    if (seededRef.current) {
      // First mount already has server-baked data — don't refetch/flash.
      seededRef.current = false;
      return;
    }
    const fetchParts = async () => {
      setIsLoading(true);
      setPage(1);
      try {
        const result = await getParts(filters, "name:asc", 1, PAGE_SIZE);
        setParts(result.parts);
        setTotal(result.total);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParts();
  }, [filters]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || parts.length >= total) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getParts(filters, "name:asc", nextPage, PAGE_SIZE);
      setParts((prev) => [...prev, ...result.parts]);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, parts.length, total, page, filters]);

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    setSearchParams(params);
    setFilters(value ? { searchTerm: value } : {});
  };

  const hasMore = parts.length < total;
  const currentSearch = searchParams.get("search") ?? "";

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 homepage-gradient" />
        <div className="absolute inset-0 animated-grid opacity-20" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 korean-texture select-none pointer-events-none" aria-hidden>
          부품
        </div>

        <div className="container-custom relative py-14 md:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs text-primary uppercase tracking-widest font-semibold">
                {t.catalogPage.title}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight animate-slide-up">
              {t.catalogPage.subtitle}
            </h1>
            <p className="mt-3 text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {t.vehicle.enterOEM}
            </p>

            {/* Search */}
            <div className="mt-6 animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <SearchAutocomplete
                initialValue={currentSearch}
                onSearch={handleSearch}
                navigateToCatalogOnEnter={false}
                inputClassName="h-12 text-base bg-background/80 backdrop-blur"
                className="max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS BAR ── */}
      <div className="border-b border-border/40 bg-card/40 backdrop-blur-sm">
        <div className="container-custom py-3 flex items-center gap-3">
          <Package2 className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t.common.loading}…
              </span>
            ) : (
              <>
                <span className="font-semibold text-foreground">{total}</span>{" "}
                {total === 1 ? t.common.part : t.common.parts} {t.common.found}
                {currentSearch && (
                  <> — <span className="text-primary italic">«{currentSearch}»</span></>
                )}
              </>
            )}
          </span>
          {currentSearch && !isLoading && (
            <button
              onClick={() => handleSearch("")}
              className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              {t.common.clearAllFilters}
            </button>
          )}
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="container-custom py-8 reveal">
        <PartGrid parts={parts} isLoading={isLoading} />

        {hasMore && !isLoading && (
          <div className="mt-10 flex flex-col items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={loadMore}
              disabled={isLoadingMore}
              className="min-w-[220px] gap-2"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  {t.vehicle.loadMore} ({parts.length}/{total})
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              {t.common.found}: {parts.length} / {total}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
