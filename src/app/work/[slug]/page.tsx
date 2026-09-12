import type { Metadata } from "next";
import BackButton from "@/components/BackButton";
import { notFound } from "next/navigation";
import { workItems } from "@/data/work";
import { workContent } from "@/data/work-content";
import WorkContentBlocks from "@/components/WorkContentBlocks";
import ArticleFooter from "@/components/ArticleFooter";
import { siteConfig } from "@/lib/site-config";
import { buildBreadcrumbJsonLd } from "@/lib/breadcrumb-jsonld";

export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = workItems.find((i) => i.slug === slug);

  if (!item) {
    return {};
  }

  return {
    // "{title} - Work | Maxime Boulogne" once the root template's
    // suffix is applied. Uses seoTitle when set, to stay under Google's
    // ~60 character display budget without touching the on-page H1
    // (always item.title) or the openGraph/twitter card below, which
    // stays plain so it doesn't repeat the site name shown next to it.
    title: `${item.seoTitle ?? item.title} - Work`,
    description: item.description,
    alternates: {
      canonical: `/work/${item.slug}`,
    },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.description,
      authors: [siteConfig.author],
      url: `${siteConfig.url}/work/${item.slug}`,
      images: [{ url: item.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.description,
      images: [item.image],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = workItems.find((i) => i.slug === slug);
  const blocks = workContent[slug];

  if (!item || !blocks) {
    notFound();
  }

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.description,
    url: `${siteConfig.url}/work/${item.slug}`,
    image: `${siteConfig.url}${item.image}`,
    creator: {
      "@type": "Person",
      name: siteConfig.author,
      url: `${siteConfig.url}/about`,
    },
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Work", path: "/work" },
    { name: item.title, path: `/work/${item.slug}` },
  ]);

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="flex w-full flex-col items-start gap-3 sm:flex-row">
        <BackButton href="/work" />
        <h1 className="flex-1 font-display text-4xl font-normal text-text-primary sm:text-5xl">
          {item.title}
        </h1>
      </div>

      <div className="mt-6 w-full sm:mt-10">
        <WorkContentBlocks blocks={blocks} />
      </div>

      <ArticleFooter
        heading="More work"
        basePath="/work"
        items={workItems}
        currentSlug={item.slug}
      />
    </div>
  );
}
