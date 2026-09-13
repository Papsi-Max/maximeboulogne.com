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
