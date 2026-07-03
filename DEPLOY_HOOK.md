# Auto-rebuild on Sanity content changes

The site is **statically pre-rendered at build time** — part pages, the catalog
listing and the search index are all baked from Sanity during the build. That
means a content change in Sanity is only reflected on the live site **after a
new build runs**. This doc wires Sanity to trigger that build automatically.

Flow: **edit a part in Sanity → Sanity webhook → Vercel Deploy Hook → Vercel
rebuild + redeploy** (typically live in ~1–3 minutes).

There is nothing to wire in the codebase — this is two dashboard settings. You
need to do this once (I can't reach either dashboard).

---

## Step 1 — Create the Vercel Deploy Hook

1. Vercel → your project → **Settings → Git → Deploy Hooks**.
2. Create a hook:
   - **Name:** `sanity-content`
   - **Branch:** `main` (or whatever branch production deploys from)
3. Copy the generated URL. It looks like:
   `https://api.vercel.com/v1/integrations/deploy/prj_XXXX/YYYY`
4. Treat this URL like a secret — anyone with it can trigger a build.

## Step 2 — Add the webhook in Sanity

1. https://www.sanity.io/manage → your project → **API → Webhooks → Create webhook**.
2. Settings:
   - **Name:** `Vercel rebuild`
   - **URL:** the Deploy Hook URL from Step 1
   - **Trigger on:** Create, Update, Delete
   - **Filter** (only rebuild when catalog content changes, not on every edit):
     ```
     _type in ["part", "category", "brand", "model", "vehicle", "videoReview"]
     ```
   - **HTTP method:** `POST`
   - **API version:** `v2021-03-25` (or latest)
   - Projection / secret: leave empty (the Deploy Hook needs no body).
3. Save.

## Step 3 — Verify

1. In Sanity, edit any part (e.g. tweak a price) and publish.
2. Vercel → **Deployments** should show a new build starting within a few seconds.
3. When it finishes (~1–3 min), the change is live. Confirm with:
   ```bash
   curl -s https://www.amurkor.com/part/<slug> | grep "<the changed text>"
   ```

---

## Notes & guardrails

- **Debounce:** publishing several parts in quick succession can queue multiple
  builds. Vercel coalesces/queues them; it's harmless but you can space out bulk
  edits to save build minutes.
- **Build data source:** the build runs `scripts/fetch-sanity-data.mjs`
  (via the `prebuild` npm hook) which pulls all content and writes:
  - `.data/catalog.json` — full catalog, build-only (used to pre-render pages)
  - `public/catalog-lite.json` — the small index shipped to browsers
  Both are git-ignored and regenerated on every build.
- **Required env vars** (Vercel → Settings → Environment Variables), same as today:
  - `VITE_SANITY_PROJECT_ID`
  - `VITE_SANITY_DATASET` (defaults to `production`)
- **Manual rebuild** without a content change:
  ```bash
  curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_XXXX/YYYY"
  ```
- **New parts and the 1–3 min lag:** a brand-new part's direct URL isn't
  pre-rendered until the rebuild finishes. In that window the page still works —
  it falls back to fetching that single part from the Sanity CDN — so visitors
  never see a hard 404 for a real part.
