// Mock data for development - simulates Strapi API responses
import type { Brand, Model, Category, Part, Vehicle } from "@/types";

// Only Korean car brands
export const mockBrands: Brand[] = [
  { id: 1, name: "Hyundai", slug: "hyundai" },
  { id: 2, name: "Kia", slug: "kia" },
  { id: 3, name: "Genesis", slug: "genesis" },
  { id: 4, name: "SsangYong", slug: "ssangyong" },
];

export const mockModels: Model[] = [
  // Hyundai models
  { id: 1, name: "Sonata", slug: "sonata", brand: mockBrands[0] },
  { id: 2, name: "Elantra", slug: "elantra", brand: mockBrands[0] },
  { id: 3, name: "Tucson", slug: "tucson", brand: mockBrands[0] },
  { id: 4, name: "Santa Fe", slug: "santa-fe", brand: mockBrands[0] },
  { id: 5, name: "Palisade", slug: "palisade", brand: mockBrands[0] },
  { id: 6, name: "Kona", slug: "kona", brand: mockBrands[0] },
  { id: 7, name: "Accent", slug: "accent", brand: mockBrands[0] },
  { id: 8, name: "Ioniq 5", slug: "ioniq-5", brand: mockBrands[0] },
  // Kia models
  { id: 9, name: "K5 (Optima)", slug: "k5-optima", brand: mockBrands[1] },
  { id: 10, name: "Sportage", slug: "sportage", brand: mockBrands[1] },
  { id: 11, name: "Sorento", slug: "sorento", brand: mockBrands[1] },
  { id: 12, name: "Telluride", slug: "telluride", brand: mockBrands[1] },
  { id: 13, name: "Carnival", slug: "carnival", brand: mockBrands[1] },
  { id: 14, name: "Seltos", slug: "seltos", brand: mockBrands[1] },
  { id: 15, name: "Rio", slug: "rio", brand: mockBrands[1] },
  { id: 16, name: "EV6", slug: "ev6", brand: mockBrands[1] },
  // Genesis models
  { id: 17, name: "G70", slug: "g70", brand: mockBrands[2] },
  { id: 18, name: "G80", slug: "g80", brand: mockBrands[2] },
  { id: 19, name: "G90", slug: "g90", brand: mockBrands[2] },
  { id: 20, name: "GV70", slug: "gv70", brand: mockBrands[2] },
  { id: 21, name: "GV80", slug: "gv80", brand: mockBrands[2] },
  // SsangYong models
  { id: 22, name: "Rexton", slug: "rexton", brand: mockBrands[3] },
  { id: 23, name: "Korando", slug: "korando", brand: mockBrands[3] },
  { id: 24, name: "Tivoli", slug: "tivoli", brand: mockBrands[3] },
  { id: 25, name: "Musso", slug: "musso", brand: mockBrands[3] },
];

export const mockYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

export const mockEngines = ["2.0L GDI", "2.4L GDI", "1.6L Turbo", "2.5L Turbo", "3.5L V6", "2.2L CRDi Diesel", "Electric"];

export const mockCategories: Category[] = [
  { id: 1, name: "Engine Parts", slug: "engine-parts", partCount: 245 },
  { id: 2, name: "Brake System", slug: "brake-system", partCount: 156 },
  { id: 3, name: "Suspension", slug: "suspension", partCount: 189 },
  { id: 4, name: "Filters", slug: "filters", partCount: 78 },
  { id: 5, name: "Electrical", slug: "electrical", partCount: 234 },
  { id: 6, name: "Body Parts", slug: "body-parts", partCount: 312 },
  { id: 7, name: "Cooling System", slug: "cooling-system", partCount: 98 },
  { id: 8, name: "Transmission", slug: "transmission", partCount: 145 },
];

