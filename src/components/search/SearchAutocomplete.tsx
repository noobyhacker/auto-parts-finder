import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, Package, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParts } from "@/hooks/useQueries";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchAutocompleteProps {
  placeholder?: string;
  /** If true, pressing Enter navigates to catalog?search=… instead of requiring a result pick */
  navigateToCatalogOnEnter?: boolean;
  className?: string;
  inputClassName?: string;
  onSearch?: (value: string) => void;
  initialValue?: string;
}

export function SearchAutocomplete({
  placeholder,
  navigateToCatalogOnEnter = true,
  className = "",
  inputClassName = "",
  onSearch,
  initialValue = "",
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const ph = placeholder ?? t.vehicle.enterOEM;

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setActiveIndex(-1);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Keep dropdown open only when there's a query
  useEffect(() => {
    setIsOpen(debouncedQuery.trim().length >= 1);
  }, [debouncedQuery]);

  const { data: searchResult, isLoading } = useSearchParts(debouncedQuery);
  const results = searchResult?.parts ?? [];

  // Track input position for portal dropdown
  useEffect(() => {
    function updatePosition() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true, capture: true });
    window.addEventListener("resize", updatePosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", updatePosition, { capture: true });
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback((slug: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/part/${slug}`);
  }, [navigate]);

  const commit = useCallback(() => {
    if (activeIndex >= 0 && results[activeIndex]) {
      handleSelect(results[activeIndex].slug);
      return;
    }
    const q = query.trim();
    if (!q) return;
    setIsOpen(false);
    if (onSearch) {
      onSearch(q);
    } else if (navigateToCatalogOnEnter) {
      navigate(`/catalog?search=${encodeURIComponent(q)}`);
    }
  }, [activeIndex, results, query, onSearch, navigateToCatalogOnEnter, navigate, handleSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const clear = () => {
    setQuery("");
    setIsOpen(false);
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (debouncedQuery.trim()) setIsOpen(true); }}
          placeholder={ph}
          className={`pl-10 pr-8 ${inputClassName}`}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !isLoading && (
          <button
            onClick={clear}
            className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (query.trim().length >= 1) && createPortal(
        <div
          style={dropdownStyle}
          className="rounded-lg border border-border bg-background shadow-xl overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          {results.length > 0 ? (
            <ul
              className="max-h-72 overflow-y-auto py-1"
              style={{ overscrollBehavior: "contain" }}
            >
              {results.map((part, i) => (
                <li key={part.id}>
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(part.slug); }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === activeIndex ? "bg-accent" : "hover:bg-accent/60"
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium leading-tight">{part.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[part.articleNumber, part.oemNumber].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className={`shrink-0 text-xs font-medium ${part.inStock ? "text-green-500" : "text-muted-foreground"}`}>
                      {part.inStock ? t.common.inStock : t.common.outOfStock}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : !isLoading ? (
            <div className="flex flex-col items-center gap-1 py-6 text-center">
              <Package className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {t.common.noPartsFoundFor} "{query}"
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
