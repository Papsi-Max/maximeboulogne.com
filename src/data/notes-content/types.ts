export type NoteContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "imagePlaceholder"; label?: string }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      blurDataURL: string;
      caption?: string;
    }
  | { type: "gameLibraryExample" }
  | { type: "mechanicsCarousel" }
  | { type: "commandBlock"; linkText: string; href: string; command: string };
