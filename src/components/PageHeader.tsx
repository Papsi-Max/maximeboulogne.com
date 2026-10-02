import BackButton from "@/components/BackButton";

/** Header shared by every page: the back button and the page's h1, plus
 * optional extra content (e.g. a byline) below them. `long` is for titles
 * that can run long (case studies, notes): a smaller title, with the back
 * button stacked above it on mobile instead of squeezing the title beside it. */
export default function PageHeader({
  title,
  backHref,
  backLabel,
  long = false,
  children,
}: {
  title: string;
  backHref: string;
  backLabel: string;
  long?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex w-full flex-col items-start gap-4">
      <div
        className={`flex w-full items-start gap-3 ${long ? "flex-col sm:flex-row" : ""}`}
      >
        <BackButton href={backHref} label={backLabel} />
        <h1
          className={`flex-1 font-display font-normal text-text-primary ${
            long ? "text-4xl sm:text-5xl" : "text-5xl"
          }`}
        >
          {title}
        </h1>
      </div>
      {children}
    </header>
  );
}
