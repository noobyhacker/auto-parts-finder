#!/usr/bin/env node
/**
 * Pre-build script: Fetches all data from Sanity CMS and writes static JSON files.
 * Run before `vite build` to eliminate runtime API calls.
 * 
 * Usage: node scripts/fetch-sanity-data.mjs
 * Requires: VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET env vars
 */

import { createClient } from "@sanity/client";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Full catalog: build-only, NOT served to browsers (read by SSG loaders/getStaticPaths).
const BUILD_DATA_DIR = resolve(__dirname, "../.data");
// Lite index: the small file the browser actually downloads (search + catalog + videos).
const PUBLIC_DIR = resolve(__dirname, "../public");

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || "production";

if (!projectId) {
  console.error("❌ VITE_SANITY_PROJECT_ID is required");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false, // Always fetch fresh data at build time
});

function imageUrl(image) {
  if (!image?.asset?._ref) return "/placeholder.svg";
  const [, id, dimensions, format] = image.asset._ref.split("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
}

async function fetchAll() {
  console.log("🔄 Fetching data from Sanity...");

  // Fetch all data in parallel
  const [brands, allModels, categories, allVehicles, allParts, videoReviews] = await Promise.all([
    client.fetch(`*[_type == "brand"] | order(name asc) { "id": _id, name, "slug": slug.current }`),
    client.fetch(`*[_type == "model"] | order(name asc) { "id": _id, name, "slug": slug.current, "brandId": brand._ref }`),
    client.fetch(`*[_type == "category"] | order(name asc) { "id": _id, name, "slug": slug.current, icon }`),
    client.fetch(`*[_type == "vehicle"] {
      "id": _id,
      "yearFrom": yearFrom,
      "engines": engines,
      "brandId": brand._ref,
      "modelId": model._ref,
      "brand": brand->{ "id": _id, name, "slug": slug.current },
      "model": model->{ "id": _id, name, "slug": slug.current }
    }`),
    client.fetch(`*[_type == "part"] | order(_createdAt desc) {
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
        "yearFrom": yearFrom,
        "engines": engines,
        "brand": brand->{ "id": _id, name, "slug": slug.current },
        "model": model->{ "id": _id, name, "slug": slug.current },
        "brandId": brand._ref,
        "modelId": model._ref
      }
    }`),
    client.fetch(`*[_type == "videoReview"] | order(order asc, _createdAt desc) {
      "id": _id,
      title,
      youtubeUrl,
      description,
      order
    }`),
  ]);

  // Process parts images
  const parts = allParts.map((p) => ({
    ...p,
    images: p.images?.length ? p.images : ["/placeholder.svg"],
  }));

  // Build models-by-brand index
  const modelsByBrand = {};
  for (const model of allModels) {
    if (!modelsByBrand[model.brandId]) modelsByBrand[model.brandId] = [];
    modelsByBrand[model.brandId].push(model);
  }

  // Build vehicles index for years/engines lookups
  const vehiclesByModel = {};
  for (const v of allVehicles) {
    if (!vehiclesByModel[v.modelId]) vehiclesByModel[v.modelId] = [];
    vehiclesByModel[v.modelId].push(v);
  }

  // Full catalog — everything, for build-time pre-rendering only.
  const fullData = {
    brands,
    modelsByBrand,
    categories,
    vehiclesByModel,
    parts,
    videoReviews,
    generatedAt: new Date().toISOString(),
  };

  // Lite index — only the fields the browser renders (part cards + search +
  // video carousel). Drops descriptions, images and compatibleVehicles, which
  // are the heavy bulk of the catalog; those live only in pre-rendered pages.
  const liteParts = parts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    articleNumber: p.articleNumber ?? null,
    oemNumber: p.oemNumber ?? null,
    price: p.price ?? null,
    inStock: !!p.inStock,
    category: p.category
      ? { id: p.category.id, name: p.category.name, slug: p.category.slug }
      : null,
  }));

  const liteData = {
    parts: liteParts,
    videoReviews,
    generatedAt: fullData.generatedAt,
  };

  if (!existsSync(BUILD_DATA_DIR)) mkdirSync(BUILD_DATA_DIR, { recursive: true });
  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });

  writeFileSync(resolve(BUILD_DATA_DIR, "catalog.json"), JSON.stringify(fullData));
  writeFileSync(resolve(PUBLIC_DIR, "catalog-lite.json"), JSON.stringify(liteData));

  const liteKb = (Buffer.byteLength(JSON.stringify(liteData)) / 1024).toFixed(1);
  console.log(`✅ Static data generated:`);
  console.log(`   Parts: ${parts.length} (full) → ${liteParts.length} (lite)`);
  console.log(`   Video Reviews: ${videoReviews.length}`);
  console.log(`   Full catalog (build-only): ${BUILD_DATA_DIR}/catalog.json`);
  console.log(`   Lite index (shipped):      ${PUBLIC_DIR}/catalog-lite.json (${liteKb} kB)`);
}

fetchAll().catch((err) => {
  console.error("❌ Failed to fetch data:", err);
  process.exit(1);
});
