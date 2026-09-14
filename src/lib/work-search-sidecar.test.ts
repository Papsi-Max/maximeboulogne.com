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
