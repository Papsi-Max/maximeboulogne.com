import Icon from "@/components/Icon";
import GameLibraryExample from "@/components/GameLibraryExample";
import type { NoteContentBlock } from "@/data/notes-content";

export default function NoteContentBlocks({
  blocks,
}: {
  blocks: NoteContentBlock[];
}) {
  return (
    <div className="flex w-full flex-col items-start gap-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="w-full font-body text-lg leading-relaxed text-text-secondary"
              >
                {block.text}
              </p>
            );

          case "gameLibraryExample":
            return <GameLibraryExample key={i} />;

          case "imagePlaceholder":
            return (
              <div
                key={i}
                className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border-primary bg-bg-secondary"
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
