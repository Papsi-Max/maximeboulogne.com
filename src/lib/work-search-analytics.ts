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
