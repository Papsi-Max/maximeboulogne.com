import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { getPills, recordSearch, FIGMA_FALLBACK_PILLS } from "@/lib/work-search-analytics";
import { searchSidecar } from "@/lib/work-search-sidecar";

const limiter = createRateLimiter({ max: 20, windowMs: 60_000 });

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
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

  recordSearch(trimmed).catch(() => {});
  return NextResponse.json({ slugs: result.slugs });
}
