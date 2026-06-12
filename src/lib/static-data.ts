/**
 * Static data loader - reads pre-built JSON from /data/catalog.json
 * Falls back to Sanity API if static data isn't available (dev mode)
 */

import type {
  Brand,
  Model,
  Category,
  Part,
  PartFilters,
  VideoReview,
} from "@/types";

interface StaticCatalogData {
  brands: Brand[];
  modelsByBrand: Record<string, Model[]>;
  categories: Category[];
  vehiclesByModel: Record<string, Array<{
    id: string;
    yearFrom: number;
    engines: string;
    brandId: string;
    modelId: string;
    brand: { id: string; name: string; slug: string };
    model: { id: string; name: string; slug: string };
  }>>;
  parts: Part[];
  videoReviews: VideoReview[];
  generatedAt: string;
}

let cachedData: StaticCatalogData | null = null;
let loadPromise: Promise<StaticCatalogData | null> | null = null;

async function loadStaticData(): Promise<StaticCatalogData | null> {
  if (cachedData) return cachedData;
  if (loadPromise) return loadPromise;

  loadPromise = fetch("/data/catalog.json")
    .then((res) => {
      if (!res.ok) return null;
      return res.json();
    })
    .then((data) => {
      cachedData = data;
      return data;
    })
    .catch(() => null);

  return loadPromise;
}

export async function getStaticBrands(): Promise<Brand[] | null> {
  const data = await loadStaticData();
  return data?.brands ?? null;
}

export async function getStaticModels(brandId: string): Promise<Model[] | null> {
  const data = await loadStaticData();
  if (!data) return null;
  return data.modelsByBrand[brandId] ?? [];
}

export async function getStaticYears(modelId: string): Promise<number[] | null> {
  const data = await loadStaticData();
  if (!data) return null;
  const vehicles = data.vehiclesByModel[modelId] ?? [];
  const years = vehicles
    .map((v) => typeof v.yearFrom === "string" ? parseInt(v.yearFrom, 10) : v.yearFrom)
    .filter((y): y is number => typeof y === "number" && Number.isFinite(y));
  return [...new Set(years)].sort((a, b) => b - a);
}

export async function getStaticEngines(modelId: string, year: number): Promise<string[] | null> {
  const data = await loadStaticData();
  if (!data) return null;
  const vehicles = data.vehiclesByModel[modelId] ?? [];
  const engines = vehicles
    .filter((v) => v.yearFrom === year)
    .map((v) => v.engines)
    .filter((e): e is string => !!e);
  return [...new Set(engines)];
}

export async function getStaticCategories(): Promise<Category[] | null> {
  const data = await loadStaticData();
  return data?.categories ?? null;
}

export async function getStaticVideoReviews(): Promise<VideoReview[] | null> {
  const data = await loadStaticData();
  return data?.videoReviews ?? null;
}

export async function getStaticPart(slugOrId: string): Promise<Part | null> {
  const data = await loadStaticData();
  if (!data) return null;
  return data.parts.find((p) => p.slug === slugOrId || p.id === slugOrId) ?? null;
}

export async function getStaticParts(
  filters?: PartFilters,
  sort?: string,
  page = 1,
  pageSize = 12
): Promise<{ parts: Part[]; total: number } | null> {
  const data = await loadStaticData();
  if (!data) return null;

  let filtered = [...data.parts];

  // Apply filters
  if (filters?.categoryId) {
    filtered = filtered.filter((p) => p.category?.id === filters.categoryId);
  }
  if (filters?.inStockOnly) {
    filtered = filtered.filter((p) => p.inStock);
  }
  if (filters?.minPrice) {
    filtered = filtered.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.searchTerm) {
    filtered = filtered.filter((p) => matchesAllTokens(p, filters.searchTerm!));
  }
  if (filters?.brandId) {
    filtered = filtered.filter((p) =>
      p.compatibleVehicles?.some((v: any) => v.brandId === filters.brandId || v.brand?.id === filters.brandId)
    );
  }
  if (filters?.modelId) {
    filtered = filtered.filter((p) =>
      p.compatibleVehicles?.some((v: any) => v.modelId === filters.modelId || v.model?.id === filters.modelId)
    );
  }
  if (filters?.year) {
    filtered = filtered.filter((p) =>
      p.compatibleVehicles?.some((v: any) => v.yearFrom === filters.year || v.year === filters.year)
    );
  }
  if (filters?.engine) {
    filtered = filtered.filter((p) =>
      p.compatibleVehicles?.some((v: any) => v.engines === filters.engine || v.engine === filters.engine)
    );
  }

  // Sort
  if (sort === "price:asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price:desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "name:asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "name:desc") filtered.sort((a, b) => b.name.localeCompare(a.name));

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const parts = filtered.slice(start, start + pageSize);

  return { parts, total };
}

function matchesAllTokens(p: Part, query: string): boolean {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const norm = (s: string) => s.replace(/[\s\-_.]/g, "").toLowerCase();
  const fields = [p.name, p.articleNumber ?? "", p.oemNumber ?? ""].map((f) => f.toLowerCase());
  const normFields = fields.map(norm);

  return tokens.every((token) => {
    const normToken = norm(token);
    return (
      fields.some((f) => f.includes(token)) ||
      normFields.some((f) => f.includes(normToken))
    );
  });
}

export async function searchStaticParts(query: string): Promise<{ parts: Part[]; total: number } | null> {
  const data = await loadStaticData();
  if (!data) return null;

  const matched = data.parts.filter((p) => matchesAllTokens(p, query));
  return { parts: matched.slice(0, 12), total: matched.length };
}

export function isStaticDataAvailable(): boolean {
  return cachedData !== null;
}
