// API service layer for Strapi REST API
// All endpoints are placeholder URLs - replace with actual Strapi instance

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
  ApiResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Brands
export async function getBrands(): Promise<Brand[]> {
  const response = await fetchApi<ApiResponse<Brand[]>>("/brands?sort=name");
  return response.data;
}

// Models (filtered by brand)
export async function getModels(brandId: number): Promise<Model[]> {
  const response = await fetchApi<ApiResponse<Model[]>>(
    `/models?filters[brand][id][$eq]=${brandId}&sort=name`
  );
  return response.data;
}

// Years (for a specific model)
export async function getYears(modelId: number): Promise<number[]> {
  const response = await fetchApi<ApiResponse<Vehicle[]>>(
    `/vehicles?filters[model][id][$eq]=${modelId}&fields=year`
  );
  const years = [...new Set(response.data.map((v) => v.year))];
  return years.sort((a, b) => b - a);
}

// Engines (for a specific model and year)
export async function getEngines(
  modelId: number,
  year: number
): Promise<string[]> {
  const response = await fetchApi<ApiResponse<Vehicle[]>>(
    `/vehicles?filters[model][id][$eq]=${modelId}&filters[year][$eq]=${year}&fields=engine`
  );
  const engines = response.data
    .map((v) => v.engine)
    .filter((e): e is string => !!e);
  return [...new Set(engines)];
}

// Get vehicle by selection
export async function getVehicle(
  modelId: number,
  year: number,
  engine?: string
): Promise<Vehicle | null> {
  let endpoint = `/vehicles?filters[model][id][$eq]=${modelId}&filters[year][$eq]=${year}&populate=*`;
  if (engine) {
    endpoint += `&filters[engine][$eq]=${encodeURIComponent(engine)}`;
  }
  const response = await fetchApi<ApiResponse<Vehicle[]>>(endpoint);
  return response.data[0] || null;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetchApi<ApiResponse<Category[]>>(
    "/categories?sort=name"
  );
  return response.data;
}

// Parts
export async function getParts(
  filters?: PartFilters,
  sort?: string,
  page = 1,
  pageSize = 12
): Promise<{ parts: Part[]; total: number }> {
  let endpoint = `/parts?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;

  if (filters?.categoryId) {
    endpoint += `&filters[category][id][$eq]=${filters.categoryId}`;
  }
  if (filters?.minPrice) {
    endpoint += `&filters[price][$gte]=${filters.minPrice}`;
  }
  if (filters?.maxPrice) {
    endpoint += `&filters[price][$lte]=${filters.maxPrice}`;
  }
  if (filters?.inStockOnly) {
    endpoint += `&filters[inStock][$eq]=true`;
  }
  if (filters?.vehicleId) {
    endpoint += `&filters[compatibleVehicles][id][$eq]=${filters.vehicleId}`;
  }

  if (sort) {
    endpoint += `&sort=${sort}`;
  }

  const response = await fetchApi<ApiResponse<Part[]>>(endpoint);
  return {
    parts: response.data,
    total: response.meta?.pagination?.total || 0,
  };
}

// Single part
export async function getPart(slug: string): Promise<Part | null> {
  const response = await fetchApi<ApiResponse<Part[]>>(
    `/parts?filters[slug][$eq]=${slug}&populate=*`
  );
  return response.data[0] || null;
}

// Search parts
export async function searchParts(query: string): Promise<SearchResult> {
  const response = await fetchApi<ApiResponse<Part[]>>(
    `/parts?filters[$or][0][name][$containsi]=${encodeURIComponent(query)}&filters[$or][1][articleNumber][$containsi]=${encodeURIComponent(query)}&populate=*&pagination[pageSize]=10`
  );
  return {
    parts: response.data,
    total: response.meta?.pagination?.total || 0,
  };
}

// VIN decode
export async function decodeVIN(vin: string): Promise<VINDecodeResult> {
  try {
    const response = await fetchApi<VINDecodeResult>("/decode-vin", {
      method: "POST",
      body: JSON.stringify({ vin }),
    });
    return response;
  } catch {
    return { success: false, error: "Failed to decode VIN" };
  }
}

// Submit contact form
export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean }> {
  await fetchApi("/contact-requests", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
  return { success: true };
}

// Validate VIN format
export function isValidVIN(vin: string): boolean {
  if (vin.length !== 17) return false;
  // VIN cannot contain I, O, or Q
  if (/[IOQ]/i.test(vin)) return false;
  // VIN must be alphanumeric
  if (!/^[A-HJ-NPR-Z0-9]+$/i.test(vin)) return false;
  return true;
}
