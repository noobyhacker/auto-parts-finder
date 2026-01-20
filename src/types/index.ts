// Data models matching Strapi structure

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Model {
  id: string;
  name: string;
  slug: string;
  brandId?: string;
}

export interface Vehicle {
  id: string;
  brand: Brand;
  model: Model;
  year: number;
  engine?: string;
}

export interface Category {
  id: string;
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
  brandId?: string;
  modelId?: string;
  year?: number;
  engine?: string;
}

export interface PartFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  vehicleId?: string;
  brandId?: string;
  modelId?: string;
  year?: number;
  engine?: string;
  searchTerm?: string;
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

export interface VideoReview {
  id: string;
  title: string;
  youtubeUrl: string;
  description?: string;
  order?: number;
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
