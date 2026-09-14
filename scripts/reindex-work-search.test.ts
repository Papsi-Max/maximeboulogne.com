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
