import { noteItems } from "@/data/notes";
import { ogImageContentType, ogImageSize, renderOgImage } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = noteItems.find((i) => i.slug === slug);

  return renderOgImage({
    title: item?.title ?? "I build stuff to bring order to complexity.",
  });
}
