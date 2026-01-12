// Data models matching Strapi structure

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
}

export interface Model {
  id: number;
  name: string;
  slug: string;
  brand: Brand;
}

export interface Vehicle {
  id: number;
  brand: Brand;
  model: Model;
  year: number;
  engine?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  partCount?: number;
}

export interface PartImage {
  id: number;
  url: string;
  alt?: string;
}

export interface Part {
  id: number | string;
  name: string;
  slug: string;
  articleNumber: string;
  oemNumber?: string;
  price: number;
  images: (string | PartImage)[];
  description?: string;
  inStock: boolean;
  stockQuantity?: number;
  category: Category;
  compatibleVehicles?: Vehicle[];
}

export interface VINDecodeResult {
  success: boolean;
  vehicle?: Vehicle;
  error?: string;
}

export interface VehicleSelection {
  brandId?: number;
  modelId?: number;
  year?: number;
  engine?: string;
}

export interface PartFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  vehicleId?: number;
}

export interface PartSortOption {
  value: string;
  label: string;
}

export interface ContactFormData {
  name: string;
  contact: string;
  message: string;
  partId?: number;
  vehicleInfo?: string;
}

export interface SearchResult {
  parts: Part[];
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
