"use client";

import Link from "next/link";
import Icon from "@/components/Icon";

const ABOUT_PARAGRAPHS = [
  "I've been designing experiences for about 5 years now. Self-taught, coming from an unusual path I originally worked in the VFX field before finding my way into UX.",
  "I'm based near Lille in France, currently working as a UX Designer at ADEO, where I help shape how AI should behave inside our products, informally acting as the go-to person on AI and UI for other designers from the team.",
  "To me, good design starts with a good research, you can't bring order to complexity if you don't actually understand it whatever the subject.",
  "Outside of work I’m a pyromancer lvl 90, throwing fireballs across the battlefield while angry music blasts in the background. But random fireballs never land right, I calculate every throw like a chess master plotting three moves ahead.",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-tertiary"
        >
          <Icon name="arrow_back" aria-hidden size={36} />
        </Link>
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          About
        </h1>
      </div>

      {ABOUT_PARAGRAPHS.map((p, i) => (
        <p
          key={i}
          className="w-full font-body text-lg leading-relaxed text-text-secondary"
        >
          {p}
        </p>
      ))}
    </div>
  );
}
