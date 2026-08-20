// Script to convert source images under public/images/work/ to WebP and
// generate a tiny base64 blurDataURL per image, for use with next/image's
// `placeholder="blur"`. Next's built-in image optimizer already
// resizes/re-encodes per-request (to AVIF/WebP) at serve time, but it still
// has to decode the full source first — shrinking/converting the source
// cuts that cost and every cached variant downstream. The blurDataURL fixes
// the "blank box then pop" loading experience.
//
// Usage:
//   node scripts/optimize-work-images.mjs --dry-run   # report only, no writes
//   node scripts/optimize-work-images.mjs             # writes .webp, deletes originals
//
// Prints a JSON report keyed by the OLD relative path (e.g.
// "logement-etudiant/01-listing-desktop.png") so it can be cross-referenced
// against every `src:` string in src/data/work-content/*.tsx and
// src/data/work.ts to update them to the new .webp path + blurDataURL.

import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images", "work");
const DRY_RUN = process.argv.includes("--dry-run");

// Max width per image, chosen from how each is actually displayed
// (screenPair desktop slots cap around 68vw on a 1920-wide viewport ≈
// 1300px, but we keep headroom for 2x/retina). Already applied in a prior
// pass — kept here so a rerun on a freshly added oversized image still
// gets downscaled sensibly.
const MAX_WIDTH_OVERRIDES = {
  "logement-etudiant/01-listing-desktop.png": 1600,
  "logement-etudiant/03-detail-desktop.png": 1600,
  "logement-etudiant/05-payment-schedule-desktop.png": 1600,
  "logement-etudiant/07-information-form-desktop.png": 1600,
  "logement-etudiant/09-payment-desktop.png": 1600,
  "logement-etudiant/02-listing-mobile.png": 900,
  "logement-etudiant/04-detail-mobile.png": 900,
  "logement-etudiant/06-payment-detail-mobile.png": 900,
  "logement-etudiant/08-information-form-mobile.png": 900,
  "logement-etudiant/10-payment-mobile.png": 900,
  "logement-etudiant/11-full-journey.png": 1400,
};

const DEFAULT_MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;
const BLUR_WIDTH = 10;
const BLUR_QUALITY = 20;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(png|jpe?g)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

async function main() {
  const files = await walk(ROOT);
  const report = {};

  for (const file of files) {
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    const before = (await stat(file)).size;
    const meta = await sharp(file).metadata();
    const maxWidth = MAX_WIDTH_OVERRIDES[rel] ?? DEFAULT_MAX_WIDTH;
    const needsResize = meta.width && meta.width > maxWidth;

    const webpBuffer = await sharp(file)
      .resize(needsResize ? { width: maxWidth } : undefined)
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    const blurBuffer = await sharp(file)
      .resize(BLUR_WIDTH)
      .webp({ quality: BLUR_QUALITY })
      .toBuffer();
    const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

    const webpPath = file.replace(/\.(png|jpe?g)$/i, ".webp");
    const webpRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
    const newMeta = await sharp(webpBuffer).metadata();

    report[rel] = {
      webpPath: webpRel,
      width: newMeta.width,
      height: newMeta.height,
      oldBytes: before,
      newBytes: webpBuffer.length,
      blurDataURL,
    };

    if (!DRY_RUN) {
      await sharp(webpBuffer).toFile(webpPath);
      await unlink(file);
    }
  }

  console.log(JSON.stringify(report, null, 2));
}

main();
