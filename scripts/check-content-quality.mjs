import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const data = JSON.parse(await readFile(path.join(root, "data", "dogs.json"), "utf8"));
const dogs = data.dogs;

if (!Array.isArray(dogs) || dogs.length !== 30) {
  throw new Error(`Expected 30 animal profiles, found ${Array.isArray(dogs) ? dogs.length : "invalid data"}.`);
}

const requiredFields = [
  "slug",
  "name_ru",
  "hero_text",
  "card_teaser",
  "about",
  "appearance_text",
  "character",
  "visitor_scenario",
  "photo_advice",
  "safety_text",
  "seo_title",
  "seo_description",
  "image_alt",
];

for (const dog of dogs) {
  for (const field of requiredFields) {
    if (typeof dog[field] !== "string" || dog[field].trim() === "") {
      throw new Error(`${dog.slug || dog.id}: required content field ${field} is empty.`);
    }
  }
  if (dog.cta_text !== "Купить билет") {
    throw new Error(`${dog.slug}: primary CTA must be exactly «Купить билет».`);
  }
  if (!dog.seo_title.includes(dog.name_ru)) {
    throw new Error(`${dog.slug}: SEO title must identify the animal.`);
  }
}

const forbiddenPatterns = [
  /этот блок должен/i,
  /профиль любят посетители/i,
  /lorem|placeholder|\bTODO\b|\bFIXME\b/i,
  /текстом обязательно/i,
  /арлекин глаза/i,
  /гетерохромия глаза/i,
  /настоящую ездовой/i,
  /размер, стройная/i,
  /\bЭто [^,]+, (?:самец|самка),/i,
];
const serialized = JSON.stringify(data);
for (const pattern of forbiddenPatterns) {
  if (pattern.test(serialized)) {
    throw new Error(`Forbidden editorial or grammar marker remains: ${pattern}.`);
  }
}

for (const field of ["hero_text", "card_teaser", "visitor_scenario", "seo_title", "seo_description"]) {
  const seen = new Map();
  for (const dog of dogs) {
    const value = dog[field].trim();
    const previous = seen.get(value);
    if (previous) throw new Error(`${field} is duplicated for ${previous} and ${dog.slug}.`);
    seen.set(value, dog.slug);
  }
}

console.log("Content quality OK: 30 profiles, unique SEO/copy, fixed CTA, no editorial markers.");
