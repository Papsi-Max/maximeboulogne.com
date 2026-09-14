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
