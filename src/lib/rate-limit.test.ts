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
