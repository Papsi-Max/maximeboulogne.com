import type { Metadata } from "next";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { notFound } from "next/navigation";
import { noteItems } from "@/data/notes";
import { noteContent } from "@/data/notes-content";
import NoteContentBlocks from "@/components/NoteContentBlocks";
import ArticleFooter from "@/components/ArticleFooter";
import { formatNoteDate } from "@/lib/format-note-date";
import { siteConfig } from "@/lib/site-config";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-jsonld";

export function generateStaticParams() {
  return noteItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = noteItems.find((i) => i.slug === slug);

  if (!item) {
    return {};
  }

  return {
    // "{title} - Notes | Maxime Boulogne" once the root template's
    // suffix is applied. Kept plain (item.title) for openGraph/twitter
    // below, so the shared card doesn't repeat the site name that
    // already appears next to it.
    title: `${item.title} - Notes`,
    description: item.description,
    alternates: {
      canonical: `/notes/${item.slug}`,
    },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.description,
      publishedTime: item.date,
      authors: [siteConfig.author],
      url: `${siteConfig.url}/notes/${item.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
    },
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = noteItems.find((i) => i.slug === slug);
  const blocks = noteContent[slug];

  if (!item || !blocks) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: item.title,
    description: item.description,
    datePublished: item.date,
    url: `${siteConfig.url}/notes/${item.slug}`,
    author: {
      "@type": "Person",
      name: siteConfig.author,
      url: `${siteConfig.url}/about`,
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes" },
    { name: item.title, path: `/notes/${item.slug}` },
  ]);

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex w-full items-start gap-3">
        <BackButton href="/notes" />
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          {item.title}
        </h1>
      </div>

      <div className="flex w-full items-center justify-between gap-4 font-body text-base text-text-secondary">
        <span>
          by{" "}
          <Link
            href="/about"
            className="text-text-secondary underline decoration-from-font transition-colors hover:text-text-primary"
          >
            Maxime Boulogne
          </Link>
        </span>
        <span>{formatNoteDate(item.date)}</span>
      </div>

      <div className="mt-6 w-full sm:mt-10">
        <NoteContentBlocks blocks={blocks} />
      </div>

      <ArticleFooter
        heading="More notes"
        basePath="/notes"
        items={noteItems}
        currentSlug={item.slug}
      />
    </div>
  );
}
