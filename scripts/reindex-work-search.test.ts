import { test } from "node:test";
import assert from "node:assert/strict";
import { buildReindexPayload } from "./reindex-work-search.ts";
import { workItems } from "../src/data/work.ts";

test("builds one payload item per work item, each with a slug, hash, text, and tags", () => {
  const payload = buildReindexPayload();
  assert.equal(payload.length, workItems.length);
  for (const entry of payload) {
    assert.equal(typeof entry.slug, "string");
    assert.match(entry.hash, /^[0-9a-f]{64}$/);
    assert.ok(entry.text.length > 0);
    assert.ok(Array.isArray(entry.tags));
  }
});

test("sends each work item's own tags, verbatim", () => {
  const payload = buildReindexPayload();
  for (const item of workItems) {
    const entry = payload.find((p) => p.slug === item.slug);
    assert.deepEqual(entry?.tags, item.tags);
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
