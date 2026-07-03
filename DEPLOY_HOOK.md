# Auto-rebuild on Sanity changes (debounced)

The site is **statically pre-rendered** — all ~14k part pages, the catalog and
the search index are baked from Sanity at build time. A content change is only
reflected after a new build runs. Because a build pre-renders ~14k pages
(~5 min), we **debounce**: a burst of Sanity edits collapses into a single
rebuild instead of one build per change.

```
Sanity edit ──▶ Sanity webhook ──▶ GitHub repository_dispatch
                                        │
                                        ▼
                        GitHub Action waits for a 5-min quiet window
                        (each new edit restarts the wait — debounce)
                                        │
                                        ▼
                          Vercel Deploy Hook ──▶ one rebuild (~5 min)
```

Net effect: after your last edit, the site goes live in ~5–10 min. A bulk
import of 500 parts = **one** build, not 500.

The workflow is already in the repo: [.github/workflows/sanity-debounced-deploy.yml](.github/workflows/sanity-debounced-deploy.yml).
You need to wire up three things once.

---

## Step 1 — Vercel Deploy Hook

Vercel → project → **Settings → Git → Deploy Hooks** → create one:
- Name: `sanity-content`, Branch: `main`
- Copy the URL (looks like `https://api.vercel.com/v1/integrations/deploy/prj_XXXX/YYYY`).

> There may already be a hook named `sanity-update` on the project — you can
> reuse its URL instead of making a new one.

## Step 2 — GitHub repo secret + dispatch token

1. In the repo Vercel builds from, add a secret:
   **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: the Deploy Hook URL from Step 1
2. Create a token Sanity will use to ping GitHub:
   **GitHub → Settings → Developer settings → Fine-grained tokens → Generate**
   - Repository access: only this repo
   - Permissions: **Contents → Read and write** (needed for `repository_dispatch`)
   - Copy the token.

## Step 3 — Point the Sanity webhook at GitHub

https://www.sanity.io/manage → project → **API → Webhooks**. Edit the existing
webhook (or create one):
- **URL:** `https://api.github.com/repos/<OWNER>/<REPO>/dispatches`
  (e.g. `https://api.github.com/repos/Amurkor/auto-parts-finder-production/dispatches`)
- **Method:** `POST`
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type in ["part","category","brand","model","vehicle","videoReview"]`
- **HTTP Headers:**
  - `Authorization: Bearer <the token from Step 2>`
  - `Accept: application/vnd.github+json`
- **Projection / body:**
  ```
  {"event_type": "sanity-change"}
  ```

## Step 4 — Verify

1. Edit any part in Sanity and publish.
2. GitHub → **Actions** → you'll see "Debounced Vercel rebuild" start and sit in
   the 5-min wait. Make another edit within 5 min → the run cancels and a fresh
   one starts (that's the debounce working).
3. ~5 min after your last edit, the wait finishes and a Vercel build starts.
   When it's done the change is live.

**Need it live immediately?** GitHub → Actions → "Debounced Vercel rebuild" →
**Run workflow** (skips the wait). Or POST the deploy hook directly:
```bash
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_XXXX/YYYY"
```

---

## Tuning & notes

- **Quiet window:** change `sleep 300` in the workflow (e.g. `600` for 10 min)
  if your bursts have long gaps between edits.
- **Direct fallback:** if you'd rather skip the debounce, point the Sanity
  webhook straight at the Vercel Deploy Hook URL — every change then rebuilds
  immediately (simpler, but no burst-coalescing).
- **Required Vercel env vars** (Settings → Environment Variables), used by the
  build's `prebuild` step that pulls Sanity content:
  - `VITE_SANITY_PROJECT_ID`
  - `VITE_SANITY_DATASET` (defaults to `production`)
- **New parts and the lag:** a brand-new part's URL isn't pre-rendered until the
  rebuild finishes. In that window it still works — the page falls back to
  fetching that single part from the Sanity CDN — so visitors never hit a hard
  404 for a real part.
