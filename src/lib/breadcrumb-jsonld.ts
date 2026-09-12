import { siteConfig } from "@/lib/site-config";

/** Builds a BreadcrumbList schema from an ordered list of {name, path}
 * crumbs. Lets Google show the site's hierarchy (Home > Notes > Title)
 * next to the result instead of a bare URL. */
export function buildBreadcrumbJsonLd(
  crumbs: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteConfig.url}${crumb.path}`,
    })),
  };
}
