#!/usr/bin/env node
/**
 * Post-build cleanup for the SSG output.
 *
 * vite-react-ssg preloads every asset in the entry module graph on every page,
 * including images — and stamps `crossorigin` on those <link rel="preload">
 * tags. Two problems on our throttled-network target:
 *   1. <img> requests don't use crossorigin, so the preload is discarded and
 *      the image is fetched twice.
 *   2. Pages preload images they never render (e.g. a part page preloading the
 *      homepage hero), wasting bandwidth.
 * The <img> tags load these images fine on their own, so we strip the image
 * preloads from every generated HTML file.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

// Matches <link ... rel="preload" ... as="image" ...> in any attribute order.
const IMAGE_PRELOAD = /<link\b(?=[^>]*\brel=["']preload["'])(?=[^>]*\bas=["']image["'])[^>]*>/gi;

let files = 0;
let removed = 0;
for (const file of walk(distDir)) {
  const html = readFileSync(file, "utf8");
  const matches = html.match(IMAGE_PRELOAD);
  if (!matches) continue;
  writeFileSync(file, html.replace(IMAGE_PRELOAD, ""));
  files += 1;
  removed += matches.length;
}

console.log(`postbuild: stripped ${removed} image preload link(s) from ${files} HTML file(s).`);
