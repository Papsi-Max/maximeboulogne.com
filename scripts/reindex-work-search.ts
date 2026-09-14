import { createHash } from "node:crypto";
import { workItems } from "../src/data/work.ts";
import { workContent } from "../src/data/work-content/index.ts";
import { extractWorkText } from "./lib/extract-work-text.ts";

export type ReindexPayloadItem = { slug: string; hash: string; text: string };

export function buildReindexPayload(): ReindexPayloadItem[] {
  return workItems.map((item) => {
    const blocks = workContent[item.slug] ?? [];
    const text = extractWorkText(item, blocks);
    const hash = createHash("sha256").update(text).digest("hex");
    return { slug: item.slug, hash, text };
  });
}

async function main() {
  const baseUrl = process.env.WORK_SEARCH_URL;
  const token = process.env.WORK_SEARCH_TOKEN;
  if (!baseUrl || !token) {
    console.warn("WORK_SEARCH_URL/WORK_SEARCH_TOKEN not set — skipping reindex.");
    return;
  }

  const items = buildReindexPayload();

  try {
    const response = await fetch(`${baseUrl}/reindex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify({ items }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      console.warn(`Reindex request failed with status ${response.status}`);
      return;
    }
    const result = await response.json();
    console.log("Reindex complete:", result);
  } catch (err) {
    console.warn("Reindex request failed:", err);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
