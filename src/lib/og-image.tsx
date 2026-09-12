import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const fontsDir = path.join(process.cwd(), "src/assets/og-fonts");

// satori (which ImageResponse renders through) needs the actual font
// bytes, it can't reach the CSS `@font-face` the app serves in the
// browser. Same two families as the rest of the site (Newsreader,
// TASA Explorer), read once per server lifetime and reused.
let fontsPromise: Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> | null = null;

function loadOgFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(path.join(fontsDir, "Newsreader.ttf")),
      readFile(path.join(fontsDir, "TASAExplorer.ttf")),
    ]).then(([newsreader, tasaExplorer]) => [
      { name: "Newsreader", data: newsreader, weight: 600 as const, style: "normal" as const },
      { name: "TASA Explorer", data: tasaExplorer, weight: 400 as const, style: "normal" as const },
    ]);
  }
  return fontsPromise;
}

/** Shared visual for every generated Open Graph image: the site name in
 * the display font, then the page's own title in the body font, on the
 * site's dark background. Matches the site's Figma opengraph-image
 * template so a note, a work item, and the site default all read as
 * the same brand when shared on social platforms. */
export async function renderOgImage({ title }: { title: string }) {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 32,
          padding: "0 90px",
          backgroundColor: "#1e1e1e",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Newsreader",
            fontWeight: 600,
            fontSize: 44,
            color: "#ffeda9",
          }}
        >
          Maxime Boulogne
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "TASA Explorer",
            fontWeight: 400,
            fontSize: 54,
            lineHeight: 1.15,
            color: "#f1e7db",
            maxWidth: 1020,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...ogImageSize, fonts },
  );
}
