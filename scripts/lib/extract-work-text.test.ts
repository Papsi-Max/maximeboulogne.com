import { test } from "node:test";
import assert from "node:assert/strict";
import { extractWorkText } from "./extract-work-text.ts";
import type { WorkItem } from "../../src/data/work.ts";
import type { WorkContentBlock } from "../../src/data/work-content/types.ts";

const item: WorkItem = {
  slug: "rag-edito",
  title: "Turning the RAG Edito into an AI UX standard for all of ADEO",
  description: "Designing the RAG Edito for LeroyMerlin.fr.",
  image: "/images/work/rag-edito-cover.webp",
  imageAlt: "",
  imageBlurDataURL: "",
  icon: "/images/work/icons/leroymerlin-icon.webp",
  iconAlt: "",
  readTime: "5-min read",
  tags: ["AI UX", "User research", "Mentoring"],
};

test("collects title and description", () => {
  const text = extractWorkText(item, []);
  assert.match(text, /Turning the RAG Edito/);
  assert.match(text, /Designing the RAG Edito/);
});

test("does not include tags — they're sent separately to the search sidecar, verbatim, instead of relying on its LLM to keep them unparaphrased when it summarizes the text (it doesn't, reliably)", () => {
  const text = extractWorkText(item, []);
  assert.doesNotMatch(text, /User research/);
  assert.doesNotMatch(text, /Mentoring/);
});

test("collects paragraph, heading, and quote text from top-level blocks", () => {
  const blocks: WorkContentBlock[] = [
    { type: "paragraph", text: "Ran user testing sessions." },
    { type: "heading", text: "Testing in a real environment" },
    { type: "quote", text: "A SUS score of 85.", attribution: "User 4" },
  ];
  const text = extractWorkText(item, blocks);
  assert.match(text, /Ran user testing sessions/);
  assert.match(text, /Testing in a real environment/);
  assert.match(text, /A SUS score of 85/);
});

test("collects list items and callout title+items", () => {
  const blocks: WorkContentBlock[] = [
    { type: "list", items: ["First finding", "Second finding"] },
    { type: "callout", icon: "info", title: "Key takeaway", items: ["Point A", "Point B"] },
  ];
  const text = extractWorkText(item, blocks);
  assert.match(text, /First finding/);
  assert.match(text, /Second finding/);
  assert.match(text, /Key takeaway/);
  assert.match(text, /Point A/);
});

test("collects text nested inside row columns", () => {
  const blocks: WorkContentBlock[] = [
    {
      type: "row",
      columns: [
        { cols: 6, blocks: [{ type: "paragraph", text: "Column one text" }] },
        { cols: 6, blocks: [{ type: "paragraph", text: "Column two text" }] },
      ],
    },
  ];
  const text = extractWorkText(item, blocks);
  assert.match(text, /Column one text/);
  assert.match(text, /Column two text/);
});

test("ignores media-only blocks (image, video, divider, screenPair)", () => {
  const blocks: WorkContentBlock[] = [
    { type: "divider" },
    {
      type: "image",
      src: "/x.webp",
      alt: "an image",
      width: 10,
      height: 10,
      blurDataURL: "",
    },
  ];
  const text = extractWorkText(item, blocks);
  assert.doesNotMatch(text, /an image/);
});
