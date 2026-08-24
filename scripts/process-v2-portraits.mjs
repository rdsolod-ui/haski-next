import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const sourceDir = path.join(root, "source", "portraits-v2");
const outputDir = path.join(root, "public", "media", "portraits-v2");
const dogData = JSON.parse(await readFile(path.join(root, "data", "dogs.json"), "utf8"));
const expected = dogData.dogs.map((dog) => dog.slug ?? dog.id).sort();
const sources = (await readdir(sourceDir)).filter((name) => name.endsWith(".png")).sort();
const actual = sources.map((name) => path.parse(name).name);
const missing = expected.filter((slug) => !actual.includes(slug));
const extra = actual.filter((slug) => !expected.includes(slug));

if (missing.length || extra.length) {
  throw new Error(`Portrait contract failed. Missing: ${missing.join(", ") || "none"}; extra: ${extra.join(", ") || "none"}`);
}

for (const slug of expected) {
  const input = path.join(sourceDir, `${slug}.png`);
  for (const [width, height] of [[480, 600], [900, 1125]]) {
    const base = sharp(input)
      .rotate()
      .resize({ width, height, fit: "contain", position: "centre", background: "#dbe2e0" });
    await base.clone().avif({ quality: 56, effort: 5 }).toFile(path.join(outputDir, `${slug}-${width}.avif`));
    await base.clone().webp({ quality: 84, smartSubsample: true }).toFile(path.join(outputDir, `${slug}-${width}.webp`));
  }
  process.stdout.write(`processed ${slug}\n`);
}

process.stdout.write(`Portrait contract OK: ${expected.length} identities, 120 optimized files.\n`);
