// API service layer - Uses static pre-built data when available, falls back to Sanity CMS
// Run `npm run fetch-data` before build to generate static data

import { createClient } from "@sanity/client";
import type {
  Brand,
  Model,
  Vehicle,
  Category,
  Part,
  VINDecodeResult,
  SearchResult,
  ContactFormData,
  PartFilters,
  VideoReview,
} from "@/types";
import {
  getStaticBrands,
  getStaticModels,
  getStaticYears,
  getStaticEngines,
  getStaticCategories,
  getStaticParts,
  getStaticPart,
  searchStaticParts,
  getStaticVideoReviews,
} from "@/lib/static-data";

export type { VideoReview };

// Sanity client configuration (fallback only)
const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "your-project-id",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Normalize a search query: lowercase, remove hyphens/spaces/dots
export function normalizeQuery(q: string): string {
  return q.replace(/[\s\-_.]/g, "").toLowerCase();
}

// Split a query into individual tokens (handles mixed-language, multi-word)
function tokenize(q: string): string[] {
  return q.trim().split(/\s+/).filter(Boolean).slice(0, 5);
}

// Build the GROQ search condition for name/OEM/article with normalized fallback
function buildSearchCondition(rawParam: string, normalizedParam: string): string {
  return `(name match $${rawParam} || oemNumber match $${rawParam} || articleNumber match $${rawParam} || searchIndex match $${normalizedParam})`;
}

// Build a multi-token GROQ condition: each token must appear in at least one field
// Returns the condition string and params object to merge into the query params
function buildMultiTokenCondition(query: string): { condition: string; params: Record<string, string> } {
  const tokens = tokenize(query);
  if (tokens.length <= 1) {
    return {
      condition: buildSearchCondition("search", "searchN"),
      params: { search: `*${query}*`, searchN: `*${normalizeQuery(query)}*` },
    };
  }
  const perToken = tokens.map((_, i) =>
    `(name match $t${i} || oemNumber match $t${i} || articleNumber match $t${i} || searchIndex match $tn${i})`
  );
  const params: Record<string, string> = {};
  tokens.forEach((token, i) => {
    params[`t${i}`] = `*${token}*`;
    params[`tn${i}`] = `*${normalizeQuery(token)}*`;
  });
  return { condition: perToken.join(" && "), params };
}

// Helper to transform Sanity image to URL
function imageUrl(image: any): string {
  if (!image?.asset?._ref) return "/placeholder.svg";
  const [, id, dimensions, format] = image.asset._ref.split("-");
  return `https://cdn.sanity.io/images/${client.config().projectId}/${client.config().dataset}/${id}-${dimensions}.${format}`;
}

