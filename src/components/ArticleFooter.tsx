import Link from "next/link";
import Icon from "@/components/Icon";

/** Footer shared by every note and work detail page: up to 3 related
 * items, then the author bio. Kept as one block since the two only ever
 * appear together, at the bottom of an article. */
export default function ArticleFooter({
  heading,
  basePath,
  items,
  currentSlug,
}: {
  heading: string;
  basePath: string;
  items: { slug: string; title: string }[];
  currentSlug: string;
}) {
  const related = items
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3);

  return (
    <div className="mt-12 flex w-full flex-col items-start gap-6 sm:mt-16">
      {related.length > 0 && (
        <div className="flex w-full flex-col items-start gap-1">
          <h2 className="font-display text-2xl font-normal text-text-primary">
            {heading}
          </h2>
          <ul className="flex w-full flex-col items-start">
            {related.map((item) => (
              <li key={item.slug} className="w-full">
                <Link
                  href={`${basePath}/${item.slug}`}
                  className="group flex w-full items-center gap-1.5 rounded-full px-4 py-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                >
                  <span className="min-w-0 flex-1 truncate font-body text-lg">
                    {item.title}
                  </span>
                  <Icon
                    name="arrow_forward"
                    aria-hidden
                    size={20}
                    className="shrink-0 text-text-secondary transition-transform duration-200 group-hover:translate-x-1 group-hover:text-text-primary"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex w-full flex-col items-start gap-2">
        <div className="h-px w-full rounded-full bg-border-primary" />
        <p className="font-body text-lg text-text-tertiary">
          I&rsquo;m{" "}
          <Link
            href="/about"
            className="text-text-tertiary underline decoration-from-font transition-colors hover:text-text-primary"
          >
            Maxime Boulogne,
          </Link>{" "}
          I share these notes and case studies to prove UX only serves the
          light side of the Force.
        </p>
      </div>
    </div>
  );
}
