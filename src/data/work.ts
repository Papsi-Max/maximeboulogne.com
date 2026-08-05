export type WorkItem = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  imageBg?: string;
  icon: string;
  iconAlt: string;
  readTime: string;
};

export const workItems: WorkItem[] = [
  {
    slug: "rag-edito",
    title: "Turning the RAG Edito into an AI UX standard for all of ADEO",
    image: "/images/work/rag-edito-cover.jpg",
    imageAlt: "RAG edito editorial assistant",
    icon: "/images/work/icons/leroymerlin-icon.png",
    iconAlt: "Leroy Merlin logo",
    readTime: "5-min read",
  },
  {
    slug: "leroy-merlin",
    title: "Envisioning the future of LEROY MERLIN's in-store experience",
    image: "/images/work/leroy-merlin-cover.png",
    imageAlt: "Leroy Merlin research component",
    icon: "/images/work/icons/leroymerlin-icon.png",
    iconAlt: "Leroy Merlin logo",
    readTime: "4-min read",
  },
  {
    slug: "xp-awards",
    title: "Turning competitor analysis into sharper pricing decisions",
    image: "/images/work/xp-awards-cover.png",
    imageAlt: "ADEO Experience Awards title card",
    icon: "/images/work/icons/leroymerlin-icon.png",
    iconAlt: "Leroy Merlin logo",
    readTime: "5-min read",
  },
  {
    slug: "livinfrance-accommodation-process",
    title: "Student housing search and booking",
    image: "/images/work/logement-etudiant-cover.png",
    imageAlt: "LivinFrance search results page",
    icon: "/images/work/icons/livinfrance-icon.png",
    iconAlt: "LivinFrance logo",
    readTime: "3-min read",
  },
  {
    slug: "atelier-june",
    title: "Giving a digital presence to a craft business",
    image: "/images/work/atelier-june-cover.png",
    imageAlt: "Atelier June landing page",
    icon: "/images/work/icons/atelierjune-icon.png",
    iconAlt: "Atelier June logo",
    readTime: "1-min read",
  },
  {
    slug: "teampify",
    title: "Designing the UX of a team-building tool for project managers",
    image: "/images/work/teampify-cover.png",
    imageAlt: "Teampify project dashboard",
    icon: "/images/work/icons/teampify-icon.png",
    iconAlt: "Teampify logo",
    readTime: "1-min read",
  },
];