// Brands
export async function getBrands(): Promise<Brand[]> {
  try {
    const staticData = await getStaticBrands();
    if (staticData) return staticData;

    const query = `*[_type == "brand"] | order(name asc) {
      "id": _id,
      name,
      "slug": slug.current
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.warn("Failed to fetch brands:", error);
    return [];
  }
}

// Find vehicle by brand name, model name, year (for VIN matching)
export async function findVehicleByDetails(
  brandName: string,
  modelName: string,
  year: number
): Promise<Vehicle | null> {
  const query = `*[_type == "vehicle" &&
    brand->name match $brandName &&
    model->name match $modelName &&
    yearFrom == $year][0] {
      "id": _id,
      "year": yearFrom,
      "engine": engines,
      "brand": brand->{
        "id": _id,
        name,
        "slug": slug.current
      },
      "model": model->{
        "id": _id,
        name,
        "slug": slug.current
      }
    }`;
  return client.fetch(query, { 
    brandName: `*${brandName}*`, 
    modelName: `*${modelName}*`, 
    year 
  });
}

// Models (filtered by brand)
export async function getModels(brandId: string): Promise<Model[]> {
  try {
    const staticData = await getStaticModels(brandId);
    if (staticData) return staticData;

    const query = `*[_type == "model" && brand._ref == $brandId] | order(name asc) {
      "id": _id,
      name,
      "slug": slug.current,
      "brandId": brand._ref
    }`;
    return await client.fetch(query, { brandId });
  } catch (error) {
    console.warn("Failed to fetch models:", error);
    return [];
  }
}

// Years (for a specific model)
export async function getYears(modelId: string): Promise<number[]> {
  try {
    const staticData = await getStaticYears(modelId);
    if (staticData) return staticData;

    const query = `*[_type == "vehicle" && model._ref == $modelId].yearFrom`;
    const raw: Array<number | string | null> = await client.fetch(query, { modelId });

    const years = raw
      .map((y) => (typeof y === "string" ? Number.parseInt(y, 10) : y))
      .filter((y): y is number => typeof y === "number" && Number.isFinite(y));

    return [...new Set(years)].sort((a, b) => b - a);
  } catch (error) {
    console.warn("Failed to fetch years:", error);
    return [];
  }
}

// Engines (for a specific model and year)
export async function getEngines(
  modelId: string,
  year: number
): Promise<string[]> {
  try {
    const staticData = await getStaticEngines(modelId, year);
    if (staticData) return staticData;

    const query = `*[_type == "vehicle" && model._ref == $modelId && yearFrom == $year].engines`;
    const engines: (string | null)[] = await client.fetch(query, { modelId, year });
    return [...new Set(engines.filter((e): e is string => !!e))];
  } catch (error) {
    console.warn("Failed to fetch engines:", error);
    return [];
  }
}

// Get vehicle by selection
export async function getVehicle(
  modelId: string,
  year: number,
  engine?: string
): Promise<Vehicle | null> {
  const query = engine
    ? `*[_type == "vehicle" && model._ref == $modelId && yearFrom == $year && engines == $engine][0] {
        "id": _id,
        "year": yearFrom,
        "engine": engines,
        "brand": brand->{
          "id": _id,
          name,
          "slug": slug.current
        },
        "model": model->{
          "id": _id,
          name,
          "slug": slug.current
        }
      }`
    : `*[_type == "vehicle" && model._ref == $modelId && yearFrom == $year][0] {
        "id": _id,
        "year": yearFrom,
        "engine": engines,
        "brand": brand->{
          "id": _id,
          name,
          "slug": slug.current
        },
        "model": model->{
          "id": _id,
          name,
          "slug": slug.current
        }
      }`;
  return client.fetch(query, { modelId, year, engine });
}

// Categories
export async function getCategories(): Promise<Category[]> {
  try {
    const staticData = await getStaticCategories();
    if (staticData) return staticData;

    const query = `*[_type == "category"] | order(name asc) {
      "id": _id,
      name,
      "slug": slug.current,
      icon
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.warn("Failed to fetch categories:", error);
    return [];
  }
}

// Parts
export async function getParts(
  filters?: PartFilters,
  sort?: string,
  page = 1,
  pageSize = 12
): Promise<{ parts: Part[]; total: number }> {
  try {
    const staticData = await getStaticParts(filters, sort, page, pageSize);
    if (staticData) return staticData;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    // Build filter conditions
    const conditions: string[] = ['_type == "part"'];
    const params: Record<string, any> = {};

    if (filters?.categoryId) {
      conditions.push("category._ref == $categoryId");
      params.categoryId = filters.categoryId;
    }
    if (filters?.minPrice) {
      conditions.push("price >= $minPrice");
      params.minPrice = filters.minPrice;
    }
    if (filters?.maxPrice) {
      conditions.push("price <= $maxPrice");
      params.maxPrice = filters.maxPrice;
    }
    if (filters?.inStockOnly) {
      conditions.push("inStock == true");
    }
    if (filters?.vehicleId) {
      conditions.push("$vehicleId in compatibleVehicles[]._ref");
      params.vehicleId = filters.vehicleId;
    }
    if (filters?.brandId) {
      conditions.push("count(compatibleVehicles[@->brand._ref == $brandId]) > 0");
      params.brandId = filters.brandId;
    }
    if (filters?.modelId) {
      conditions.push("count(compatibleVehicles[@->model._ref == $modelId]) > 0");
      params.modelId = filters.modelId;
    }
    if (filters?.year) {
      conditions.push("count(compatibleVehicles[@->yearFrom == $year]) > 0");
      params.year = filters.year;
    }
    if (filters?.engine) {
      conditions.push("count(compatibleVehicles[@->engines == $engine]) > 0");
      params.engine = filters.engine;
    }
    if (filters?.searchTerm) {
      const { condition: tokenCondition, params: tokenParams } = buildMultiTokenCondition(filters.searchTerm);
      conditions.push(tokenCondition);
      Object.assign(params, tokenParams);
    }

    const filterQuery = conditions.join(" && ");

    let orderBy = "name asc";
    if (sort === "price:asc") orderBy = "price asc";
    else if (sort === "price:desc") orderBy = "price desc";
    else if (sort === "name:desc") orderBy = "name desc";
    else if (sort === "createdAt:desc") orderBy = "_createdAt desc";

    const query = `{
      "parts": *[${filterQuery}] | order(${orderBy}) [$start...$end] {
        "id": _id,
        name,
        "slug": coalesce(slug.current, _id),
        articleNumber,
        oemNumber,
        price,
        description,
        inStock,
        stockQuantity,
        "images": images[].asset->url,
        "category": category->{
          "id": _id,
          name,
          "slug": slug.current
        },
        "compatibleVehicles": compatibleVehicles[]->{
          "id": _id,
          "year": yearFrom,
          "engine": engines,
          "brand": brand->{name},
          "model": model->{name}
        }
      },
      "total": count(*[${filterQuery}])
    }`;

    const result = await client.fetch(query, { ...params, start, end });
    return {
      parts: result.parts.map((p: any) => ({
        ...p,
        images: p.images || ["/placeholder.svg"],
      })),
      total: result.total,
    };
  } catch (error) {
    console.warn("Failed to fetch parts:", error);
    return { parts: [], total: 0 };
  }
}

// Single part (supports both slug and _id lookup)
export async function getPart(slugOrId: string): Promise<Part | null> {
  try {
    const staticData = await getStaticPart(slugOrId);
    if (staticData) return staticData;

    const query = `*[_type == "part" && (slug.current == $slugOrId || _id == $slugOrId)][0] {
      "id": _id,
      name,
      "slug": coalesce(slug.current, _id),
      articleNumber,
      oemNumber,
      price,
      description,
      inStock,
      stockQuantity,
      "images": images[].asset->url,
      "category": category->{
        "id": _id,
        name,
        "slug": slug.current
      },
      "compatibleVehicles": compatibleVehicles[]->{
        "id": _id,
        "year": yearFrom,
        "engine": engines,
        "brand": brand->{ name },
        "model": model->{ name }
      }
    }`;
    const part = await client.fetch(query, { slugOrId });
    if (!part) return null;
    return {
      ...part,
      images: part.images || ["/placeholder.svg"],
    };
  } catch (error) {
    console.warn("Failed to fetch part:", error);
    return null;
  }
}

// Search parts
export async function searchParts(query: string): Promise<SearchResult> {
  try {
    const staticData = await searchStaticParts(query);
    if (staticData) return staticData;

    const { condition: tokenCondition, params: tokenParams } = buildMultiTokenCondition(query);
    const condition = `_type == "part" && ${tokenCondition}`;
    const searchQuery = `{
      "parts": *[${condition}] | order(name asc) [0...12] {
        "id": _id,
        name,
        "slug": slug.current,
        articleNumber,
        oemNumber,
        price,
        inStock,
        "images": images[].asset->url,
        "category": category->{
          "id": _id,
          name,
          "slug": slug.current
        }
      },
      "total": count(*[${condition}])
    }`;
    const result = await client.fetch(searchQuery, tokenParams);
    return {
      parts: result.parts.map((p: any) => ({
        ...p,
        images: p.images || ["/placeholder.svg"],
      })),
      total: result.total,
    };
  } catch (error) {
    console.warn("Failed to search parts:", error);
    return { parts: [], total: 0 };
  }
}

// VIN decode using free NHTSA API
export async function decodeVIN(vin: string): Promise<VINDecodeResult> {
  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`
    );
    
    if (!response.ok) {
      return { success: false, error: "Failed to decode VIN" };
    }
    
    const data = await response.json();
    const results = data.Results as Array<{ Variable: string; Value: string | null }>;
    
    const getValue = (variable: string): string | null => {
      const item = results.find(r => r.Variable === variable);
      return item?.Value || null;
    };
    
    const year = getValue("Model Year");
    const make = getValue("Make");
    const model = getValue("Model");
    const engine = getValue("Displacement (L)");
    const engineCylinders = getValue("Engine Number of Cylinders");
    const errorCode = getValue("Error Code");
    
    if (errorCode && !["0", "6"].includes(errorCode.split(",")[0])) {
      return { success: false, error: "Invalid VIN or vehicle not found" };
    }
    
    if (!year || !make || !model) {
      return { success: false, error: "Could not decode vehicle information" };
    }
    
    let engineStr: string | undefined;
    if (engine) {
      engineStr = `${engine}L`;
      if (engineCylinders) {
        engineStr += ` ${engineCylinders}-cyl`;
      }
    }
    
    const brandSlug = make.toLowerCase().replace(/\s+/g, "-");
    const modelSlug = model.toLowerCase().replace(/\s+/g, "-");
    
    return {
      success: true,
      vehicle: {
        id: `vin-${vin}`,
        year: parseInt(year),
        engine: engineStr,
        brand: { id: make.toLowerCase(), name: make, slug: brandSlug },
        model: { id: modelSlug, name: model, slug: modelSlug },
      },
    };
  } catch (error) {
    console.error("VIN decode error:", error);
    return { success: false, error: "Failed to connect to VIN decoder" };
  }
}

// Submit contact form
export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean }> {
  console.log("Contact form submitted:", data);
  return { success: true };
}

// Validate VIN format
export function isValidVIN(vin: string): boolean {
  if (vin.length !== 17) return false;
  if (/[IOQ]/i.test(vin)) return false;
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) return false;
  return true;
}

// Video Reviews
export async function getVideoReviews(): Promise<VideoReview[]> {
  try {
    const staticData = await getStaticVideoReviews();
    if (staticData) return staticData;

    const query = `*[_type == "videoReview"] | order(order asc, _createdAt desc) {
      "id": _id,
      title,
      youtubeUrl,
      description,
      order
    }`;
    return await client.fetch(query);
  } catch (error) {
    console.warn("Failed to fetch video reviews:", error);
    return [];
  }
}
