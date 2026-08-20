import type { Metadata } from "next";
import { Newsreader, TASA_Explorer } from "next/font/google";
import PageShell from "@/components/PageShell";
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
});

export const metadata: Metadata = {
  title: "Maxime Boulogne — Designer",
  description:
    "I build stuff to bring order to complexity. UX designer, AI & UI go-to person.",
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
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
