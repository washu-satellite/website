#!/usr/bin/env node
// Resize + recompress every headshot under public/headshots/.
// Originals are archived to .archive/<UTC-timestamp>/headshots/... before
// being replaced. Idempotent: skips files already under the size threshold.

import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "public/headshots");
const ARCHIVE_ROOT = path.resolve(
  process.cwd(),
  ".archive",
  new Date().toISOString().replace(/[:.]/g, "-"),
  "headshots",
);

// Display size on the largest variant we render is ~14rem (size-56) ≈ 224px.
// 2x for retina = ~450px. Bump a little for safety.
const MAX_WIDTH = 512;
const QUALITY = 80;
// If a file is already smaller than this many bytes, skip it.
const SKIP_BELOW = 120 * 1024;

const VALID_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function archive(srcAbs) {
  const rel = path.relative(ROOT, srcAbs);
  const dest = path.join(ARCHIVE_ROOT, rel);
  await ensureDir(path.dirname(dest));
  await fs.copyFile(srcAbs, dest);
  return dest;
}

async function optimizeOne(srcAbs) {
  const ext = path.extname(srcAbs).toLowerCase();
  if (!VALID_EXT.has(ext)) return { skipped: "not-image" };

  const stat = await fs.stat(srcAbs);
  if (stat.size < SKIP_BELOW) return { skipped: "already-small", before: stat.size };

  const meta = await sharp(srcAbs).metadata();
  if (!meta.width) return { skipped: "no-metadata" };

  const archivedTo = await archive(srcAbs);

  // Output as JPEG regardless of source — smaller for photographic content.
  const targetExt = ext === ".png" ? ".jpg" : ext === ".webp" ? ".jpg" : ext;
  const tmpOut = srcAbs + ".__tmp__" + targetExt;

  let pipeline = sharp(srcAbs).rotate(); // honor EXIF orientation
  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });

  await pipeline.toFile(tmpOut);

  // If output target ext differs from source (png → jpg), write the new file
  // and unlink the original. Otherwise replace in place.
  const finalDest = srcAbs.replace(/\.(jpe?g|png|webp)$/i, targetExt);
  if (finalDest !== srcAbs) {
    await fs.rename(tmpOut, finalDest);
    await fs.unlink(srcAbs);
  } else {
    await fs.rename(tmpOut, srcAbs);
  }
  const after = (await fs.stat(finalDest)).size;
  return { before: stat.size, after, archivedTo, finalDest };
}

const fmt = (n) => (n / 1024).toFixed(1) + "KB";

async function main() {
  const files = [];
  for await (const f of walk(ROOT)) files.push(f);
  console.log(`Scanning ${files.length} files under ${ROOT}`);

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;
  let skipped = 0;
  const renames = [];

  for (const f of files) {
    try {
      const r = await optimizeOne(f);
      if (r.skipped) {
        skipped += 1;
        continue;
      }
      processed += 1;
      totalBefore += r.before;
      totalAfter += r.after;
      if (r.finalDest !== f) {
        renames.push({ from: path.relative(process.cwd(), f), to: path.relative(process.cwd(), r.finalDest) });
      }
      console.log(
        `  ${path.relative(ROOT, f)}: ${fmt(r.before)} -> ${fmt(r.after)}`,
      );
    } catch (err) {
      console.error(`  FAILED ${f}:`, err.message);
    }
  }

  console.log(`\nDone. Processed ${processed}, skipped ${skipped}.`);
  if (processed > 0) {
    console.log(
      `Total: ${fmt(totalBefore)} -> ${fmt(totalAfter)} (${(
        (1 - totalAfter / totalBefore) * 100
      ).toFixed(1)}% smaller)`,
    );
    console.log(`Originals archived to: ${path.relative(process.cwd(), ARCHIVE_ROOT)}`);
  }
  if (renames.length > 0) {
    console.log(`\nNote: ${renames.length} file(s) had their extension changed (png/webp -> jpg). Update members.json paths if any of these are referenced:`);
    for (const r of renames) console.log(`  ${r.from}  ->  ${r.to}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
