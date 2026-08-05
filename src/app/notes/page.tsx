import StubSection from "@/components/StubSection";
import { noteItems } from "@/data/notes";
import { countLabel } from "@/lib/count-label";

export default function NotesPage() {
  return <StubSection title="Notes" count={countLabel(noteItems.length)} />;
}
