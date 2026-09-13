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
