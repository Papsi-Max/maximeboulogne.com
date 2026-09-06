# maximeboulogne.com

Personal portfolio site, generated from the "Home" frame of the `CV - WEBSITE` Figma file.

## How it works

- **Home**: hero ("I'm Maxime, Designer, and metal enjoyer."), intro paragraph, 3 nav buttons (Work / Projects / Notes), contact block (email, phone, LinkedIn).
- **About**: opens by clicking "Maxime." in the hero, with a fluid Framer Motion slide transition and no page reload (a "fake one-page" behavior).
- **Music player** (`src/components/MusicWidget.tsx`): fully functional (play/pause, clickable progress bar, elapsed time). Drop an audio file in `public/audio/track.mp3` (or change the `src` prop passed to `<MusicWidget />` in `src/app/page.tsx`), plus an album cover via the `cover` prop.
- **Work** (`/work`, `/work/[slug]`): case studies with real content, defined per-slug in `src/data/work-content/`.
- **Notes** (`/notes`, `/notes/[slug]`): short-form notes with real content, defined per-slug in `src/data/notes-content/`.
- **Projects** (`/projects`): still a stub route with client-side navigation (no reload) — no real content yet.
- Colors come from Figma styles, defined in `src/app/globals.css` (`--color-bg-*`, `--color-text-*`, `--color-border-*`) and exposed to Tailwind via `@theme inline`. Fonts (Newsreader for headings, TASA Explorer for body) load via `next/font/google`, free and open-source (OFL).

## Stack

Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion.

## Status

Personal portfolio site.
