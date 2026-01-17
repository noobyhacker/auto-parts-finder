// API service layer for Sanity CMS
// Configure your Sanity project ID and dataset in environment variables

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
} from "@/types";

// Sanity client configuration
const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || "your-project-id",
  dataset: import.meta.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Helper to transform Sanity image to URL
function imageUrl(image: any): string {
  if (!image?.asset?._ref) return "/placeholder.svg";
  const [, id, dimensions, format] = image.asset._ref.split("-");
  return `https://cdn.sanity.io/images/${client.config().projectId}/${client.config().dataset}/${id}-${dimensions}.${format}`;
}

// Brands
export async function getBrands(): Promise<Brand[]> {
  const query = `*[_type == "brand"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current
  }`;
  return client.fetch(query);
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
    year == $year][0] {
      "id": _id,
      year,
      engine,
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
  const query = `*[_type == "model" && brand._ref == $brandId] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    "brandId": brand._ref
  }`;
  return client.fetch(query, { brandId });
}

// Years (for a specific model)
export async function getYears(modelId: string): Promise<number[]> {
  const query = `*[_type == "vehicle" && model._ref == $modelId].yearFrom`;
  const raw: Array<number | string | null> = await client.fetch(query, { modelId });

  const years = raw
    .map((y) => (typeof y === "string" ? Number.parseInt(y, 10) : y))
    .filter((y): y is number => typeof y === "number" && Number.isFinite(y));

  return [...new Set(years)].sort((a, b) => b - a);
}

// Engines (for a specific model and year)
export async function getEngines(
  modelId: string,
  year: number
): Promise<string[]> {
  const query = `*[_type == "vehicle" && model._ref == $modelId && yearFrom == $year].engines`;
  const engines: (string | null)[] = await client.fetch(query, { modelId, year });
  return [...new Set(engines.filter((e): e is string => !!e))];
}

// Get vehicle by selection
export async function getVehicle(
  modelId: string,
  year: number,
  engine?: string
): Promise<Vehicle | null> {
  const query = engine
    ? `*[_type == "vehicle" && model._ref == $modelId && year == $year && engine == $engine][0] {
        "id": _id,
        year,
        engine,
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
    : `*[_type == "vehicle" && model._ref == $modelId && year == $year][0] {
        "id": _id,
        year,
        engine,
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
  const query = `*[_type == "category"] | order(name asc) {
    "id": _id,
    name,
    "slug": slug.current,
    icon
  }`;
  return client.fetch(query);
}

// Parts
export async function getParts(
  filters?: PartFilters,
  sort?: string,
  page = 1,
  pageSize = 12
): Promise<{ parts: Part[]; total: number }> {
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
  // Filter by brand (parts that have compatible vehicles with this brand)
  if (filters?.brandId) {
    conditions.push("count(compatibleVehicles[@->brand._ref == $brandId]) > 0");
    params.brandId = filters.brandId;
  }
  // Filter by model
  if (filters?.modelId) {
    conditions.push("count(compatibleVehicles[@->model._ref == $modelId]) > 0");
    params.modelId = filters.modelId;
  }
  // Filter by year
  if (filters?.year) {
    conditions.push("count(compatibleVehicles[@->yearFrom == $year]) > 0");
    params.year = filters.year;
  }
  // Filter by engine
  if (filters?.engine) {
    conditions.push("count(compatibleVehicles[@->engines == $engine]) > 0");
    params.engine = filters.engine;
  }
  if (filters?.searchTerm) {
    conditions.push("(name match $searchTerm || oemNumber match $searchTerm || articleNumber match $searchTerm)");
    params.searchTerm = `*${filters.searchTerm}*`;
  }

  const filterQuery = conditions.join(" && ");

  // Sort mapping
  let orderBy = "name asc";
  if (sort === "price:asc") orderBy = "price asc";
  else if (sort === "price:desc") orderBy = "price desc";
  else if (sort === "name:asc") orderBy = "name asc";
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
        year,
        engine,
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
}

// Single part (supports both slug and _id lookup)
export async function getPart(slugOrId: string): Promise<Part | null> {
  console.log("getPart called with slugOrId:", slugOrId);
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
      year,
      engine,
      "brand": brand->{name},
      "model": model->{name}
    }
  }`;
  const part = await client.fetch(query, { slugOrId });
  console.log("getPart result:", part);
  if (!part) return null;
  return {
    ...part,
    images: part.images || ["/placeholder.svg"],
  };
}

// Search parts
export async function searchParts(query: string): Promise<SearchResult> {
  const searchQuery = `{
    "parts": *[_type == "part" && (name match $search || articleNumber match $search)] [0...10] {
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
    "total": count(*[_type == "part" && (name match $search || articleNumber match $search)])
  }`;
  const result = await client.fetch(searchQuery, { search: `*${query}*` });
  return {
    parts: result.parts.map((p: any) => ({
      ...p,
      images: p.images || ["/placeholder.svg"],
    })),
    total: result.total,
  };
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
    
    // Check for errors (error codes 1-4 indicate issues)
    if (errorCode && !["0", "6"].includes(errorCode.split(",")[0])) {
      return { success: false, error: "Invalid VIN or vehicle not found" };
    }
    
    if (!year || !make || !model) {
      return { success: false, error: "Could not decode vehicle information" };
    }
    
    // Build engine string
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

// Submit contact form - Sanity mutations require write token
// Consider using a serverless function for this
export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean }> {
  // For production, use a serverless function with write token
  // This is a placeholder that logs the data
  console.log("Contact form submitted:", data);
  
  // If you have a write token configured:
  // const writeClient = createClient({
  //   ...client.config(),
  //   token: import.meta.env.VITE_SANITY_WRITE_TOKEN,
  //   useCdn: false,
  // });
  // await writeClient.create({
  //   _type: "contactRequest",
  //   ...data,
  //   submittedAt: new Date().toISOString(),
  // });
  
  return { success: true };
}

// Validate VIN format
export function isValidVIN(vin: string): boolean {
  if (vin.length !== 17) return false;
  if (/[IOQ]/i.test(vin)) return false;
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) return false;
  return true;
}
