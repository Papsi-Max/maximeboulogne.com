import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import GameLibraryExample from "@/components/GameLibraryExample";
import MechanicsCarousel from "@/components/MechanicsCarousel";
import CommandBlock from "@/components/CommandBlock";
import type { NoteContentBlock } from "@/data/notes-content";
import type { NoteImage } from "@/data/notes-content/types";

// Gestalt law of proximity: closely related text stays close, a new kind
// of content (media) gets more room to breathe. 8pt-scale spacing.
type BlockCategory = "text" | "visual";

function categorize(type: NoteContentBlock["type"]): BlockCategory {
  switch (type) {
    case "gameLibraryExample":
    case "mechanicsCarousel":
    case "imagePlaceholder":
    case "image":
    case "imageRow":
    case "commandBlock":
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

// Images in a row share the tallest ratio so their captions line up.
// Object-cover trims the few pixels of margin on the wider ones.
function rowRatio(images: NoteImage[]) {
  return Math.min(...images.map((i) => i.width / i.height));
}

function renderText(block: Extract<NoteContentBlock, { type: "paragraph" }>) {
  const { text, link } = block;
  const at = link ? text.indexOf(link.text) : -1;
  if (!link || at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <Link
        href={link.href}
        className="underline decoration-from-font transition-colors hover:text-text-primary"
      >
        {link.text}
      </Link>
      {text.slice(at + link.text.length)}
    </>
  );
}

function NoteFigure({
  image,
  fill,
  aspectRatio,
}: {
  image: NoteImage;
  fill?: boolean;
  aspectRatio?: number;
}) {
  return (
    <figure className="flex w-full flex-col items-center gap-2">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        placeholder="blur"
        blurDataURL={image.blurDataURL}
        sizes={
          fill
            ? "(min-width: 640px) 287px, 100vw"
            : "(min-width: 640px) 578px, 100vw"
        }
        style={aspectRatio ? { aspectRatio } : undefined}
        className={
          aspectRatio
            ? "h-auto w-full object-cover"
            : fill
              ? "h-auto w-full"
              : "h-auto w-full sm:w-auto sm:max-w-full"
        }
      />
      {image.caption && (
        <figcaption className="w-full font-body text-sm text-text-secondary">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
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
          categorize(block.type),
        );

        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className={`w-full font-body text-lg leading-relaxed text-text-secondary ${spacing}`}
              >
                {renderText(block)}
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

          case "commandBlock":
            return (
              <div key={i} className={`w-full ${spacing}`}>
                <CommandBlock
                  linkText={block.linkText}
                  href={block.href}
                  command={block.command}
                />
              </div>
            );

          case "image":
            return (
              <div key={i} className={`w-full ${spacing}`}>
                <NoteFigure image={block} />
              </div>
            );

          case "imageRow":
            // Side by side from sm up. Below that each image would fall
            // under ~170px and its text would be unreadable, so they stack.
            return (
              <div
                key={i}
                className={`grid w-full grid-cols-1 items-start gap-8 sm:grid-cols-2 sm:gap-4 ${spacing}`}
              >
                {block.images.map((image) => (
                  <NoteFigure
                    key={image.src}
                    image={image}
                    fill
                    aspectRatio={rowRatio(block.images)}
                  />
                ))}
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
