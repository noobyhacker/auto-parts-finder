/**
 * Client-side static data loader.
 *
 * Reads the LITE index (/catalog-lite.json) — only the fields the browser
 * renders (part cards, search, video carousel). The full catalog (with
 * descriptions, images and compatibleVehicles) is never shipped; it lives in
 * the pre-rendered per-part pages instead.
 *
 * Getters that need full-only data (single part, brands/models/vehicles) return
 * null so the api layer falls back to the Sanity CDN for those rare cases.
 */

import type {
  Brand,
  Model,
  Category,
  Part,
  PartFilters,
  VideoReview,
} from "@/types";

interface LiteCatalogData {
  parts: Part[]; // light records: no images/description/compatibleVehicles
  videoReviews: VideoReview[];
  generatedAt: string;
}

let cachedData: LiteCatalogData | null = null;
let loadPromise: Promise<LiteCatalogData | null> | null = null;

async function loadStaticData(): Promise<LiteCatalogData | null> {
  if (cachedData) return cachedData;
  if (loadPromise) return loadPromise;

  loadPromise = fetch("/catalog-lite.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      cachedData = data;
      return data;
    })
    .catch(() => null);

  return loadPromise;
}

// Brands/models/vehicles are not part of the lite index (their only consumer,
// VehicleSelector, is unused). Returning null lets the api layer hit Sanity.
export async function getStaticBrands(): Promise<Brand[] | null> {
  return null;
}

export async function getStaticModels(_brandId: string): Promise<Model[] | null> {
  return null;
}

export async function getStaticYears(_modelId: string): Promise<number[] | null> {
  return null;
}

export async function getStaticEngines(
  _modelId: string,
  _year: number
): Promise<string[] | null> {
  return null;
}

export async function getStaticCategories(): Promise<Category[] | null> {
  return null;
}

export async function getStaticVideoReviews(): Promise<VideoReview[] | null> {
  const data = await loadStaticData();
  return data?.videoReviews ?? null;
}

// Single part needs full data (images/description/compatibleVehicles) that the
// lite index omits. Pre-rendered pages use the build loader; for anything else
// return null so the api layer fetches the one part from Sanity.
export async function getStaticPart(_slugOrId: string): Promise<Part | null> {
  return null;
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

  // Filters that the lite index supports (Catalog only ever sets searchTerm).
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
    filtered = filtered
      .map((p) => ({ p, score: scoreMatch(p, filters.searchTerm!) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ p }) => p);
  }

  // Sort
  if (sort === "price:asc") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price:desc") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "name:asc") filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  else if (sort === "name:desc") filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const parts = filtered.slice(start, start + pageSize);

  return { parts, total };
}

const normalize = (s: string) => s.replace(/[\s\-_.]/g, "").toLowerCase();

function scoreMatch(p: Part, query: string): number {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return 0;
  const raw = [p.name ?? "", p.articleNumber ?? "", p.oemNumber ?? ""].join(" ").toLowerCase();
  const normed = normalize(raw);
  let score = 0;
  for (const token of tokens) {
    if (raw.includes(token) || normed.includes(normalize(token))) score++;
  }
  return score;
}

export async function searchStaticParts(query: string): Promise<{ parts: Part[]; total: number } | null> {
  const data = await loadStaticData();
  if (!data) return null;

  const scored = data.parts
    .map((p) => ({ p, score: scoreMatch(p, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || (a.p.name || "").localeCompare(b.p.name || ""));

  return { parts: scored.slice(0, 12).map((s) => s.p), total: scored.length };
}

export function isStaticDataAvailable(): boolean {
  return cachedData !== null;
}
