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
const OUTPUT_DIR = resolve(__dirname, "../public/data");

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

  // Write output
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const data = {
    brands,
    modelsByBrand,
    categories,
    vehiclesByModel,
    parts,
    videoReviews,
    generatedAt: new Date().toISOString(),
  };

  writeFileSync(resolve(OUTPUT_DIR, "catalog.json"), JSON.stringify(data));

  console.log(`✅ Static data generated:`);
  console.log(`   Brands: ${brands.length}`);
  console.log(`   Models: ${allModels.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Vehicles: ${allVehicles.length}`);
  console.log(`   Parts: ${parts.length}`);
  console.log(`   Video Reviews: ${videoReviews.length}`);
  console.log(`   Output: ${OUTPUT_DIR}/catalog.json`);
}

fetchAll().catch((err) => {
  console.error("❌ Failed to fetch data:", err);
  process.exit(1);
});
