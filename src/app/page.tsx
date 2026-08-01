"use client";

import Link from "next/link";
import LinkedInIcon from "@/components/LinkedInIcon";
import HoverWord from "@/components/HoverWord";
import NavPill from "@/components/NavPill";
import { useMusicWidget } from "@/components/MusicWidgetContext";

export default function Home() {
  const { openMusic } = useMusicWidget();

  return (
    <div className="flex flex-col items-start gap-12">
      <div className="flex w-full flex-col items-start gap-2 px-4">
        <div className="flex w-full flex-col items-start">
          <div className="flex items-baseline">
            <span className="font-display text-5xl font-normal text-text-primary sm:text-6xl">
              I&rsquo;m
            </span>
            <Link href="/about" data-cursor="smile">
              <HoverWord as="span">Maxime.</HoverWord>
            </Link>
          </div>
          <p className="font-display text-5xl font-normal text-text-primary sm:text-6xl">
            Designer,
          </p>
          <div className="flex items-baseline">
            <span className="font-display text-5xl font-normal text-text-primary sm:text-6xl">
              and
            </span>
            <HoverWord onClick={openMusic} as="button" data-cursor="play">
              metal enjoyer.
            </HoverWord>
          </div>
        </div>
        <p className="w-full font-body text-lg text-text-secondary">
          I build stuff to bring order to complexity. Lately, that means
          figuring out how AI should behave in user experiences.
        </p>
      </div>

      <div className="flex flex-col items-start gap-2 px-4">
        <NavPill
          href="/case-studies"
          label="Case studies"
          count="99"
          variant="accent"
        />
        <NavPill href="/projects" label="Projects" count="99" />
        <NavPill href="/notes" label="Notes" count="Coming soon" />
      </div>

      <div className="flex w-full max-w-[342px] flex-col items-start gap-4">
        <div className="w-full px-4">
          <div className="h-px w-full rounded-full bg-border-primary" />
        </div>
        <div className="flex flex-col items-start">
          <a
            href="mailto:maxime.boulogne.3D@gmail.com"
            className="rounded-full px-4 py-1.5 font-body text-base text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            maxime.boulogne.3D@gmail.com
          </a>
          <a
            href="tel:+33669983617"
            className="rounded-full px-4 py-1.5 font-body text-base text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            +33 6 69 98 36 17
          </a>
          <a
            href="https://www.linkedin.com/in/maximeboulogne/"
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body text-base text-text-secondary underline decoration-from-font transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <LinkedInIcon className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}
