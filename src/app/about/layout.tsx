import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  // Redeclared so the root's template keeps reaching any future route
  // nested under /about (see the same comment in work/layout.tsx).
  title: {
    default: "About",
    template: siteConfig.titleTemplate,
  },
  description:
    "About Maxime Boulogne, a self-taught UX designer at ADEO focused on shaping how AI should behave inside products.",
  alternates: {
    canonical: "/about",
  },
};

// Person schema so search engines can resolve who this site belongs to
// (a prerequisite for Google to surface a Knowledge Panel for the name).
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author,
  url: `${siteConfig.url}/about`,
  jobTitle: "UX Designer",
  worksFor: {
    "@type": "Organization",
    name: "ADEO",
  },
  sameAs: [siteConfig.links.linkedin],
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {children}
    </>
  );
}
