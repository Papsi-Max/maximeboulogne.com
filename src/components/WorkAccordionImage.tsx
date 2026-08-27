"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";

export default function WorkAccordionImage({
  title,
  note,
  src,
  alt,
  width,
  height,
  blurDataURL,
}: {
  title: string;
  note?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 rounded-2xl bg-bg-secondary px-6 py-4 text-left transition-colors hover:bg-[#333333]"
      >
        <div className="flex flex-col items-start gap-1">
          <h2 className="font-display text-2xl font-normal text-text-primary">
            {title}
          </h2>
          {note && (
            <p className="font-body text-base italic text-text-secondary">
              {note}
            </p>
          )}
        </div>
        <Icon
          name="expand_more"
          aria-hidden
          size={24}
          className={`shrink-0 text-text-secondary transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="flex w-full justify-center">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            placeholder="blur"
            blurDataURL={blurDataURL}
            className="h-auto w-auto max-w-full rounded-2xl object-contain"
            sizes="(min-width: 1024px) 100vw, (min-width: 768px) 60vw, 90vw"
          />
        </div>
      )}
    </div>
  );
}
