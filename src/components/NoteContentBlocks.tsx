import Icon from "@/components/Icon";
import GameLibraryExample from "@/components/GameLibraryExample";
import MechanicsCarousel from "@/components/MechanicsCarousel";
import type { NoteContentBlock } from "@/data/notes-content";

// Gestalt law of proximity: closely related text stays close, a new kind
// of content (media) gets more room to breathe. 8pt-scale spacing.
type BlockCategory = "text" | "visual";

function categorize(type: NoteContentBlock["type"]): BlockCategory {
  switch (type) {
    case "gameLibraryExample":
    case "mechanicsCarousel":
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

          case "mechanicsCarousel":
            return (
              <div key={i} className={`w-full ${spacing}`}>
                <MechanicsCarousel />
              </div>
            );

          case "link":
            return (
              <a
                key={i}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full font-body text-lg leading-relaxed text-text-accent underline underline-offset-2 ${spacing}`}
              >
                {block.text}
              </a>
            );

          case "code":
            return (
              <pre
                key={i}
                className={`w-full overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-border-primary bg-bg-secondary px-4 py-3 ${spacing}`}
              >
                <code className="font-mono text-base text-text-primary">
                  {block.text}
                </code>
              </pre>
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
