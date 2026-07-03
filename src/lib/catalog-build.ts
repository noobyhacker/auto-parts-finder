/**
 * BUILD-TIME ONLY catalog access. Reads the full catalog.json that
 * scripts/fetch-sanity-data.mjs generates before the build.
 *
 * Every export guards on `import.meta.env.SSR`; Vite statically replaces that
 * with `false` in the client bundle, so the `node:fs` dynamic import below is
 * dead-code-eliminated and never shipped to browsers. These helpers power
 * react-router loaders + getStaticPaths so per-part and listing pages are
 * pre-rendered with real content baked into the HTML.
 */
import type { Part } from "@/types";

interface CatalogShape {
  parts: Part[];
  categories: { id: string; name: string; slug: string }[];
  [k: string]: unknown;
}

let cache: CatalogShape | null = null;

async function load(): Promise<CatalogShape | null> {
  if (!import.meta.env.SSR) return null;
  if (cache) return cache;
  const fs = await import("node:fs");
  const path = await import("node:path");
  const file = path.resolve(process.cwd(), "public/data/catalog.json");
  if (!fs.existsSync(file)) {
    console.warn("[catalog-build] public/data/catalog.json not found — pages will pre-render without data.");
    return null;
  }
  cache = JSON.parse(fs.readFileSync(file, "utf-8"));
  return cache;
}

/** All part paths for getStaticPaths, e.g. "part/brake-pad-123". */
export async function getPartStaticPaths(): Promise<string[]> {
  const data = await load();
  if (!data) return [];
  return data.parts
    .map((p) => p.slug)
    .filter(Boolean)
    .map((slug) => `part/${slug}`);
}

/** Single part for a PartDetail loader. */
export async function getPartForBuild(slug: string | undefined): Promise<Part | null> {
  const data = await load();
  if (!data || !slug) return null;
  return data.parts.find((p) => p.slug === slug || p.id === slug) ?? null;
}

/** First listing page for the Catalog loader. */
export async function getCatalogFirstPage(pageSize = 12): Promise<{ parts: Part[]; total: number }> {
  const data = await load();
  if (!data) return { parts: [], total: 0 };
  const sorted = [...data.parts].sort((a, b) => a.name.localeCompare(b.name));
  return { parts: sorted.slice(0, pageSize), total: sorted.length };
}
