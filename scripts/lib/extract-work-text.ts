import type { WorkContentBlock, WorkContentLeaf } from "../../src/data/work-content/types.ts";
import type { WorkItem } from "../../src/data/work.ts";

function extractLeafText(leaf: WorkContentLeaf): string[] {
  switch (leaf.type) {
    case "paragraph":
    case "quote":
    case "sectionHeading":
    case "stat":
      return [leaf.text];
    case "heading":
      return leaf.note ? [leaf.text, leaf.note] : [leaf.text];
    case "list":
      return leaf.items;
    case "callout":
      return [leaf.title, ...leaf.items];
    case "accordionImage":
      return leaf.note ? [leaf.title, leaf.note] : [leaf.title];
    case "divider":
    case "image":
    case "video":
    case "screenPair":
      return [];
    default:
      return [];
  }
}

function extractBlockText(block: WorkContentBlock): string[] {
  if (block.type === "row") {
    return block.columns.flatMap((column) => column.blocks.flatMap(extractLeafText));
  }
  return extractLeafText(block);
}

export function extractWorkText(item: WorkItem, blocks: WorkContentBlock[]): string {
  const bodyText = blocks.flatMap(extractBlockText);
  return [item.title, item.description, ...item.tags, ...bodyText].join(" ");
}
