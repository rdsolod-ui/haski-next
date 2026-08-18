import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const { dogs } = JSON.parse(await readFile(path.join(root, "data", "dogs.json"), "utf8"));
const outputDirectory = path.join(root, "public", "media", "dogs");
const imageBase = "https://haski.parkskazka.ru/assets/images/gallery";
const widths = [480, 900];
const formats = ["webp", "avif"];

await mkdir(outputDirectory, { recursive: true });

const heroSource = path.join(root, "public", "img", "haski-hero-final.webp");
const heroOutputDirectory = path.join(root, "public", "media", "hero");
await mkdir(heroOutputDirectory, { recursive: true });
await Promise.all(
  [768, 1440].flatMap((width) => ["webp", "avif"].map(async (format) => {
    const pipeline = sharp(heroSource).resize({ width, withoutEnlargement: true });
    const output = path.join(heroOutputDirectory, `haski-${width}.${format}`);
    await (format === "avif"
      ? pipeline.avif({ quality: 56, effort: 5 })
      : pipeline.webp({ quality: 76, smartSubsample: true }))
      .toFile(output);
  })),
);
console.log("hero: responsive poster ready");

async function generateForDog(dog) {
  const slug = dog.slug || dog.id;
  const response = await fetch(`${imageBase}/${dog.id}/01.webp`);
  if (!response.ok) throw new Error(`${slug}: source returned HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());

  await Promise.all(
    widths.flatMap((width) =>
      formats.map(async (format) => {
        const output = path.join(outputDirectory, `${slug}-${width}.${format}`);
        const pipeline = sharp(source)
          .rotate()
          .resize(width, width, { fit: "cover", position: "attention", withoutEnlargement: true });
        await (format === "avif"
          ? pipeline.avif({ quality: 55, effort: 5 })
          : pipeline.webp({ quality: 76, smartSubsample: true }))
          .toFile(output);
      }),
    ),
  );
  console.log(`${slug}: responsive cover ready`);
}

for (let index = 0; index < dogs.length; index += 4) {
  await Promise.all(dogs.slice(index, index + 4).map(generateForDog));
}

console.log(`Generated ${dogs.length * widths.length * formats.length} responsive dog images.`);
