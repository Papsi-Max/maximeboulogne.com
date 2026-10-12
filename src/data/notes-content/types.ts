export type NoteImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
  caption?: string;
};

export type NoteContentBlock =
  | {
      type: "paragraph";
      text: string;
      /** Turns the first occurrence of `text` inside the paragraph into a link. */
      link?: { text: string; href: string };
    }
  | { type: "imagePlaceholder"; label?: string }
  | ({ type: "image" } & NoteImage)
  | { type: "imageRow"; images: NoteImage[] }
  | { type: "gameLibraryExample" }
  | { type: "mechanicsCarousel" }
  | { type: "commandBlock"; linkText: string; href: string; command: string };
