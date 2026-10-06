import type { NoteContentBlock } from "./types";

export const invisibleIsNotInaccessibleContent: NoteContentBlock[] = [
  {
    type: "image",
    src: "/images/notes/invisible-is-not-inaccessible/hero-rest.png",
    alt: "The site hero reading \"I'm Maxime. Designer at ADEO, and metal enjoyer.\" with no highlight and no icon.",
    width: 578,
    height: 240,
    blurDataURL:
      "data:image/webp;base64,UklGRigAAABXRUJQVlA4IBwAAAAwAQCdASoKAAQABUB8JaQAA3AA/u5X9KkLIAAA",
    caption: "Hero from maximeboulogne.com",
  },
  {
    type: "paragraph",
    text: "Visitors curious enough may notice a reaction on \"metal enjoyer\" in the hero of my site. It is a hidden gem. Nothing announces it. People have to find it.",
  },
  {
    type: "image",
    src: "/images/notes/invisible-is-not-inaccessible/hero-focus.png",
    alt: "The same hero with keyboard focus on \"metal enjoyer\": a focus ring surrounds the word and a round play icon appears beside it.",
    width: 578,
    height: 240,
    blurDataURL:
      "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAABwAQCdASoKAAQABUB8JY1nyAGIAAD+7afzMDqAE8OPmzd2vEAAAA==",
    caption: "Focus active on metal enjoyer",
  },
  {
    type: "paragraph",
    text: "Hidden does not mean closed. Keyboard, screen reader, touch or mouse: each one reaches it. The element is a button with an accessible name. Hover and focus trigger the same reveal.",
  },
  {
    type: "paragraph",
    text: "Anyone can end up with a disability, at any time. An interface built for that in advance does not need a fix on the day it happens.",
  },
  {
    type: "paragraph",
    text: "The discovery stays rare. The access does not.",
  },
];
