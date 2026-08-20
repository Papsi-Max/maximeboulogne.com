export type WorkItem = {
  slug: string;
  title: string;
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
    image: "/images/work/rag-edito-cover.webp",
    imageAlt: "RAG edito editorial assistant",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRjQAAABXRUJQVlA4ICgAAADwAQCdASoKAAcABUB8JZwAAup4PhcDIAAA/uqDEUajIH45mFWnCAAA",
    icon: "/images/work/icons/leroymerlin-icon.webp",
    iconAlt: "Leroy Merlin logo",
    readTime: "5-min read",
  },
  {
    slug: "leroy-merlin",
    title: "Envisioning the future of LEROY MERLIN's in-store experience",
    image: "/images/work/leroy-merlin-cover.webp",
    imageAlt: "Leroy Merlin research component",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggNAAAANABAJ0BKgoABwAFQHwlsAJ0AQtfQeyAAP7XNaTYcDvPxgi+UkE5XGG+OSxTxKMdGZXIAAA=",
    icon: "/images/work/icons/leroymerlin-icon.webp",
    iconAlt: "Leroy Merlin logo",
    readTime: "4-min read",
  },
  {
    slug: "xp-awards",
    title: "Turning competitor analysis into sharper pricing decisions",
    image: "/images/work/xp-awards-cover.webp",
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
    image: "/images/work/logement-etudiant-cover.webp",
    imageAlt: "LivinFrance search results page",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRoQAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSC8AAAABR6CgbRuGP9Gi+BuJiMg8KEJRI0mxoNrleCNhPYADDCGBiP7HOPs+EFggUWCG+gBWUDggLgAAANABAJ0BKgoABwAFQHwliALsAPRyXw4AAP7uDtxEbmAb8Dc31oB/xitlyo8AAAA=",
    icon: "/images/work/icons/livinfrance-icon.webp",
    iconAlt: "LivinFrance logo",
    readTime: "3-min read",
  },
  {
    slug: "atelier-june",
    title: "Giving a digital presence to a craft business",
    image: "/images/work/atelier-june-cover.webp",
    imageAlt: "Atelier June landing page",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRpAAAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggQAAAAPABAJ0BKgoABwAFQHwlkAJ0APSjuhuXgAD+50XLO9yEEtsYbt8EasTmGU9vaRy8B2RfQACKuj3dJlgJFbCAAAA=",
    icon: "/images/work/icons/atelierjune-icon.webp",
    iconAlt: "Atelier June logo",
    readTime: "1-min read",
  },
  {
    slug: "teampify",
    title: "Designing the UX of a team-building tool for project managers",
    image: "/images/work/teampify-cover.webp",
    imageAlt: "Teampify project dashboard",
    imageBlurDataURL:
      "data:image/webp;base64,UklGRo4AAABXRUJQVlA4WAoAAAAQAAAACQAABgAAQUxQSCoAAAABN6CQbQTIH/Qk3mlERAAygUJGkuRk7QOwCIN0CBfR/5iSBwoHGgFb8gFWUDggPgAAAPABAJ0BKgoABwAFQHwlsAAC9p9BMe61gAD+18KilI2u301V3YcNIdNt1w43R5Q6CY86nz30Iyh5sqsDgAAA",
    icon: "/images/work/icons/teampify-icon.webp",
    iconAlt: "Teampify logo",
    readTime: "1-min read",
  },
];
