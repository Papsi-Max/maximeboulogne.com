import Image from "next/image";
import type { WorkContentBlock } from "@/data/work-content";
import WorkAccordionImage from "@/components/WorkAccordionImage";

export default function WorkContentBlocks({
  blocks,
}: {
  blocks: WorkContentBlock[];
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

          case "quote":
            return (
              <blockquote
                key={i}
                className="w-full border-l-2 border-border-primary pl-4 font-body text-lg italic leading-relaxed text-text-secondary"
              >
                {block.text}
              </blockquote>
            );

          case "image":
            return (
              <Image
                key={i}
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
                className="full-bleed-lg h-auto w-full rounded-2xl object-contain"
                sizes="(min-width: 1024px) 100vw, (min-width: 768px) 60vw, 90vw"
              />
            );

          case "screenPair":
            return (
              <div
                key={i}
                className="full-bleed-lg flex w-full flex-col items-start gap-2"
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
      })}
    </div>
  );
}
