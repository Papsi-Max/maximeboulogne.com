# Work Page AI Skill Search Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a semantic, AI-backed skill search to `/work`: a free-text box (with dynamic pill shortcuts) that filters the 6 case-study cards by meaning, computed by a small embedding model running in an independent sidecar service on the same server.

**Architecture:** Two separately-deployed pieces. (1) This repo gets a Next.js API route that proxies search requests to a local sidecar, records query popularity for the pills, and a client search bar + skeleton grid. (2) A brand-new, independent Node project (`work-search-ai/`, **not** part of this git repo, lives in a sibling folder) runs `@xenova/transformers` locally, exposes `/search` and `/reindex` on `127.0.0.1` only, and owns its own vector store on disk — untouched by the site's deploys.

**Tech Stack:** Next.js 16 (App Router) route handlers, React 19 client components, Tailwind v4 utility classes matching the existing design tokens, Node's built-in test runner (`node --test`, no new test dependency), `@xenova/transformers` (sidecar only), plain `node:http` (sidecar only, no framework).

**Spec:** [docs/superpowers/specs/2026-09-13-work-ai-search-design.md](../specs/2026-09-13-work-ai-search-design.md)

## Global Constraints

- Sidecar binds to `127.0.0.1` only — never `0.0.0.0`, never reachable through nginx.
- Every sidecar request requires a matching `X-Internal-Token` header; missing/wrong token → `401`.
- The site's `.data/work-search-analytics.json` is gitignored (survives `git clean -fd` on deploy, never committed).
- The sidecar's `store.json` lives inside the sidecar's own directory, never inside this repo.
- Debounce is 500ms client-side; no search request below 2 characters.
- Sidecar request timeout is 3s from the site; on any failure the site shows every card plus an inline notice — never a broken page.
- Relevance threshold (cosine similarity cutoff) defaults to 0.35, overridable via the sidecar's `RELEVANCE_THRESHOLD` env var without a code change.
- New site-side test files use Node's built-in test runner: `node --experimental-strip-types --test` (works on Node ≥22.6; the flag is accepted through Node 24). No `@/` path aliases inside files executed directly by `node` (only Next-bundled files may use them) — use relative imports there.
- Pills: top-5 most-frequent recorded search terms, topped up with the 5 Figma labels (`AI UX`, `User Research`, `Design Leadership`, `Accessibility`, `Mentoring`, in that order) when fewer than 5 distinct terms exist.

---

## Part A — AI sidecar (new, independent project)

Create this project at `Z:\Divers\Media\Documents\localdev\maximeboulogne.com\work-search-ai\` — a sibling of the site's repo folder, **not** inside `Z:\Divers\Media\Documents\localdev\maximeboulogne.com\site`, and not tracked by the site's git repo.

### Task 1: Scaffold the sidecar project + cosine similarity

**Files:**
- Create: `work-search-ai/package.json`
- Create: `work-search-ai/.gitignore`
- Create: `work-search-ai/.env.example`
- Create: `work-search-ai/README.md`
- Create: `work-search-ai/src/cosine.mjs`
- Test: `work-search-ai/src/cosine.test.mjs`

**Interfaces:**
- Produces: `cosineSimilarity(a: number[], b: number[]): number` — used by Task 4's `server.mjs`.

- [ ] **Step 1: Create the project scaffold**

`work-search-ai/package.json`:

```json
{
  "name": "work-search-ai",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.mjs",
    "test": "node --test"
  },
  "dependencies": {
    "@xenova/transformers": "^2.17.2"
  }
}
```

`work-search-ai/.gitignore`:

```
node_modules/
store.json
.env
```

`work-search-ai/.env.example`:

```
PORT=4000
INTERNAL_TOKEN=replace-with-a-long-random-secret
RELEVANCE_THRESHOLD=0.35
```

`work-search-ai/README.md`:

```markdown
# work-search-ai

Independent local semantic-search sidecar for maximeboulogne.com's `/work`
page. Not part of the site's git repo or deploy pipeline — install and
restart it separately.

## Install (one-time, on the server)

```bash
cd work-search-ai
npm install
cp .env.example .env
# edit .env: set INTERNAL_TOKEN to a long random secret, share the same
# value with the site as WORK_SEARCH_TOKEN
pm2 start server.mjs --name work-search-ai
pm2 save
```

The first `/search` or `/reindex` request after a (re)start downloads the
~25MB `Xenova/all-MiniLM-L6-v2` model from Hugging Face once, then caches it
on disk — no further network calls after that.

## Reindexing

The site's `scripts/reindex-work-search.ts` calls `POST /reindex` at the end
of every deploy. To seed the store for the first time, run that script by
hand from the site's repo once this service is up:

```bash
cd ../site
node --experimental-strip-types --env-file=.env scripts/reindex-work-search.ts
```

## Endpoints

Both require header `X-Internal-Token: <INTERNAL_TOKEN>`.

- `POST /search { query: string }` → `{ results: [{ slug, score }] }`
- `POST /reindex { items: [{ slug, hash, text }] }` → `{ updated, pruned, kept }`
```

- [ ] **Step 2: Write the failing test for cosine similarity**

`work-search-ai/src/cosine.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { cosineSimilarity } from "./cosine.mjs";

test("identical vectors score 1", () => {
  assert.equal(cosineSimilarity([1, 0, 0], [1, 0, 0]), 1);
});

test("orthogonal vectors score 0", () => {
  assert.equal(cosineSimilarity([1, 0], [0, 1]), 0);
});

test("opposite vectors score -1", () => {
  assert.equal(cosineSimilarity([1, 0], [-1, 0]), -1);
});

test("a zero vector scores 0 rather than NaN", () => {
  assert.equal(cosineSimilarity([0, 0], [1, 1]), 0);
});

