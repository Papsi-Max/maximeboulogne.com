export type SidecarSearchResult = { ok: true; slugs: string[] } | { ok: false };

export async function searchSidecar(query: string): Promise<SidecarSearchResult> {
  const baseUrl = process.env.WORK_SEARCH_URL;
  const token = process.env.WORK_SEARCH_TOKEN;
  if (!baseUrl || !token) return { ok: false };

  try {
    const response = await fetch(`${baseUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return { ok: false };
    const data = (await response.json()) as {
      results: { slug: string; score: number }[];
    };
    return { ok: true, slugs: data.results.map((result) => result.slug) };
  } catch {
    return { ok: false };
  }
}
