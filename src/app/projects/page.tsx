import StubSection from "@/components/StubSection";
import { projectItems } from "@/data/projects";
import { countLabel } from "@/lib/count-label";

export default function ProjectsPage() {
  return (
    <StubSection title="Projects" count={countLabel(projectItems.length)} />
  );
}