test("throws on mismatched lengths", () => {
  assert.throws(() => cosineSimilarity([1, 2], [1, 2, 3]));
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run (from `work-search-ai/`): `node --test`
Expected: FAIL — `cosine.mjs` does not exist yet.

- [ ] **Step 4: Implement cosine similarity**

`work-search-ai/src/cosine.mjs`:

```js
export function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error("Vector length mismatch");
  }
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `node --test`
Expected: PASS — 5 tests passing.

- [ ] **Step 6: Commit**

```bash
cd work-search-ai
git init
git add -A
git commit -m "chore: scaffold work-search-ai with cosine similarity"
```

---

### Task 2: Vector store diff/apply logic

**Files:**
- Create: `work-search-ai/src/store.mjs`
- Test: `work-search-ai/src/store.test.mjs`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `diffItems(existingStore, items)`, `applyEmbeddings(toKeep, embeddedEntries)`, `loadStore(filePath)`, `saveStore(filePath, store)` — all used by Task 4's `server.mjs`.
  - `existingStore` / return shape: `Record<slug, { hash: string, vector: number[] }>`
  - `items`: `{ slug: string, hash: string, text: string }[]`
  - `diffItems` returns `{ toEmbed: items[], toKeep: Record<slug, entry>, toPruneSlugs: string[] }`
  - `embeddedEntries`: `{ slug: string, hash: string, vector: number[] }[]`

- [ ] **Step 1: Write the failing tests**

`work-search-ai/src/store.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { diffItems, applyEmbeddings } from "./store.mjs";

test("a new slug with no existing entry needs embedding", () => {
  const { toEmbed, toKeep, toPruneSlugs } = diffItems(
    {},
    [{ slug: "a", hash: "h1", text: "hello" }],
  );
  assert.deepEqual(toEmbed, [{ slug: "a", hash: "h1", text: "hello" }]);
  assert.deepEqual(toKeep, {});
  assert.deepEqual(toPruneSlugs, []);
});

test("an unchanged hash is kept, not re-embedded", () => {
  const existing = { a: { hash: "h1", vector: [1, 2] } };
  const { toEmbed, toKeep } = diffItems(existing, [
    { slug: "a", hash: "h1", text: "hello" },
  ]);
  assert.deepEqual(toEmbed, []);
  assert.deepEqual(toKeep, { a: { hash: "h1", vector: [1, 2] } });
});

test("a changed hash is re-embedded and dropped from toKeep", () => {
  const existing = { a: { hash: "h1", vector: [1, 2] } };
  const { toEmbed, toKeep } = diffItems(existing, [
    { slug: "a", hash: "h2", text: "hello again" },
  ]);
  assert.deepEqual(toEmbed, [{ slug: "a", hash: "h2", text: "hello again" }]);
  assert.deepEqual(toKeep, {});
});

test("a slug missing from the incoming items is pruned", () => {
  const existing = { a: { hash: "h1", vector: [1, 2] }, b: { hash: "h1", vector: [3, 4] } };
  const { toPruneSlugs } = diffItems(existing, [{ slug: "a", hash: "h1", text: "hello" }]);
  assert.deepEqual(toPruneSlugs, ["b"]);
});

test("applyEmbeddings merges kept entries with freshly embedded ones", () => {
  const toKeep = { a: { hash: "h1", vector: [1, 2] } };
  const embeddedEntries = [{ slug: "b", hash: "h2", vector: [3, 4] }];
  assert.deepEqual(applyEmbeddings(toKeep, embeddedEntries), {
    a: { hash: "h1", vector: [1, 2] },
    b: { hash: "h2", vector: [3, 4] },
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test`
Expected: FAIL — `store.mjs` does not exist.

- [ ] **Step 3: Implement the store module**

`work-search-ai/src/store.mjs`:

```js
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export function diffItems(existingStore, items) {
  const incomingSlugs = new Set(items.map((item) => item.slug));
  const toEmbed = items.filter((item) => {
    const existing = existingStore[item.slug];
    return !existing || existing.hash !== item.hash;
  });
  const embedSlugs = new Set(toEmbed.map((item) => item.slug));

  const toKeep = {};
  for (const slug of Object.keys(existingStore)) {
    if (incomingSlugs.has(slug) && !embedSlugs.has(slug)) {
      toKeep[slug] = existingStore[slug];
    }
  }

  const toPruneSlugs = Object.keys(existingStore).filter(
    (slug) => !incomingSlugs.has(slug),
  );

  return { toEmbed, toKeep, toPruneSlugs };
}

export function applyEmbeddings(toKeep, embeddedEntries) {
  const next = { ...toKeep };
  for (const entry of embeddedEntries) {
    next[entry.slug] = { hash: entry.hash, vector: entry.vector };
  }
  return next;
}

export async function loadStore(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

export async function saveStore(filePath, store) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test`
Expected: PASS — 10 tests passing (5 from Task 1 + 5 new).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add reindex diff/apply store logic"
```

---

### Task 3: Auth check + embedder wrapper

**Files:**
- Create: `work-search-ai/src/auth.mjs`
- Create: `work-search-ai/src/embedder.mjs`
- Test: `work-search-ai/src/auth.test.mjs`

**Interfaces:**
- Produces: `isAuthorized(headers: Record<string, string | string[] | undefined>, token: string): boolean` and `embed(text: string): Promise<number[]>` — both used by Task 4's `server.mjs`.
- `embedder.mjs` is not unit tested here (it loads a real ML model) — verified manually in Task 4.

- [ ] **Step 1: Write the failing auth test**

`work-search-ai/src/auth.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { isAuthorized } from "./auth.mjs";

test("accepts a matching token", () => {
  assert.equal(isAuthorized({ "x-internal-token": "secret" }, "secret"), true);
});

test("rejects a missing token", () => {
  assert.equal(isAuthorized({}, "secret"), false);
});

test("rejects a wrong token", () => {
  assert.equal(isAuthorized({ "x-internal-token": "wrong" }, "secret"), false);
});

test("rejects an empty configured token", () => {
  assert.equal(isAuthorized({ "x-internal-token": "" }, "secret"), false);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test`
Expected: FAIL — `auth.mjs` does not exist.

- [ ] **Step 3: Implement auth and the embedder wrapper**

`work-search-ai/src/auth.mjs`:

```js
export function isAuthorized(headers, token) {
  const provided = headers["x-internal-token"];
  return typeof provided === "string" && provided.length > 0 && provided === token;
}
```

`work-search-ai/src/embedder.mjs`:

```js
import { pipeline } from "@xenova/transformers";

let embedderPromise = null;

function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedderPromise;
}

export async function embed(text) {
  const extractor = await getEmbedder();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test`
Expected: PASS — 14 tests passing (10 from Tasks 1-2 + 4 new).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add token auth check and local embedder wrapper"
```

---

### Task 4: HTTP server wiring `/search` and `/reindex`

**Files:**
- Create: `work-search-ai/server.mjs`

**Interfaces:**
- Consumes: `cosineSimilarity` (Task 1), `diffItems`/`applyEmbeddings`/`loadStore`/`saveStore` (Task 2), `isAuthorized`/`embed` (Task 3).
- Produces: the running HTTP server other tasks (site-side) talk to over `http://127.0.0.1:<PORT>`.

- [ ] **Step 1: Implement the server**

`work-search-ai/server.mjs`:

```js
import http from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { embed } from "./src/embedder.mjs";
import { cosineSimilarity } from "./src/cosine.mjs";
import { diffItems, applyEmbeddings, loadStore, saveStore } from "./src/store.mjs";
import { isAuthorized } from "./src/auth.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 4000);
const TOKEN = process.env.INTERNAL_TOKEN;
const THRESHOLD = Number(process.env.RELEVANCE_THRESHOLD ?? 0.35);
const STORE_PATH = process.env.STORE_PATH ?? join(__dirname, "store.json");

if (!TOKEN) {
  console.error("INTERNAL_TOKEN env var is required");
  process.exit(1);
}

let store = await loadStore(STORE_PATH);

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(json);
}

const server = http.createServer(async (req, res) => {
  try {
    if (!isAuthorized(req.headers, TOKEN)) {
      sendJson(res, 401, { error: "unauthorized" });
      return;
    }

    if (req.method === "POST" && req.url === "/search") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const query = typeof body.query === "string" ? body.query.trim() : "";
      if (!query) {
        sendJson(res, 400, { error: "query is required" });
        return;
      }
      const queryVector = await embed(query);
      const results = Object.entries(store)
        .map(([slug, entry]) => ({
          slug,
          score: cosineSimilarity(queryVector, entry.vector),
        }))
        .filter((result) => result.score >= THRESHOLD)
        .sort((a, b) => b.score - a.score);
      sendJson(res, 200, { results });
      return;
    }

    if (req.method === "POST" && req.url === "/reindex") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const items = Array.isArray(body.items) ? body.items : [];
      const { toEmbed, toKeep, toPruneSlugs } = diffItems(store, items);

      const embeddedEntries = [];
      for (const item of toEmbed) {
        const vector = await embed(item.text);
        embeddedEntries.push({ slug: item.slug, hash: item.hash, vector });
      }

      store = applyEmbeddings(toKeep, embeddedEntries);
      await saveStore(STORE_PATH, store);
      sendJson(res, 200, {
        updated: embeddedEntries.map((entry) => entry.slug),
        pruned: toPruneSlugs,
        kept: Object.keys(toKeep),
      });
      return;
    }

    sendJson(res, 404, { error: "not found" });
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "internal_error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`work-search-ai listening on 127.0.0.1:${PORT}`);
});
```

- [ ] **Step 2: Manually verify locally**

```bash
cd work-search-ai
npm install
cp .env.example .env
# edit .env, set INTERNAL_TOKEN=test-secret
npm start
```

In another terminal:

```bash
curl -s -X POST http://127.0.0.1:4000/reindex \
  -H "X-Internal-Token: test-secret" -H "Content-Type: application/json" \
  -d '{"items":[{"slug":"rag-edito","hash":"h1","text":"Ran user testing sessions, SUS score, generative AI editorial assistant"},{"slug":"atelier-june-murals-showcase","hash":"h2","text":"Brand identity and showcase website for a mural artist"}]}'
```

Expected: `{"updated":["rag-edito","atelier-june-murals-showcase"],"pruned":[],"kept":[]}` (first run downloads the model, takes a few seconds).

```bash
curl -s -X POST http://127.0.0.1:4000/search \
  -H "X-Internal-Token: test-secret" -H "Content-Type: application/json" \
  -d '{"query":"AB/Test"}'
```

Expected: `results` includes `rag-edito` with a score ≥ 0.35, ranked above `atelier-june-murals-showcase`.

```bash
curl -s -X POST http://127.0.0.1:4000/search \
  -H "X-Internal-Token: wrong" -H "Content-Type: application/json" -d '{"query":"anything"}'
```

Expected: `{"error":"unauthorized"}` with a `401`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: wire up /search and /reindex HTTP endpoints"
```

Part A is now feature-complete and independently verified. Part B (the site) can proceed once this service is reachable at some `http://127.0.0.1:<PORT>` for local development too — run it locally alongside `next dev` for Task 13's end-to-end check.

---

## Part B — Site integration (this repo)

### Task 5: Rate limiter

**Files:**
- Create: `src/lib/rate-limit.ts`
- Test: `src/lib/rate-limit.test.ts`

**Interfaces:**
- Produces: `createRateLimiter({ max, windowMs }): { allow(key: string, now?: number): boolean }` — used by Task 8's route handler.

- [ ] **Step 1: Write the failing tests**

`src/lib/rate-limit.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRateLimiter } from "./rate-limit.ts";

test("allows requests up to the max within the window", () => {
  const limiter = createRateLimiter({ max: 2, windowMs: 1000 });
  assert.equal(limiter.allow("a", 0), true);
  assert.equal(limiter.allow("a", 10), true);
});

test("blocks once the max is exceeded within the window", () => {
  const limiter = createRateLimiter({ max: 2, windowMs: 1000 });
  limiter.allow("a", 0);
  limiter.allow("a", 10);
  assert.equal(limiter.allow("a", 20), false);
});

test("allows again once the window has passed", () => {
  const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
  limiter.allow("a", 0);
  assert.equal(limiter.allow("a", 500), false);
  assert.equal(limiter.allow("a", 1500), true);
});

test("tracks separate keys independently", () => {
  const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
  assert.equal(limiter.allow("a", 0), true);
  assert.equal(limiter.allow("b", 0), true);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --experimental-strip-types --test src/lib/rate-limit.test.ts`
Expected: FAIL — `rate-limit.ts` does not exist.

- [ ] **Step 3: Implement the rate limiter**

`src/lib/rate-limit.ts`:

```ts
type RateLimiterOptions = {
  max: number;
  windowMs: number;
};

export function createRateLimiter({ max, windowMs }: RateLimiterOptions) {
  const hits = new Map<string, number[]>();

  return {
    allow(key: string, now: number = Date.now()): boolean {
      const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (timestamps.length >= max) {
        hits.set(key, timestamps);
        return false;
      }
      timestamps.push(now);
      hits.set(key, timestamps);
      return true;
    },
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --experimental-strip-types --test src/lib/rate-limit.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/rate-limit.ts src/lib/rate-limit.test.ts
git commit -m "feat: add in-memory rate limiter for work search"
```

---

### Task 6: Search analytics (pills source of truth)

**Files:**
- Create: `src/lib/work-search-analytics.ts`
- Test: `src/lib/work-search-analytics.test.ts`

**Interfaces:**
- Produces: `FIGMA_FALLBACK_PILLS: string[]`, `normalizeQuery(query: string): string`, `recordSearch(term: string, filePath?: string): Promise<void>`, `getPills(fallback?: string[], filePath?: string): Promise<string[]>` — used by Task 8's route handler.

- [ ] **Step 1: Write the failing tests**

`src/lib/work-search-analytics.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  FIGMA_FALLBACK_PILLS,
  normalizeQuery,
  recordSearch,
  getPills,
} from "./work-search-analytics.ts";

async function withTempFile(fn: (filePath: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), "work-search-analytics-"));
  const filePath = join(dir, "analytics.json");
  try {
    await fn(filePath);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test("normalizeQuery trims, lowercases, and collapses whitespace", () => {
  assert.equal(normalizeQuery("  AI   UX  "), "ai ux");
});

test("getPills falls back to the Figma labels when there is no history", async () => {
  await withTempFile(async (filePath) => {
    const pills = await getPills(FIGMA_FALLBACK_PILLS, filePath);
    assert.deepEqual(pills, FIGMA_FALLBACK_PILLS);
  });
});

test("recordSearch increments a term's count and getPills ranks by frequency", async () => {
  await withTempFile(async (filePath) => {
    await recordSearch("Accessibility", filePath);
    await recordSearch("Accessibility", filePath);
    await recordSearch("AB test", filePath);
    const pills = await getPills(FIGMA_FALLBACK_PILLS, filePath);
    assert.equal(pills[0], "Accessibility");
    assert.equal(pills[1], "AB test");
  });
});

test("getPills tops up with fallback labels not already present, capped at 5", async () => {
  await withTempFile(async (filePath) => {
    await recordSearch("AB test", filePath);
    const pills = await getPills(FIGMA_FALLBACK_PILLS, filePath);
    assert.equal(pills.length, 5);
    assert.equal(pills[0], "AB test");
    assert.deepEqual(pills.slice(1), FIGMA_FALLBACK_PILLS.slice(0, 4));
  });
});

test("recordSearch ignores an empty/whitespace-only term", async () => {
  await withTempFile(async (filePath) => {
    await recordSearch("   ", filePath);
    const pills = await getPills(FIGMA_FALLBACK_PILLS, filePath);
    assert.deepEqual(pills, FIGMA_FALLBACK_PILLS);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --experimental-strip-types --test src/lib/work-search-analytics.test.ts`
Expected: FAIL — `work-search-analytics.ts` does not exist.

- [ ] **Step 3: Implement the analytics module**

`src/lib/work-search-analytics.ts`:

```ts
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const FIGMA_FALLBACK_PILLS = [
  "AI UX",
  "User Research",
  "Design Leadership",
  "Accessibility",
  "Mentoring",
];

const DEFAULT_ANALYTICS_PATH = path.join(
  process.cwd(),
  ".data",
  "work-search-analytics.json",
);

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

type AnalyticsEntry = { term: string; count: number };
type AnalyticsStore = Record<string, AnalyticsEntry>;

async function readAnalytics(filePath: string): Promise<AnalyticsStore> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as AnalyticsStore;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
}

async function writeAnalytics(filePath: string, store: AnalyticsStore): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}

export async function recordSearch(
  term: string,
  filePath: string = DEFAULT_ANALYTICS_PATH,
): Promise<void> {
  const key = normalizeQuery(term);
  if (!key) return;
  const store = await readAnalytics(filePath);
  const existing = store[key];
  store[key] = { term: existing?.term ?? term.trim(), count: (existing?.count ?? 0) + 1 };
  await writeAnalytics(filePath, store);
}

export async function getPills(
  fallback: string[] = FIGMA_FALLBACK_PILLS,
  filePath: string = DEFAULT_ANALYTICS_PATH,
): Promise<string[]> {
  const store = await readAnalytics(filePath);
  const ranked = Object.values(store)
    .sort((a, b) => b.count - a.count)
    .map((entry) => entry.term);

  const seen = new Set(ranked.map(normalizeQuery));
  const pills = [...ranked];
  for (const term of fallback) {
    if (pills.length >= 5) break;
    if (!seen.has(normalizeQuery(term))) {
      pills.push(term);
      seen.add(normalizeQuery(term));
    }
  }
  return pills.slice(0, 5);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --experimental-strip-types --test src/lib/work-search-analytics.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Add the analytics file to `.gitignore`**

In [.gitignore](../../../.gitignore), add:

```
# work search analytics (runtime state, not source)
/.data/
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/work-search-analytics.ts src/lib/work-search-analytics.test.ts .gitignore
git commit -m "feat: track work search popularity for dynamic pills"
```

---

### Task 7: Sidecar HTTP client

**Files:**
- Create: `src/lib/work-search-sidecar.ts`
- Test: `src/lib/work-search-sidecar.test.ts`

**Interfaces:**
- Produces: `type SidecarSearchResult = { ok: true; slugs: string[] } | { ok: false }`, `searchSidecar(query: string): Promise<SidecarSearchResult>` — used by Task 8's route handler.
- Consumes env vars `WORK_SEARCH_URL`, `WORK_SEARCH_TOKEN` at call time (not module load time, so tests can set `process.env` per test).

- [ ] **Step 1: Write the failing tests**

`src/lib/work-search-sidecar.test.ts`:

```ts
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { searchSidecar } from "./work-search-sidecar.ts";

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

beforeEach(() => {
  process.env.WORK_SEARCH_URL = "http://127.0.0.1:4000";
  process.env.WORK_SEARCH_TOKEN = "test-token";
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv };
});

test("returns ok:true with slugs on a successful response", async () => {
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ results: [{ slug: "rag-edito", score: 0.9 }] }),
      { status: 200 },
    );
  const result = await searchSidecar("AB test");
  assert.deepEqual(result, { ok: true, slugs: ["rag-edito"] });
});

test("returns ok:false on a non-2xx response", async () => {
  globalThis.fetch = async () => new Response("{}", { status: 401 });
  const result = await searchSidecar("AB test");
  assert.deepEqual(result, { ok: false });
});

test("returns ok:false when fetch throws (network error/timeout)", async () => {
  globalThis.fetch = async () => {
    throw new Error("network down");
  };
  const result = await searchSidecar("AB test");
  assert.deepEqual(result, { ok: false });
});

test("returns ok:false when env vars are missing", async () => {
  delete process.env.WORK_SEARCH_URL;
  const result = await searchSidecar("AB test");
  assert.deepEqual(result, { ok: false });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --experimental-strip-types --test src/lib/work-search-sidecar.test.ts`
Expected: FAIL — `work-search-sidecar.ts` does not exist.

- [ ] **Step 3: Implement the sidecar client**

`src/lib/work-search-sidecar.ts`:

```ts
export type SidecarSearchResult = { ok: true; slugs: string[] } | { ok: false };

export async function searchSidecar(query: string): Promise<SidecarSearchResult> {
  const baseUrl = process.env.WORK_SEARCH_URL;
  const token = process.env.WORK_SEARCH_TOKEN;
  if (!baseUrl || !token) return { ok: false };

  try {
    const response = await fetch(`${baseUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return { ok: false };
    const data = (await response.json()) as {
      results: { slug: string; score: number }[];
    };
    return { ok: true, slugs: data.results.map((result) => result.slug) };
  } catch {
    return { ok: false };
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --experimental-strip-types --test src/lib/work-search-sidecar.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/lib/work-search-sidecar.ts src/lib/work-search-sidecar.test.ts
git commit -m "feat: add sidecar search HTTP client with timeout+fallback"
```

---

### Task 8: `GET /api/work-search` route handler

**Files:**
- Create: `src/app/api/work-search/route.ts`
- Test: `src/app/api/work-search/route.test.ts`

**Interfaces:**
- Consumes: `createRateLimiter` (Task 5), `getPills`/`recordSearch`/`FIGMA_FALLBACK_PILLS` (Task 6), `searchSidecar` (Task 7).
- Produces: the `GET` handler the client (`WorkSearchBar`, Task 12) calls at `/api/work-search` and `/api/work-search?q=...`. Response shapes: `{ pills: string[] }` (no `q`), `{ slugs: string[] }` (success), `{ slugs: null, unavailable: true }` (sidecar down), `{ error: string }` with 4xx (invalid query / rate limited).

- [ ] **Step 1: Write the failing tests**

`src/app/api/work-search/route.test.ts`:

```ts
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { GET } from "./route.ts";

const originalFetch = globalThis.fetch;
const originalCwd = process.cwd();
let tempDir: string;

beforeEach(async () => {
  process.env.WORK_SEARCH_URL = "http://127.0.0.1:4000";
  process.env.WORK_SEARCH_TOKEN = "test-token";
  tempDir = await mkdtemp(join(tmpdir(), "work-search-route-"));
  process.chdir(tempDir);
});

afterEach(async () => {
  globalThis.fetch = originalFetch;
  process.chdir(originalCwd);
  await rm(tempDir, { recursive: true, force: true });
});

test("no query returns the fallback pills", async () => {
  const request = new NextRequest("http://localhost/api/work-search");
  const response = await GET(request);
  const body = await response.json();
  assert.equal(body.pills.length, 5);
});

test("a short query is rejected as invalid", async () => {
  const request = new NextRequest("http://localhost/api/work-search?q=a");
  const response = await GET(request);
  assert.equal(response.status, 400);
});

test("a successful sidecar response is forwarded as slugs", async () => {
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ results: [{ slug: "rag-edito", score: 0.9 }] }), {
      status: 200,
    });
  const request = new NextRequest("http://localhost/api/work-search?q=AB%20test");
  const response = await GET(request);
  const body = await response.json();
  assert.deepEqual(body, { slugs: ["rag-edito"] });
});

test("a sidecar failure falls back to unavailable instead of erroring", async () => {
  globalThis.fetch = async () => {
    throw new Error("down");
  };
  const request = new NextRequest("http://localhost/api/work-search?q=AB%20test");
  const response = await GET(request);
  const body = await response.json();
  assert.deepEqual(body, { slugs: null, unavailable: true });
  assert.equal(response.status, 200);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --experimental-strip-types --test src/app/api/work-search/route.test.ts`
Expected: FAIL — `route.ts` does not exist.

- [ ] **Step 3: Implement the route handler**

`src/app/api/work-search/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { getPills, recordSearch, FIGMA_FALLBACK_PILLS } from "@/lib/work-search-analytics";
import { searchSidecar } from "@/lib/work-search-sidecar";

const limiter = createRateLimiter({ max: 20, windowMs: 60_000 });

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (!limiter.allow(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const query = request.nextUrl.searchParams.get("q");

  if (!query) {
    const pills = await getPills(FIGMA_FALLBACK_PILLS);
    return NextResponse.json({ pills });
  }

  const trimmed = query.trim();
  if (trimmed.length < 2 || trimmed.length > 200) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  const result = await searchSidecar(trimmed);
  if (!result.ok) {
    return NextResponse.json({ slugs: null, unavailable: true });
  }

  await recordSearch(trimmed);
  return NextResponse.json({ slugs: result.slugs });
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --experimental-strip-types --test src/app/api/work-search/route.test.ts`
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/work-search/route.ts src/app/api/work-search/route.test.ts
git commit -m "feat: add /api/work-search route (pills + sidecar-backed search)"
```

---

### Task 9: Extract plain text from work content blocks

**Files:**
- Create: `scripts/lib/extract-work-text.ts`
- Test: `scripts/lib/extract-work-text.test.ts`

**Interfaces:**
- Produces: `extractWorkText(item: WorkItem, blocks: WorkContentBlock[]): string` — used by Task 10's reindex script.

- [ ] **Step 1: Write the failing test**

`scripts/lib/extract-work-text.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { extractWorkText } from "./extract-work-text.ts";
import type { WorkItem } from "../../src/data/work.ts";
import type { WorkContentBlock } from "../../src/data/work-content/types.ts";

const item: WorkItem = {
  slug: "rag-edito",
  title: "Turning the RAG Edito into an AI UX standard for all of ADEO",
  description: "Designing the RAG Edito for LeroyMerlin.fr.",
  image: "/images/work/rag-edito-cover.webp",
  imageAlt: "",
  imageBlurDataURL: "",
  icon: "/images/work/icons/leroymerlin-icon.webp",
  iconAlt: "",
  readTime: "5-min read",
  tags: ["AI UX", "User research", "Mentoring"],
};

test("collects title, description, and tags", () => {
  const text = extractWorkText(item, []);
  assert.match(text, /Turning the RAG Edito/);
  assert.match(text, /Designing the RAG Edito/);
  assert.match(text, /User research/);
});

test("collects paragraph, heading, and quote text from top-level blocks", () => {
  const blocks: WorkContentBlock[] = [
    { type: "paragraph", text: "Ran user testing sessions." },
    { type: "heading", text: "Testing in a real environment" },
    { type: "quote", text: "A SUS score of 85.", attribution: "User 4" },
  ];
  const text = extractWorkText(item, blocks);
  assert.match(text, /Ran user testing sessions/);
  assert.match(text, /Testing in a real environment/);
  assert.match(text, /A SUS score of 85/);
});

test("collects list items and callout title+items", () => {
  const blocks: WorkContentBlock[] = [
    { type: "list", items: ["First finding", "Second finding"] },
    { type: "callout", icon: "info", title: "Key takeaway", items: ["Point A", "Point B"] },
  ];
  const text = extractWorkText(item, blocks);
  assert.match(text, /First finding/);
  assert.match(text, /Second finding/);
  assert.match(text, /Key takeaway/);
  assert.match(text, /Point A/);
});

test("collects text nested inside row columns", () => {
  const blocks: WorkContentBlock[] = [
    {
      type: "row",
      columns: [
        { cols: 6, blocks: [{ type: "paragraph", text: "Column one text" }] },
        { cols: 6, blocks: [{ type: "paragraph", text: "Column two text" }] },
      ],
    },
  ];
  const text = extractWorkText(item, blocks);
  assert.match(text, /Column one text/);
  assert.match(text, /Column two text/);
});

test("ignores media-only blocks (image, video, divider, screenPair)", () => {
  const blocks: WorkContentBlock[] = [
    { type: "divider" },
    {
      type: "image",
      src: "/x.webp",
      alt: "an image",
      width: 10,
      height: 10,
      blurDataURL: "",
    },
  ];
  const text = extractWorkText(item, blocks);
  assert.doesNotMatch(text, /an image/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test scripts/lib/extract-work-text.test.ts`
Expected: FAIL — `extract-work-text.ts` does not exist.

- [ ] **Step 3: Implement the extractor**

`scripts/lib/extract-work-text.ts`:

```ts
import type { WorkContentBlock, WorkContentLeaf } from "../../src/data/work-content/types.ts";
import type { WorkItem } from "../../src/data/work.ts";

function extractLeafText(leaf: WorkContentLeaf): string[] {
  switch (leaf.type) {
    case "paragraph":
    case "quote":
    case "sectionHeading":
    case "stat":
      return [leaf.text];
    case "heading":
      return leaf.note ? [leaf.text, leaf.note] : [leaf.text];
    case "list":
      return leaf.items;
    case "callout":
      return [leaf.title, ...leaf.items];
    case "accordionImage":
      return leaf.note ? [leaf.title, leaf.note] : [leaf.title];
    case "divider":
    case "image":
    case "video":
    case "screenPair":
      return [];
    default:
      return [];
  }
}

function extractBlockText(block: WorkContentBlock): string[] {
  if (block.type === "row") {
    return block.columns.flatMap((column) => column.blocks.flatMap(extractLeafText));
  }
  return extractLeafText(block);
}

export function extractWorkText(item: WorkItem, blocks: WorkContentBlock[]): string {
  const bodyText = blocks.flatMap(extractBlockText);
  return [item.title, item.description, ...item.tags, ...bodyText].join(" ");
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --experimental-strip-types --test scripts/lib/extract-work-text.test.ts`
Expected: PASS — 5 tests passing.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/extract-work-text.ts scripts/lib/extract-work-text.test.ts
git commit -m "feat: extract plain text from work content blocks"
```

---

### Task 10: Reindex script

**Files:**
- Create: `scripts/reindex-work-search.ts`
- Test: `scripts/reindex-work-search.test.ts`

**Interfaces:**
- Consumes: `extractWorkText` (Task 9), `workItems` from `src/data/work.ts`, `workContent` from `src/data/work-content/index.ts`.
- Produces: `buildReindexPayload(): { slug: string; hash: string; text: string }[]` (pure, tested) and a `main()` side-effecting entry point (not unit tested — verified manually against the running sidecar).

- [ ] **Step 1: Write the failing test**

`scripts/reindex-work-search.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReindexPayload } from "./reindex-work-search.ts";
import { workItems } from "../src/data/work.ts";

test("builds one payload item per work item, each with a slug, hash, and text", () => {
  const payload = buildReindexPayload();
  assert.equal(payload.length, workItems.length);
  for (const entry of payload) {
    assert.equal(typeof entry.slug, "string");
    assert.match(entry.hash, /^[0-9a-f]{64}$/);
    assert.ok(entry.text.length > 0);
  }
});

test("the hash is stable for the same content", () => {
  const first = buildReindexPayload();
  const second = buildReindexPayload();
  assert.deepEqual(
    first.map((entry) => entry.hash),
    second.map((entry) => entry.hash),
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test scripts/reindex-work-search.test.ts`
Expected: FAIL — `reindex-work-search.ts` does not exist.

- [ ] **Step 3: Implement the script**

`scripts/reindex-work-search.ts`:

```ts
import { createHash } from "node:crypto";
import { workItems } from "../src/data/work.ts";
import { workContent } from "../src/data/work-content/index.ts";
import { extractWorkText } from "./lib/extract-work-text.ts";

export type ReindexPayloadItem = { slug: string; hash: string; text: string };

export function buildReindexPayload(): ReindexPayloadItem[] {
  return workItems.map((item) => {
    const blocks = workContent[item.slug] ?? [];
    const text = extractWorkText(item, blocks);
    const hash = createHash("sha256").update(text).digest("hex");
    return { slug: item.slug, hash, text };
  });
}

async function main() {
  const baseUrl = process.env.WORK_SEARCH_URL;
  const token = process.env.WORK_SEARCH_TOKEN;
  if (!baseUrl || !token) {
    console.warn("WORK_SEARCH_URL/WORK_SEARCH_TOKEN not set — skipping reindex.");
    return;
  }

  const items = buildReindexPayload();

  try {
    const response = await fetch(`${baseUrl}/reindex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify({ items }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      console.warn(`Reindex request failed with status ${response.status}`);
      return;
    }
    const result = await response.json();
    console.log("Reindex complete:", result);
  } catch (err) {
    console.warn("Reindex request failed:", err);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --experimental-strip-types --test scripts/reindex-work-search.test.ts`
Expected: PASS — 2 tests passing.

- [ ] **Step 5: Add the site's test script and env-file convention to `package.json`**

In [package.json](../../../package.json), add under `"scripts"`:

```json
"test": "node --experimental-strip-types --test"
```

- [ ] **Step 6: Commit**

```bash
git add scripts/reindex-work-search.ts scripts/reindex-work-search.test.ts package.json
git commit -m "feat: add reindex script that pushes work content hashes to the sidecar"
```

---

### Task 11: `WorkCardSkeleton` component

**Files:**
- Create: `src/components/WorkCardSkeleton.tsx`

**Interfaces:**
- Produces: `<WorkCardSkeleton />` (no props) — used by Task 13's `page.tsx`.

- [ ] **Step 1: Implement the skeleton, matching `WorkCard`'s layout**

`src/components/WorkCardSkeleton.tsx`:

```tsx
export default function WorkCardSkeleton() {
  return (
    <div
      className="flex h-full flex-1 animate-pulse flex-col items-start gap-1.5 rounded-3xl bg-bg-secondary p-1.5"
      aria-hidden
    >
      <div className="aspect-7/5 w-full shrink-0 rounded-[20px] bg-bg-tertiary" />
      <div className="flex w-full flex-1 flex-col items-start gap-8 p-2.5">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start gap-1.5">
            <div className="h-6 w-6 shrink-0 rounded-full bg-bg-tertiary" />
            <div className="h-5 w-3/4 rounded bg-bg-tertiary" />
            <div className="h-5 w-1/2 rounded bg-bg-tertiary" />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="h-6 w-16 rounded-full bg-bg-tertiary" />
            <div className="h-6 w-24 rounded-full bg-bg-tertiary" />
            <div className="h-6 w-20 rounded-full bg-bg-tertiary" />
          </div>
        </div>
        <div className="mt-auto flex w-full items-center justify-between">
          <div className="h-9 w-24 rounded-lg bg-bg-tertiary" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WorkCardSkeleton.tsx
git commit -m "feat: add work card skeleton for the search loading state"
```

---

### Task 12: `WorkSearchBar` component

**Files:**
- Create: `src/components/WorkSearchBar.tsx`

**Interfaces:**
- Consumes: `GET /api/work-search` (Task 8, called via `fetch` from the browser).
- Produces: `type WorkSearchState = { status: "idle" } | { status: "loading" } | { status: "success"; slugs: string[] } | { status: "unavailable" }` and `<WorkSearchBar onStateChange={(state: WorkSearchState) => void} />` — used by Task 13's `page.tsx`.

- [ ] **Step 1: Implement the component**

`src/components/WorkSearchBar.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export type WorkSearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; slugs: string[] }
  | { status: "unavailable" };

const FALLBACK_PILLS = [
  "AI UX",
  "User Research",
  "Design Leadership",
  "Accessibility",
  "Mentoring",
];

export default function WorkSearchBar({
  onStateChange,
}: {
  onStateChange: (state: WorkSearchState) => void;
}) {
  const [query, setQuery] = useState("");
  const [pills, setPills] = useState<string[]>(FALLBACK_PILLS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/work-search")
      .then((res) => res.json())
      .then((data: { pills?: string[] }) => {
        if (data.pills && data.pills.length > 0) setPills(data.pills);
      })
      .catch(() => {});
  }, []);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      onStateChange({ status: "idle" });
      return;
    }
    onStateChange({ status: "loading" });
    fetch(`/api/work-search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data: { slugs: string[] | null }) => {
        if (data.slugs === null) {
          onStateChange({ status: "unavailable" });
        } else {
          onStateChange({ status: "success", slugs: data.slugs });
        }
      })
      .catch(() => onStateChange({ status: "unavailable" }));
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 500);
  };

  const handlePillClick = (label: string) => {
    setQuery(label);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runSearch(label);
  };

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {pills.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handlePillClick(label)}
            className="rounded-full bg-bg-tertiary px-4 py-3 font-body text-sm text-text-secondary transition-colors hover:bg-[#525252]"
          >
            {label}
          </button>
        ))}
      </div>
      <label className="w-full max-w-[205px]">
        <span className="sr-only">Search by skill</span>
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Or any other skill"
          className="w-full rounded-full border border-border-primary bg-transparent px-3 py-2 font-body text-base text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
      </label>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/WorkSearchBar.tsx
git commit -m "feat: add work search bar with pills and debounced input"
```

---

### Task 13: Wire the search bar and skeleton into `/work`

**Files:**
- Modify: `src/app/work/page.tsx`

**Interfaces:**
- Consumes: `WorkSearchBar`/`WorkSearchState` (Task 12), `WorkCardSkeleton` (Task 11).

- [ ] **Step 1: Update the page**

Replace the contents of `src/app/work/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
import WorkCard from "@/components/WorkCard";
import WorkCardSkeleton from "@/components/WorkCardSkeleton";
import WorkSearchBar, { type WorkSearchState } from "@/components/WorkSearchBar";
import { workItems } from "@/data/work";

export default function WorkPage() {
  const [searchState, setSearchState] = useState<WorkSearchState>({ status: "idle" });

  const visibleItems = useMemo(() => {
    if (searchState.status === "success") {
      const slugSet = new Set(searchState.slugs);
      return workItems.filter((item) => slugSet.has(item.slug));
    }
    return workItems;
  }, [searchState]);

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <BackButton href="/" />
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          Work
        </h1>
      </div>

      <WorkSearchBar onStateChange={setSearchState} />

      {searchState.status === "unavailable" && (
        <p className="font-body text-sm text-text-tertiary">
          Search is unavailable right now — showing every project.
        </p>
      )}

      <ul className="grid w-full grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-1.5">
        {searchState.status === "loading"
          ? Array.from({ length: workItems.length }).map((_, index) => (
              <li key={index} className="flex h-full">
                <WorkCardSkeleton />
              </li>
            ))
          : visibleItems.map((item, index) => (
              <li key={item.slug} className="flex h-full">
                <WorkCard item={item} priority={index < 2} />
              </li>
            ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Run the full site test suite**

Run: `npm test`
Expected: PASS — all tests from Tasks 5-10 passing (20 tests).

- [ ] **Step 3: Manually verify in the browser**

Start the sidecar locally (from Task 4's verification), then in the site's `.env.local`:

```
WORK_SEARCH_URL=http://127.0.0.1:4000
WORK_SEARCH_TOKEN=test-secret
```

Run `npm run dev`, open `/work`:
- Type "AB/Test" slowly — after the last keystroke + ~500ms, a brief skeleton grid appears, then only `rag-edito` (and any other item the model judges relevant) remains.
- Clear the input — every card reappears.
- Click a pill — the input fills and the same search runs immediately (no extra typing needed).
- Stop the sidecar process, repeat a search — the page falls back to showing every card plus the "Search is unavailable" note, no crash.

- [ ] **Step 4: Commit**

```bash
git add src/app/work/page.tsx
git commit -m "feat: wire AI skill search into the work page"
```

---

### Task 14: Deploy step for reindexing

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: `scripts/reindex-work-search.ts` (Task 10), the server's `.env` (`WORK_SEARCH_URL`, `WORK_SEARCH_TOKEN` — set manually per the spec's deployment notes, not part of this task).

- [ ] **Step 1: Add the reindex step after the existing deploy steps**

In [.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml), the `script` block currently ends with:

```yaml
            npm ci
            npm run build

            pm2 restart portfolio --update-env
            pm2 save
```

Change it to:

```yaml
            npm ci
            npm run build

            pm2 restart portfolio --update-env
            pm2 save

            node --experimental-strip-types --env-file=.env scripts/reindex-work-search.ts || true
```

The trailing `|| true` matches the spec's "fails soft" requirement: a reindex failure (sidecar down, missing `.env`) must never fail the deploy.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: reindex work search on every deploy"
```

---

## Final verification checklist

- [ ] `npm test` passes in the site repo (Tasks 5-10, 20 tests).
- [ ] `node --test` passes in `work-search-ai/` (Tasks 1-3, 14 tests).
- [ ] Manual browser check from Task 13, Step 3, all four bullet points confirmed.
- [ ] `work-search-ai/` installed and running via pm2 on the server (manual, per its README).
- [ ] Site's `.env` on the server has `WORK_SEARCH_URL`/`WORK_SEARCH_TOKEN` matching the sidecar's `.env` (`INTERNAL_TOKEN`) — manual, one-time.
- [ ] `scripts/reindex-work-search.ts` run once by hand after the sidecar's first deploy, to seed `store.json` before the first real user search.
