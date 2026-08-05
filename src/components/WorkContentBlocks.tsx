import Image from "next/image";
import type {
  WorkContentBlock,
  WorkContentColumn,
  WorkContentLeaf,
} from "@/data/work-content";
import WorkAccordionImage from "@/components/WorkAccordionImage";

const COL_SPAN: Record<WorkContentColumn["cols"], string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

export default function WorkContentBlocks({
  blocks,
}: {
  blocks: WorkContentBlock[];
}) {
  return (
    <div className="flex w-full flex-col items-start gap-6">
      {blocks.map((block, i) =>
        block.type === "row" ? (
          <div
            key={i}
            className="full-bleed-lg grid w-full grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
          >
            {block.columns.map((column, ci) => (
              <div
                key={ci}
                className={`flex w-full flex-col items-start gap-6 ${COL_SPAN[column.cols]}`}
              >
                {column.blocks.map((leaf, li) => renderLeaf(leaf, li, false))}
              </div>
            ))}
          </div>
        ) : (
          renderLeaf(block, i, true)
        )
      )}
    </div>
  );
}

function renderLeaf(block: WorkContentLeaf, i: number, bleed: boolean) {
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

    case "quote":
      return (
        <blockquote
          key={i}
          className="w-full border-l-2 border-border-primary pl-4 font-body text-lg italic leading-relaxed text-text-secondary"
        >
          <p>{block.text}</p>
          {block.attribution && (
            <cite className="mt-2 block font-body text-sm not-italic text-text-secondary/80">
              {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    case "sectionHeading":
      return (
        <h2
          key={i}
          className="w-full mt-16 font-display text-2xl font-normal text-text-primary"
        >
          {block.text}
        </h2>
      );

    case "list":
      return (
        <ul key={i} className="flex w-full flex-col items-start gap-2 pl-5">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="w-full list-disc font-body text-lg leading-relaxed text-text-secondary"
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case "stat":
      return (
        <div
          key={i}
          className="flex w-full items-start gap-3 rounded-2xl bg-bg-secondary p-6"
        >
          <span aria-hidden className="text-xl">
            {block.icon}
          </span>
          <p className="font-body text-base leading-relaxed text-text-primary">
            {block.text}
          </p>
        </div>
      );

    case "image":
      return (
        <div
          key={i}
          className={`flex w-full justify-center ${bleed ? "full-bleed-lg" : ""}`}
        >
          <Image
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            className="h-auto w-auto max-w-full rounded-2xl object-contain"
            sizes={
              bleed
                ? "(min-width: 1024px) 100vw, (min-width: 768px) 60vw, 90vw"
                : "(min-width: 1024px) 33vw, 90vw"
            }
          />
        </div>
      );

    case "screenPair":
      return (
        <div
          key={i}
          className={`flex w-full flex-col items-start gap-2 ${bleed ? "full-bleed-lg" : ""}`}
        >
          <div className="flex w-full items-stretch gap-8">
            <Image
              src={block.desktop.src}
              alt={block.desktop.alt}
              width={block.desktop.width}
              height={block.desktop.height}
              className="h-auto min-w-0 rounded-lg object-contain"
              style={{
                aspectRatio: `${block.desktop.width} / ${block.desktop.height}`,
                flexGrow: block.desktop.width / block.desktop.height,
                flexBasis: 0,
                width: "100%",
              }}
              sizes="(min-width: 1024px) 68vw, (min-width: 768px) 45vw, 65vw"
            />
            <Image
              src={block.mobile.src}
              alt={block.mobile.alt}
              width={block.mobile.width}
              height={block.mobile.height}
              className="h-auto min-w-0 rounded-lg object-contain"
              style={{
                aspectRatio: `${block.mobile.width} / ${block.mobile.height}`,
                flexGrow: block.mobile.width / block.mobile.height,
                flexBasis: 0,
                width: "100%",
              }}
              sizes="(min-width: 1024px) 27vw, (min-width: 768px) 18vw, 26vw"
            />
          </div>
          {block.caption && (
            <p className="w-full font-body text-sm text-text-secondary">
              {block.caption}
            </p>
          )}
        </div>
      );

    case "heading":
      return (
        <div key={i} className="flex w-full flex-col items-start gap-1">
          <h2 className="font-display text-2xl font-normal text-text-primary">
            {block.text}
          </h2>
          {block.note && (
            <p className="font-body text-base italic text-text-secondary">
              {block.note}
            </p>
          )}
        </div>
      );

    case "accordionImage":
      return (
        <WorkAccordionImage
          key={i}
          title={block.title}
          note={block.note}
          src={block.src}
          alt={block.alt}
          width={block.width}
          height={block.height}
        />
      );

    case "callout":
      return (
        <div
          key={i}
          className="flex w-full flex-col items-start gap-3 rounded-2xl bg-bg-secondary p-6"
        >
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              {block.icon}
            </span>
            <p className="font-body text-lg font-semibold text-text-primary">
              {block.title}
            </p>
          </div>
          <ul className="flex w-full flex-col items-start gap-2 pl-5">
            {block.items.map((item, j) => (
              <li
                key={j}
                className="w-full list-disc font-body text-base leading-relaxed text-text-secondary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}
