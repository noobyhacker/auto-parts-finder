import { useQuery } from "@tanstack/react-query";
import {
  getBrands,
  getModels,
  getYears,
  getEngines,
  getCategories,
  getParts,
  getPart,
  searchParts,
  getVideoReviews,
} from "@/lib/api";
import type { PartFilters } from "@/types";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    staleTime: 30 * 60 * 1000, // 30 min - brands rarely change
  });
}

export function useModels(brandId: string | null) {
  return useQuery({
    queryKey: ["models", brandId],
    queryFn: () => getModels(brandId!),
    enabled: !!brandId,
    staleTime: 30 * 60 * 1000,
  });
}

export function useYears(modelId: string | null) {
  return useQuery({
    queryKey: ["years", modelId],
    queryFn: () => getYears(modelId!),
    enabled: !!modelId,
    staleTime: 30 * 60 * 1000,
  });
}

export function useEngines(modelId: string | null, year: number | null) {
  return useQuery({
    queryKey: ["engines", modelId, year],
    queryFn: () => getEngines(modelId!, year!),
    enabled: !!modelId && !!year,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000,
  });
}

export function useParts(filters: PartFilters, sort: string, page: number, pageSize: number) {
  return useQuery({
    queryKey: ["parts", filters, sort, page, pageSize],
    queryFn: () => getParts(filters, sort, page, pageSize),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePart(slugOrId: string | undefined) {
  return useQuery({
    queryKey: ["part", slugOrId],
    queryFn: () => getPart(slugOrId!),
    enabled: !!slugOrId,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchParts(query: string) {
  return useQuery({
    queryKey: ["searchParts", query],
    queryFn: () => searchParts(query),
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVideoReviews() {
  return useQuery({
    queryKey: ["videoReviews"],
    queryFn: getVideoReviews,
    staleTime: 30 * 60 * 1000,
  });
}
