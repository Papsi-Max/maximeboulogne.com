import Icon from "@/components/Icon";
import GameLibraryExample from "@/components/GameLibraryExample";
import type { NoteContentBlock } from "@/data/notes-content";

// Gestalt law of proximity: closely related text stays close, a new kind
// of content (media) gets more room to breathe. 8pt-scale spacing.
type BlockCategory = "text" | "visual";

function categorize(type: NoteContentBlock["type"]): BlockCategory {
  switch (type) {
    case "gameLibraryExample":
    case "imagePlaceholder":
      return "visual";
    default:
      return "text";
  }
}

function spacingBefore(prev: BlockCategory | null, curr: BlockCategory) {
  if (prev === null) return "";
  if (curr === "visual" || prev === "visual") return "mt-12";
  return "mt-6";
}

export default function NoteContentBlocks({
  blocks,
}: {
  blocks: NoteContentBlock[];
}) {
  return (
    <div className="flex w-full flex-col items-start">
      {blocks.map((block, i) => {
        const spacing = spacingBefore(
          i > 0 ? categorize(blocks[i - 1].type) : null,
          categorize(block.type)
        );

        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className={`w-full font-body text-lg leading-relaxed text-text-secondary ${spacing}`}
              >
                {block.text}
              </p>
            );

          case "gameLibraryExample":
            return (
              <div key={i} className={`w-full ${spacing}`}>
                <GameLibraryExample />
              </div>
            );

          case "imagePlaceholder":
            return (
              <div
                key={i}
                className={`flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border-primary bg-bg-secondary ${spacing}`}
              >
                <Icon
                  name="image"
                  aria-hidden
                  size={32}
                  className="text-text-secondary/50"
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