export const mockParts: Part[] = [
  {
    id: 1,
    name: "Engine Oil Filter",
    slug: "engine-oil-filter-263203c30a",
    articleNumber: "26320-3C30A",
    oemNumber: "26320-3C30A",
    price: 12.99,
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop", alt: "Oil Filter" },
    ],
    description: "Genuine OEM oil filter for optimal engine protection. High-quality filtration media removes contaminants and ensures clean oil circulation.",
    inStock: true,
    stockQuantity: 50,
    category: mockCategories[3],
  },
  {
    id: 2,
    name: "Front Brake Pads Set",
    slug: "front-brake-pads-581012ta00",
    articleNumber: "58101-2TA00",
    oemNumber: "58101-2TA00",
    price: 89.99,
    images: [
      { id: 2, url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", alt: "Brake Pads" },
    ],
    description: "Premium ceramic brake pads for quiet, dust-free braking performance. OEM quality with excellent heat dissipation.",
    inStock: true,
    stockQuantity: 25,
    category: mockCategories[1],
  },
  {
    id: 3,
    name: "Air Filter Element",
    slug: "air-filter-281133x000",
    articleNumber: "28113-3X000",
    price: 24.99,
    images: [
      { id: 3, url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop", alt: "Air Filter" },
    ],
    description: "High-flow air filter element for improved engine breathing and fuel efficiency. Easy installation.",
    inStock: true,
    stockQuantity: 100,
    category: mockCategories[3],
  },
  {
    id: 4,
    name: "Shock Absorber Front Left",
    slug: "shock-absorber-front-546513s500",
    articleNumber: "54651-3S500",
    price: 156.00,
    images: [
      { id: 4, url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop", alt: "Shock Absorber" },
    ],
    description: "OEM replacement shock absorber for smooth ride quality. Gas-charged for consistent performance.",
    inStock: false,
    stockQuantity: 0,
    category: mockCategories[2],
  },
  {
    id: 5,
    name: "Spark Plug Set (4pcs)",
    slug: "spark-plug-set-1884611070",
    articleNumber: "18846-11070",
    price: 45.99,
    images: [
      { id: 5, url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", alt: "Spark Plugs" },
    ],
    description: "Iridium spark plugs for improved ignition, fuel efficiency, and longer service life. Set of 4.",
    inStock: true,
    stockQuantity: 35,
    category: mockCategories[0],
  },
  {
    id: 6,
    name: "Timing Belt Kit",
    slug: "timing-belt-kit-243122g400",
    articleNumber: "24312-2G400",
    price: 189.99,
    images: [
      { id: 6, url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=400&fit=crop", alt: "Timing Belt Kit" },
    ],
    description: "Complete timing belt kit including belt, tensioner, and idler pulleys. OEM specification.",
    inStock: true,
    stockQuantity: 15,
    category: mockCategories[0],
  },
  {
    id: 7,
    name: "Radiator Assembly",
    slug: "radiator-assembly-253103s050",
    articleNumber: "25310-3S050",
    price: 275.00,
    images: [
      { id: 7, url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=400&fit=crop", alt: "Radiator" },
    ],
    description: "Aluminum core radiator for efficient cooling. Direct OEM replacement with perfect fit.",
    inStock: true,
    stockQuantity: 8,
    category: mockCategories[6],
  },
  {
    id: 8,
    name: "Alternator 110A",
    slug: "alternator-373002g150",
    articleNumber: "37300-2G150",
    price: 320.00,
    images: [
      { id: 8, url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop", alt: "Alternator" },
    ],
    description: "Remanufactured alternator with 110 amp output. Includes regulator and pulley.",
    inStock: false,
    stockQuantity: 0,
    category: mockCategories[4],
  },
];

export const mockVehicle: Vehicle = {
  id: 1,
  brand: mockBrands[0],
  model: mockModels[0],
  year: 2021,
  engine: "2.5L GDI",
};

// Simulated API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export async function getMockBrands(): Promise<Brand[]> {
  await delay(300);
  return mockBrands;
}

export async function getMockModels(brandId: number): Promise<Model[]> {
  await delay(200);
  return mockModels.filter(m => m.brand.id === brandId);
}

export async function getMockYears(): Promise<number[]> {
  await delay(200);
  return mockYears;
}

export async function getMockEngines(): Promise<string[]> {
  await delay(200);
  return mockEngines;
}

export async function getMockCategories(): Promise<Category[]> {
  await delay(200);
  return mockCategories;
}

export async function getMockParts(
  filters?: { categoryId?: number; inStockOnly?: boolean; minPrice?: number; maxPrice?: number },
  sort?: string
): Promise<{ parts: Part[]; total: number }> {
  await delay(400);
  let filtered = [...mockParts];

  if (filters?.categoryId) {
    filtered = filtered.filter(p => p.category.id === filters.categoryId);
  }
  if (filters?.inStockOnly) {
    filtered = filtered.filter(p => p.inStock);
  }
  if (filters?.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice!);
  }

  if (sort === "price:asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price:desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return { parts: filtered, total: filtered.length };
}

export async function getMockPart(slug: string): Promise<Part | null> {
  await delay(300);
  return mockParts.find(p => p.slug === slug) || null;
}

export async function searchMockParts(query: string): Promise<Part[]> {
  await delay(300);
  const q = query.toLowerCase();
  return mockParts.filter(
    p => p.name.toLowerCase().includes(q) || p.articleNumber.toLowerCase().includes(q)
  );
}
