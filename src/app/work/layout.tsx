import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  // Next only carries a title.template down from the closest ancestor
  // that defines one. Without redeclaring it here, this layout's plain
  // "Work" string would shadow the root's template for every nested
  // route, including /work/[slug], which would lose the " | Maxime
  // Boulogne" suffix.
  title: {
    default: "Work",
    template: siteConfig.titleTemplate,
  },
  description:
    "UX design work for ADEO, Leroy Merlin, and independent clients, from AI experiences to booking flows and brand-driven interfaces.",
  alternates: {
    canonical: "/work",
  },
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
