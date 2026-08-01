import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StubSection({
  title,
  count,
}: {
  title: string;
  count: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-4 px-4">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full px-2 py-2 -ml-2 font-body text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
      >
        <ArrowLeft aria-hidden className="h-5 w-5" strokeWidth={1.75} />
        Back
      </Link>
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-5xl font-normal text-text-primary">
          {title}
        </h1>
        <span className="flex items-center justify-center rounded-full bg-bg-accent px-2 py-0.5 text-sm font-semibold text-text-inverse">
          {count}
        </span>
      </div>
      <p className="max-w-lg font-body text-lg text-text-secondary">
        This section isn&rsquo;t designed in Figma yet — add the corresponding
        frame and I&rsquo;ll wire it up here with the same treatment as the
        home page.
      </p>
    </div>
  );
}
