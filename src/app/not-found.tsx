import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/BackButton";

// noindex: a 404 has no content of its own, letting Google index it
// would waste crawl budget and could dilute the site in search results.
export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <BackButton href="/" />
        <h1 className="font-display text-4xl font-normal text-text-primary sm:text-5xl">
          Page not found
        </h1>
      </div>
      <p className="max-w-lg font-body text-lg text-text-secondary">
        This page doesn&rsquo;t exist, or it moved.{" "}
        <Link
          href="/"
          className="text-text-secondary underline decoration-from-font transition-colors hover:text-text-primary"
        >
          Back to the homepage
        </Link>
        .
      </p>
    </div>
  );
}
