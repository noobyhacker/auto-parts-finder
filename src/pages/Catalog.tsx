import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PartGrid } from "@/components/parts/PartGrid";
import { SearchAutocomplete } from "@/components/search/SearchAutocomplete";
import { Button } from "@/components/ui/button";
import { getParts } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part, PartFilters } from "@/types";

const PAGE_SIZE = 12;

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PartFilters>({});
  const { t } = useLanguage();

  // Sync filters from URL on mount / URL change
  useEffect(() => {
    const searchTerm = searchParams.get("search") ?? undefined;
    setFilters(searchTerm ? { searchTerm } : {});
  }, [searchParams]);

  // Fetch parts whenever filters change
  useEffect(() => {
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
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
    setFilters(value ? { searchTerm: value } : {});
  };

  const hasMore = parts.length < total;
  const currentSearch = searchParams.get("search") ?? "";

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold">{t.catalogPage.title}</h1>
          <p className="mt-1 text-muted-foreground">{t.catalogPage.subtitle}</p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-xl">
          <SearchAutocomplete
            initialValue={currentSearch}
            onSearch={handleSearch}
            navigateToCatalogOnEnter={false}
            inputClassName="h-11 text-base"
          />
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {total} {total === 1 ? t.common.part : t.common.parts} {t.common.found}
        </p>

        {/* Grid */}
        <PartGrid parts={parts} isLoading={isLoading} />

        {/* Load More */}
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
                `${t.vehicle.loadMore} (${parts.length}/${total})`
              )}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
