/**
 * Append Sanity Image CDN transform params so we serve right-sized WebP instead
 * of full-resolution originals. Non-Sanity URLs (placeholder.svg, bundled
 * assets) are returned untouched.
 *
 * https://www.sanity.io/docs/image-urls
 */
export function sanityImage(
  url: string,
  opts: { w?: number; h?: number; q?: number } = {}
): string {
  if (!url || !url.includes("cdn.sanity.io")) return url;
  const { w, h, q = 70 } = opts;
  const params = new URLSearchParams();
  if (w) params.set("w", String(w));
  if (h) params.set("h", String(h));
  params.set("q", String(q));
  params.set("fm", "webp");
  params.set("fit", "max"); // never upscale beyond the source
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}${params.toString()}`;
}
