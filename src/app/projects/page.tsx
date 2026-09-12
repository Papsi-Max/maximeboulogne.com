import type { Metadata } from "next";
import StubSection from "@/components/StubSection";
import { projectItems } from "@/data/projects";
import { countLabel } from "@/lib/count-label";

export const metadata: Metadata = {
  title: "Projects",
  description: "Side projects by Maxime Boulogne. Coming soon.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <StubSection title="Projects" count={countLabel(projectItems.length)} />
  );
}
