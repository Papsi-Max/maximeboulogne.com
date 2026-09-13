# Work page — AI skill search

Status: approved for planning
Date: 2026-09-13

## Context

The `/work` page ([src/app/work/page.tsx](../../../src/app/work/page.tsx)) lists
six case studies as cards ([WorkCard.tsx](../../../src/components/WorkCard.tsx)),
each already showing skill tags (see the prior "show skill tags on work cards"
change). The Figma design
(node `4738:29`, https://www.figma.com/design/3UJWtrOKbqGyaCTwClru5v/CV---WEBSITE?node-id=4738-29)
adds a filter bar above the grid: a row of skill pills and a free-text "Or any
other skill" input.

Rather than a plain tag filter, the free-text input should surface cards by
*meaning*, not just literal tag matches — e.g. typing "AB/Test" should surface
`rag-edito`, whose content discusses user testing and SUS scores, even though
"AB/Test" appears nowhere in its tags or copy.

## Goals

- A free-text search box that ranks/filters the 6 work cards by semantic
  relevance to what the user typed, computed by a small local embedding
  model — no external API calls, no per-query cost.
- A row of pill shortcuts above the search box, populated from the most
  frequently searched terms over time (seeded with 5 Figma labels until
  enough history exists). Clicking one fills the box and runs the same
  search.
- The AI model and its vector store are **installed and run independently of
  this repo**, on the same server, so redeploying the site never reinstalls
  or reindexes the model, and the model/service survive `git clean -fd`.

## Non-goals

- No user accounts, no cross-device search history.
- No admin UI for the pills/analytics — the top-5 file is just read on each
  page load.
- No fuzzy/typo correction beyond what the embedding model naturally gives.

## Architecture

Two independently deployed pieces:

### 1. This repo (the site)

- `GET /api/work-search?q=...` (Next.js route handler): validates/trims the
  incoming query (2–200 chars), forwards it to the AI sidecar over
  `http://127.0.0.1:<port>/search` with the shared internal token, applies a
  short per-IP rate limit (in-memory, e.g. 20 req/min), and returns
  `{ slugs: string[] }` — already filtered to whatever the sidecar judged
  relevant. On any sidecar error/timeout (default 3s), the route returns
  `{ slugs: null, unavailable: true }` rather than a 5xx, so the client can
  fall back to showing everything.
- On each **valid, distinct** search actually forwarded to the sidecar (i.e.
  post-debounce, post-validation), the route also increments a counter for
  the normalized (lowercased, trimmed) query text in a small JSON file kept
  **outside of git** at the repo root: `.data/work-search-analytics.json`
  (added to `.gitignore`; survives deploys because `git clean -fd` — no `-x`
  — leaves ignored files alone). `GET /api/work-search` (no query) returns
  the current top-5 pills: the 5 most-frequent recorded terms, topped up
  with the 5 Figma labels (in their Figma order) when fewer than 5 distinct
  terms have been recorded yet. The same route handles both cases: `q`
  present → search behavior above; `q` absent → `{ pills: string[] }`.
- `scripts/reindex-work-search.mjs`: run as an explicit step at the end of
  the GitHub Actions deploy job (after `pm2 restart portfolio`). Walks
  `src/data/work.ts` + `src/data/work-content/*.ts` for each work item,
  extracts plain text (title + description + tags + all leaf `text`/`items`
  strings from the content blocks — images/dividers ignored), computes a
  content hash per item, and `POST`s `{ items: [{ slug, hash, text }] }` to
  the sidecar's `/reindex` endpoint with the shared token. Fails soft: if
  the sidecar is unreachable, the deploy step logs a warning and continues
  (the site still works with a stale index, degrading to the previous
  behavior at worst).
- Client (`page.tsx`, already `"use client"`): a new `WorkSearchBar`
  component renders the pills + input. Typing debounces 500 ms (no call
  below 2 characters) before calling `/api/work-search?q=...`; a pill click
  fills the input and searches immediately, bypassing the debounce delay.
  While a search is in flight, the grid renders skeleton cards in place of
  the real ones (same grid shape, pulsing placeholders matching `WorkCard`'s
  dimensions). When results come back, only matching slugs render; clearing
  the input (or a failed/unavailable search) shows every card again with a
  small inline "search unavailable, showing everything" note on failure.

### 2. AI sidecar (new, separate project — not in this git repo)

Lives in its own directory on the server (e.g.
`/home/deploy/apps/work-search-ai/`), own `package.json`, own pm2 process
(`work-search-ai`), own git history if any (out of scope here — delivered as
a local folder alongside this repo for the user to copy up and install by
hand, since this session has no way to install/start long-running services
on the box beyond what's already there). Its lifecycle is completely
decoupled from the site's deploys.

- Dependency: `@xenova/transformers`, model `Xenova/all-MiniLM-L6-v2`
  (quantized, ~25 MB), downloaded once from Hugging Face on first startup
  and cached on disk under the sidecar's own directory; no further network
  calls afterward. (Server has confirmed outbound access.)
- Listens on `127.0.0.1:<port>` only (never `0.0.0.0` — confirmed not
  reachable through nginx, which only proxies the existing subdomains).
  Every request must carry a `X-Internal-Token` header matching an env var
  set on the server (`.env`, not committed); requests without it get `401`.
- `POST /search { query }` → embeds the query, computes cosine similarity
  against the in-memory vectors for all indexed items, returns
  `{ results: [{ slug, score }] }` sorted descending, keeping only items
  above a relevance threshold (a fixed cosine cutoff, tuned by hand once
  real queries are tried — starting point 0.35, adjustable via env var
  without a code change).
- `POST /reindex { items }` → for each item, compares the given `hash`
  against its stored entry; recomputes and re-embeds only what changed,
  writes the updated store to its own JSON file on disk
  (`store.json`, inside the sidecar's directory — never touched by the
  site's deploy). Items no longer present in the payload are pruned from
  the store.
- Model is loaded into memory lazily on first `/search` or `/reindex` call
  after a (re)start (~1–2s one-time cost), then stays warm for the process's
  lifetime.

## Data flow

```
user types → debounce 500ms → GET /api/work-search?q=...
  → (rate limit check) → fetch http://127.0.0.1:<port>/search (token)
    → sidecar embeds query, cosine-sim vs cached vectors, thresholds, ranks
  → Next route logs the query term (analytics file), returns { slugs }
→ client hides non-matching cards, clears skeleton

deploy finishes → scripts/reindex-work-search.mjs
  → hashes each work item's text → POST /reindex (token)
    → sidecar recomputes only changed embeddings, persists store.json
```

## Error handling

- Sidecar down/timeout (3s) → site shows all cards + inline notice, never a
  broken page. No retries beyond the one request per debounce tick.
- Reindex step failing at deploy time → deploy still succeeds (warning
  logged); site keeps using whatever the sidecar already has (possibly
  stale, never absent — a first-ever reindex is required once by hand
  during initial setup).
- Malformed/missing token on either endpoint → sidecar responds 401, site
  route treats that the same as "unavailable".

## Testing

- Site repo: unit tests for the work-content plain-text extraction, for the
  content-hash function, and for `/api/work-search`'s proxy + fallback
  behavior (sidecar mocked: success, timeout, 401).
- Sidecar: unit tests for cosine-similarity ranking against fixed fake
  vectors, and for the reindex diffing logic (hash match → skip, hash
  differs/missing → recompute, item removed → pruned) with a stubbed
  embedder (no real model load in tests).
- Manual: a handful of real queries tried in the browser once both pieces
  are deployed (including the "AB/Test" → `rag-edito` case that motivated
  this), to sanity-check the relevance threshold.

## Deployment notes (manual, one-time)

1. Copy the `work-search-ai/` folder to the server, `npm install`, set
   `.env` (`PORT`, `INTERNAL_TOKEN`), `pm2 start ... --name work-search-ai`,
   `pm2 save`.
2. Add the matching `.env` to the site
   (`WORK_SEARCH_URL=http://127.0.0.1:<port>`, `WORK_SEARCH_TOKEN=...`).
3. Run `scripts/reindex-work-search.mjs` once by hand to seed the store
   before the first real search.
4. Add the same reindex step to
   [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml).
