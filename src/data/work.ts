export type WorkItem = {
  slug: string;
  title: string;
  /** Shorter title used only in the <title> tag when `title` would push
   * the tag (title + " - Work | Maxime Boulogne") past Google's ~60
   * character display budget. The on-page H1 always renders `title`,
   * never this. Falls back to `title` when unset. */
  seoTitle?: string;
  /** One-line summary used as the page's meta description and OG image
   * subtitle. Kept separate from the body copy so it can stay short. */
  description: string;
  image: string;
  imageAlt: string;
  imageBlurDataURL: string;
  imageBg?: string;
  icon: string;
  iconAlt: string;
  readTime: string;
};

export const workItems: WorkItem[] = [
  {
    slug: "rag-edito",
    title: "Turning the RAG Edito into an AI UX standard for all of ADEO",
    seoTitle: "RAG Edito: AI UX Standard for ADEO",
    description:
      "Designing the RAG Edito for LeroyMerlin.fr and turning it into the AI UX standard used across ADEO's design teams.",
    image: "/images/work/rag-edito-cover.webp",
    imageAlt: "RAG edito editorial assistant",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAADwAQCdASoKAAcABUB8JZwAAup4PhcDIAAA/uqDEUajIH45mFWnCAAA",
    icon: "/images/work/icons/leroymerlin-icon.webp",
    iconAlt: "Leroy Merlin logo",
    readTime: "5-min read",
  },
  {
    slug: "store-xp",
    title: "Envisioning the future of LEROY MERLIN's in-store experience",
    seoTitle: "LEROY MERLIN In-Store AI Vision",
    description:
      "A two-day hackday vision for the future of in-store staff tools at Leroy Merlin, built around a unified AI experience.",
    image: "/images/work/store-xp-cover.webp",
    imageAlt: "Leroy Merlin research component",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggNAAAANABAJ0BKgoABwAFQHwlsAJ0AQtfQeyAAP7XNaTYcDvPxgi+UkE5XGG+OSxTxKMdGZXIAAA=",
    icon: "/images/work/icons/leroymerlin-icon.webp",
    iconAlt: "Leroy Merlin logo",
    readTime: "4-min read",
  },
  {
    slug: "competitor-xp",
    title: "Turning competitor analysis into sharper pricing decisions",
    seoTitle: "Smatch Competitor Analysis Redesign",
    description:
      "Redesigning Smatch's fragmented tools into one Competitor Experience, saving 63,200+ hours a year with a SUS score of 81.",
    image: "/images/work/competitor-xp-cover.webp",
    imageAlt: "ADEO Experience Awards title card",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoYAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggNgAAAPABAJ0BKgoABwAFQHwliAJ0ART5EYLXgAD+J72Mdz7ZfXjr60lt+qf/xdnZ6PiHb4DdZeAAAA==",
    icon: "/images/work/icons/leroymerlin-icon.webp",
    iconAlt: "Leroy Merlin logo",
    readTime: "5-min read",
  },
  {
    slug: "livinfrance-accommodation-process",
    title: "Student housing search and booking",
    description:
      "Redesigning LivinFrance's housing search and booking flow to stop losing users before conversion.",
    image: "/images/work/livinfrance-accommodation-process-cover.webp",
    imageAlt: "LivinFrance search results page",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSC8AAAABR6CgbRuGP9Gi+BuJiMg8KEJRI0mxoNrleCNhPYADDCGBiP7HOPs+EFggUWCG+gBWUDggLgAAANABAJ0BKgoABwAFQHwliALsAPRyXw4AAP7uDtxEbmAb8Dc31oB/xitlyo8AAAA=",
    icon: "/images/work/icons/livinfrance-icon.webp",
    iconAlt: "LivinFrance logo",
    readTime: "3-min read",
  },
  {
    slug: "atelier-june-murals-showcase",
    title: "Giving a digital presence to a craft business",
    description:
      "Visual identity and showcase website for Atelier June, a Lille-based mural artist.",
    image: "/images/work/atelier-june-murals-showcase-cover.webp",
    imageAlt: "Atelier June landing page",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRpAAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggQAAAAPABAJ0BKgoABwAFQHwlkAJ0APSjuhuXgAD+50XLO9yEEtsYbt8EasTmGU9vaRy8B2RfQACKuj3dJlgJFbCAAAA=",
    icon: "/images/work/icons/atelierjune-icon.webp",
    iconAlt: "Atelier June logo",
    readTime: "1-min read",
  },
  {
    slug: "teampify-team-builder",
    title: "Designing the UX of a team-building tool for project managers",
    seoTitle: "Teampify: UX for a Team-Building Tool",
    description:
      "Interface and experience design for Teampify, a desktop web app helping project managers build their teams.",
    image: "/images/work/teampify-team-builder-cover.webp",
    imageAlt: "Teampify project dashboard",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRo4AAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggPgAAAPABAJ0BKgoABwAFQHwlsAAC9p9BMe61gAD+18KilI2u301V3YcNIdNt1w43R5Q6CY86nz30Iyh5sqsDgAAA",
    icon: "/images/work/icons/teampify-icon.webp",
    iconAlt: "Teampify logo",
    readTime: "1-min read",
  },
];
