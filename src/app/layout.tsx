import type { Metadata } from "next";
import { Newsreader, TASA_Explorer } from "next/font/google";
import PageShell from "@/components/PageShell";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const tasaExplorer = TASA_Explorer({
  variable: "--font-tasa",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  // Next doesn't have ascent/descent metrics for this font, so it can't
  // auto-adjust a fallback's size to match it (that's the "Failed to find
  // font override values" warning) — disable that step and declare our own
  // fallback instead: shown before the font loads, or if it fails to load.
  adjustFontFallback: false,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author, url: siteConfig.url }],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

// Site-wide WebSite schema: the baseline structured data Google looks for
// to understand what the domain is before it trusts any page-level markup.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  author: {
    "@type": "Person",
    name: siteConfig.author,
    url: `${siteConfig.url}/about`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${tasaExplorer.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg-primary text-text-primary font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
