import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { FIGMA_FALLBACK_PILLS } from "./work-search-pills";

export { FIGMA_FALLBACK_PILLS };

const MIN_PILL_COUNT = 3;
const MAX_STORE_TERMS = 200;
const TERM_SHAPE = /^[\p{L}\p{N} /-]+$/u;

function getDefaultAnalyticsPath(): string {
  return (
    process.env.WORK_SEARCH_ANALYTICS_PATH ??
    path.join(process.cwd(), ".data", "work-search-analytics.json")
  );
}

export function normalizeQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

function isValidTerm(term: string): boolean {
  return term.length >= 2 && term.length <= 30 && TERM_SHAPE.test(term);
}

type AnalyticsEntry = { term: string; count: number };
type AnalyticsStore = Record<string, AnalyticsEntry>;

async function readAnalytics(filePath: string): Promise<AnalyticsStore> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as AnalyticsStore;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    if (err instanceof SyntaxError) return {};
    throw err;
  }
}

async function writeAnalytics(filePath: string, store: AnalyticsStore): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store, null, 2), "utf8");
}

function pruneStore(store: AnalyticsStore, maxTerms: number = MAX_STORE_TERMS): AnalyticsStore {
  const entries = Object.entries(store);
  if (entries.length <= maxTerms) return store;
  entries.sort((a, b) => b[1].count - a[1].count);
  return Object.fromEntries(entries.slice(0, maxTerms));
}

export async function recordSearch(
  term: string,
  filePath?: string,
  maxTerms: number = MAX_STORE_TERMS,
): Promise<void> {
  const resolvedPath = filePath ?? getDefaultAnalyticsPath();
  const trimmed = term.trim();
  if (!isValidTerm(trimmed)) return;
  const key = normalizeQuery(trimmed);
  if (!key) return;
  const store = await readAnalytics(resolvedPath);
  const existing = store[key];
  store[key] = { term: existing?.term ?? trimmed, count: (existing?.count ?? 0) + 1 };
  const pruned = pruneStore(store, maxTerms);
  await writeAnalytics(resolvedPath, pruned);
}

export async function getPills(
  fallback: string[] = FIGMA_FALLBACK_PILLS,
  filePath?: string,
): Promise<string[]> {
  const resolvedPath = filePath ?? getDefaultAnalyticsPath();
  const store = await readAnalytics(resolvedPath);
  const ranked = Object.values(store)
    .filter((entry) => entry.count >= MIN_PILL_COUNT)
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
