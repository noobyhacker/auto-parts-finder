import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchParts } from "@/hooks/useQueries";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part } from "@/types";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Use React Query for cached search
  const { data: searchResult, isLoading } = useSearchParts(debouncedQuery);
  const results = searchResult?.parts || [];

  const handleSelect = (slug: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/part/${slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-lg">
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="border-0 bg-transparent px-3 py-4 text-base focus-visible:ring-0"
            autoFocus
          />
          {isLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        </div>

        {query && (
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => handleSelect(part.slug)}
                    className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">{part.name}</p>
                      <p className="text-xs text-muted-foreground">{part.articleNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">${part.price.toFixed(2)}</p>
                      <p className={`text-xs ${part.inStock ? 'text-success' : 'text-destructive'}`}>
                        {part.inStock ? t.common.inStock : t.common.outOfStock}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : !isLoading && (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Package className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">{t.common.noPartsFoundFor} "{query}"</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
