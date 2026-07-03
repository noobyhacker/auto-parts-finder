import type { LoaderFunctionArgs } from "react-router-dom";
import { getPartForBuild, getCatalogFirstPage } from "@/lib/catalog-build";

// Route loaders live here (not in the page components) so they can be attached
// as STATIC route props while the page components stay lazily code-split. That
// bakes data into the pre-rendered HTML without React Router warning that a
// lazy-returned loader is being ignored. Both pull from the build-only catalog
// (tree-shaken out of the client via import.meta.env.SSR).

const PAGE_SIZE = 12;

export async function partLoader({ params }: LoaderFunctionArgs) {
  const part = await getPartForBuild(params.slug);
  return { part };
}

export async function catalogLoader() {
  return getCatalogFirstPage(PAGE_SIZE);
}
