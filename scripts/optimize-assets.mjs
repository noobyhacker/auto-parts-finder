#!/usr/bin/env node
/**
 * One-off asset optimizer. Regenerates the multi-format image variants that are
 * committed to the repo and referenced via <picture> elements.
 *
 * Run this only when a *source* image changes (e.g. a new hero). Day-to-day
 * builds do NOT need it — vite-plugin-image-optimizer shrinks bundled images
 * automatically during `vite build`.
 *
 * Usage:
 *   1. Put the full-res source next to this note (see SOURCES below).
 *   2. node scripts/optimize-assets.mjs
 *
 * Requires: sharp (already a devDependency).
 */
import sharp from "sharp";
import { existsSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KB = (f) => (statSync(f).size / 1024).toFixed(1) + "KB";
const p = (...s) => resolve(root, ...s);

// Full-res sources. Keep these somewhere safe (not required at build time).
const HERO_SRC = p("src/assets/_sources/cars-hero.png"); // 1536x1024 original
const BIZREG_SRC = p("public/business-registration-source.png"); // 566x799 scan

async function run() {
  const done = [];

  if (existsSync(HERO_SRC)) {
    for (const w of [768, 1200]) {
      const base = p(`src/assets/cars-hero-${w}`);
      await sharp(HERO_SRC).resize(w).avif({ quality: 58 }).toFile(base + ".avif");
      await sharp(HERO_SRC).resize(w).webp({ quality: 72 }).toFile(base + ".webp");
      done.push(base + ".avif", base + ".webp");
    }
    const jpg = p("src/assets/cars-hero-1200.jpg");
    await sharp(HERO_SRC).resize(1200).jpeg({ quality: 72, mozjpeg: true }).toFile(jpg);
    done.push(jpg);
  } else {
    console.log("• hero source not found, skipping:", HERO_SRC);
  }

  // Logos (transparent → webp + palette png fallback)
  if (existsSync(p("src/assets/_sources/logo.png"))) {
    await sharp(p("src/assets/_sources/logo.png")).resize(300).webp({ quality: 82 }).toFile(p("src/assets/logo.webp"));
    await sharp(p("src/assets/_sources/logo.png")).resize(300).png({ compressionLevel: 9, palette: true }).toFile(p("src/assets/logo-300.png"));
    done.push(p("src/assets/logo.webp"), p("src/assets/logo-300.png"));
  }

  if (existsSync(BIZREG_SRC)) {
    await sharp(BIZREG_SRC).resize(566).avif({ quality: 55 }).toFile(p("public/business-registration.avif"));
    await sharp(BIZREG_SRC).resize(566).webp({ quality: 72 }).toFile(p("public/business-registration.webp"));
    await sharp(BIZREG_SRC).resize(566).jpeg({ quality: 72, mozjpeg: true }).toFile(p("public/business-registration.jpg"));
    done.push(p("public/business-registration.avif"), p("public/business-registration.webp"), p("public/business-registration.jpg"));
  }

  done.forEach((f) => console.log(KB(f).padStart(9), f.replace(root, ".")));
  if (!done.length) console.log("Nothing generated — add source files first (see SOURCES in this script).");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
