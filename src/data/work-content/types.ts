export type WorkContentLeaf =
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      blurDataURL: string;
    }
  | {
      type: "screenPair";
      desktop: {
        src: string;
        alt: string;
        width: number;
        height: number;
        blurDataURL: string;
      };
      mobile: {
        src: string;
        alt: string;
        width: number;
        height: number;
        blurDataURL: string;
      };
      caption?: string;
    }
  | { type: "heading"; text: string; note?: string }
  | { type: "sectionHeading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "stat"; icon: string; text: string }
  | {
      type: "accordionImage";
      title: string;
      note?: string;
      src: string;
      alt: string;
      width: number;
      height: number;
      blurDataURL: string;
    }
  | {
      type: "callout";
      icon: string;
      title: string;
      items: string[];
    };

/** A column inside a `row` group: one or more stacked leaf blocks, plus how
 * many of the 12 grid columns the whole stack should take. */
export type WorkContentColumn = {
  cols: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  blocks: WorkContentLeaf[];
};

export type WorkContentBlock =
  | WorkContentLeaf
  | {
      /** An explicit group of columns rendered side by side as one row,
       * e.g. an image pinned next to several stacked paragraphs. */
      type: "row";
      columns: WorkContentColumn[];
    };
