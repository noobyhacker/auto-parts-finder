import { PartCard } from "./PartCard";
import { Package } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Part } from "@/types";

interface PartGridProps {
  parts: Part[];
  isLoading?: boolean;
}

export function PartGrid({ parts, isLoading }: PartGridProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="part-card animate-pulse">
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 rounded bg-secondary" />
                <div className="h-5 w-16 rounded bg-secondary" />
              </div>
              <div className="h-4 w-full rounded bg-secondary" />
              <div className="h-3 w-24 rounded bg-secondary" />
              <div className="h-5 w-20 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/30" />
        <h3 className="mt-4 font-display text-lg font-semibold">{t.common.noPartsFound}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.common.noPartsFoundDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {parts.map((part) => (
        <PartCard key={part.id} part={part} />
      ))}
    </div>
  );
}
