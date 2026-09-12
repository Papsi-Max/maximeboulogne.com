/** Central place for the values that feed the site's SEO metadata (titles,
 * descriptions, canonical URLs, Open Graph and JSON-LD), so they stay
 * consistent instead of being repeated and drifting across routes. */
export const siteConfig = {
  name: "Maxime Boulogne",
  title: "Maxime Boulogne - UX Designer",
  titleTemplate: "%s | Maxime Boulogne",
  description:
    "I build stuff to bring order to complexity. UX designer, AI & UI go-to person.",
  url: "https://maximeboulogne.com",
  author: "Maxime Boulogne",
  locale: "en_US",
  links: {
    linkedin: "https://www.linkedin.com/in/maximeboulogne/",
  },
} as const;
