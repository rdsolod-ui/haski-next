import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import dogsJson from "../data/dogs.json" with { type: "json" };

const root = process.cwd();
const outputDirectory = path.join(root, "public", "media", "social", "dogs");
const escapeXml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const wrap = (value, limit = 36) => {
  const lines = [""];
  for (const word of String(value).split(/\s+/)) {
    const current = lines.at(-1) ?? "";
    if (current && `${current} ${word}`.length > limit && lines.length < 2) lines.push(word);
    else lines[lines.length - 1] = current ? `${current} ${word}` : word;
  }
  return lines.map(escapeXml);
};

await mkdir(outputDirectory, { recursive: true });

for (const dog of dogsJson.dogs) {
  const slug = dog.slug || dog.id;
  const name = escapeXml(dog.name_ru);
  const breed = escapeXml(dog.breed_species || dog.family || "Хаски Лэнд");
  const signal = wrap(dog.listing_badge || dog.card_teaser || "Живой характер северной стаи");
  const portrait = await sharp(path.join(root, "public", "media", "portraits-v2", `${slug}-900.webp`))
    .resize({ width: 510, height: 630, fit: "contain", background: "#dbe2e0" })
    .toBuffer();
  const overlay = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fade" x1="0" x2="1">
          <stop offset="0" stop-color="#080d12"/>
          <stop offset="0.62" stop-color="#080d12"/>
          <stop offset="1" stop-color="#080d12" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="870" height="630" fill="url(#fade)"/>
      <circle cx="82" cy="76" r="20" fill="#5ee8d1"/>
      <text x="118" y="84" fill="#f4f7f8" font-family="Arial, sans-serif" font-size="26" font-weight="700">ХАСКИ ЛЭНД · ПАРК СКАЗКА</text>
      <text x="64" y="280" fill="#f4f7f8" font-family="Arial, sans-serif" font-size="100" font-weight="900" letter-spacing="-4">${name}</text>
      <text x="68" y="342" fill="#5ee8d1" font-family="Arial, sans-serif" font-size="30" font-weight="700">${breed}</text>
      <text x="68" y="405" fill="#c7d0cf" font-family="Arial, sans-serif" font-size="27">
        <tspan x="68" dy="0">${signal[0] ?? ""}</tspan>
        <tspan x="68" dy="40">${signal[1] ?? ""}</tspan>
      </text>
      <text x="68" y="570" fill="#8f9b9a" font-family="Arial, sans-serif" font-size="22">haski.parkskazka.ru/dogs/${escapeXml(slug)}</text>
    </svg>`);

  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#080d12" } })
    .composite([
      { input: portrait, left: 690, top: 0 },
      { input: overlay, left: 0, top: 0 },
    ])
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputDirectory, `${slug}.jpg`));
}

console.log(`Generated ${dogsJson.dogs.length} personal social images in ${outputDirectory}.`);
