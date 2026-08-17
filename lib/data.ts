import dogsJson from "@/data/dogs.json";
import sectionsJson from "@/data/sections.json";
import { img } from "./constants";

/* ------------------------------------------------------------------ */
/* Типы                                                               */
/* ------------------------------------------------------------------ */

export interface FunFact { emoji?: string; text?: string }
export interface QuickFact { icon?: string; value?: string; label?: string }

export interface Dog {
  id: string;
  section_id: string;
  slug: string;
  name_ru: string;
  name_alt?: string;
  name_latin?: string;
  name_en?: string;
  emoji?: string;
  order?: number;
  family?: string;
  quick_facts?: QuickFact[];
  about?: string;
  character?: string;
  fun_facts?: FunFact[];
  rules?: string[];
  photo?: string;
  gallery_count?: number;
  listing_badge?: string;
  breed_species?: string;
  sex?: string;
  passport_name?: string;
  birth_date?: string;
  age_text?: string;
  color?: string;
  eyes?: string;
  size_text?: string;
  exterior?: string;
  card_teaser?: string;
  hero_text?: string;
  appearance_text?: string;
  character_points?: string[];
  contact_note?: string;
  breed_block?: string;
  visitor_scenario?: string;
  photo_advice?: string;
  safety_text?: string;
  cta_text?: string;
  seo_title?: string;
  seo_description?: string;
  image_alt?: string;
  search_tags?: string[];
  is_dog?: boolean;
  match_tags?: string[];
  name_acc?: string;
  name_ins?: string;
  name_gen?: string;
  name_dat?: string;
}

export interface SectionRaw {
  id: string;
  name: string;
  short_name?: string;
  location?: string;
  order?: number;
  hero_badge?: string;
  intro?: string;
}

export interface Section extends SectionRaw {
  slug: string;
  cover: string | null;
  coverSlug: string | null;
  count: number;
}

/* ------------------------------------------------------------------ */
/* Источники                                                          */
/* ------------------------------------------------------------------ */

export const dogs: Dog[] = (dogsJson as { dogs: Dog[] }).dogs;
const sectionsRaw: SectionRaw[] = (sectionsJson as { sections: SectionRaw[] }).sections;

const byOrder = (a: Dog, b: Dog) => (a.order ?? 999) - (b.order ?? 999);

/* ------------------------------------------------------------------ */
/* Изображения                                                        */
/* Обложка/герой — gallery/<id>/01.webp. Галерея — 01..gallery_count. */
/* ------------------------------------------------------------------ */

export function coverUrl(dog: Dog): string {
  return img(`gallery/${dog.id}/01.webp`);
}

export function galleryUrls(dog: Dog): string[] {
  const n = Math.max(1, dog.gallery_count ?? 1);
  return Array.from({ length: n }, (_, i) =>
    img(`gallery/${dog.id}/${String(i + 1).padStart(2, "0")}.webp`)
  );
}

/* ------------------------------------------------------------------ */
/* Собаки                                                             */
/* ------------------------------------------------------------------ */

export function allDogs(): Dog[] {
  return [...dogs].sort(byOrder);
}

export function getDog(slug: string): Dog | undefined {
  return dogs.find((d) => (d.slug ?? d.id) === slug);
}

export function dogSlug(d: Dog): string {
  return d.slug ?? d.id;
}

export function isDog(d: Dog): boolean {
  if (typeof d.is_dog === "boolean") return d.is_dog;
  return d.section_id !== "other-inhabitants";
}

/** «собака»/«обитатель» в нужном падеже. */
export function entityNoun(d: Dog, c: "nom" | "gen" | "ins" | "acc" = "nom"): string {
  const forms = isDog(d)
    ? { nom: "собака", gen: "собаки", ins: "собакой", acc: "собаку" }
    : { nom: "обитатель", gen: "обитателя", ins: "обитателем", acc: "обитателя" };
  return forms[c];
}

export function breedLabel(d: Dog): string {
  return isDog(d) ? "Порода" : "Вид";
}

/* ------------------------------------------------------------------ */
/* Разделы (slug = id; cover и count выводим)                         */
/* ------------------------------------------------------------------ */

export function allSections(): Section[] {
  return [...sectionsRaw]
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .map((s) => {
      const inSection = dogs.filter((d) => d.section_id === s.id).sort(byOrder);
      return {
        ...s,
        slug: s.id,
        cover: inSection[0] ? coverUrl(inSection[0]) : null,
        coverSlug: inSection[0] ? dogSlug(inSection[0]) : null,
        count: inSection.length,
      };
    });
}

export function getSection(slug: string): Section | undefined {
  return allSections().find((s) => s.slug === slug);
}

export function dogsInSection(sectionId: string): Dog[] {
  return dogs.filter((d) => d.section_id === sectionId).sort(byOrder);
}

/* ------------------------------------------------------------------ */
/* Похожие (раздел + match_tags + окрас; обитатели отдельно)          */
/* ------------------------------------------------------------------ */

export function relatedDogs(dog: Dog, limit = 4): Dog[] {
  const self = dogSlug(dog);
  const tags = new Set((dog.match_tags ?? []).map((t) => t.toLowerCase()));

  const scored = dogs
    .filter((d) => dogSlug(d) !== self)
    .filter((d) => isDog(d) === isDog(dog)) // собак к собакам, обитателей к обитателям
    .map((d) => {
      let score = 0;
      if (d.section_id === dog.section_id) score += 4;
      for (const t of d.match_tags ?? []) if (tags.has(t.toLowerCase())) score += 2;
      if (d.color && dog.color && d.color === dog.color) score += 1;
      return { d, score };
    })
    .sort((a, b) => b.score - a.score || byOrder(a.d, b.d));

  let out = scored.map((x) => x.d);
  // если кандидатов того же типа мало (обитатели) — добиваем собаками
  if (out.length < limit) {
    const extra = dogs
      .filter((d) => dogSlug(d) !== self && !out.includes(d))
      .sort(byOrder);
    out = [...out, ...extra];
  }
  return out.slice(0, limit);
}

export function navDog(dog: Dog): { dog: Dog; label: string } | null {
  const ordered = allDogs();
  const i = ordered.findIndex((d) => dogSlug(d) === dogSlug(dog));
  if (i === -1) return null;
  const next = ordered[i + 1];
  const prev = ordered[i - 1];
  if (next) return { dog: next, label: "Следующая собака" };
  if (prev) return { dog: prev, label: "Предыдущая собака" };
  return null;
}

/* ------------------------------------------------------------------ */
/* Поиск (клиентский, по полному стогу)                               */
/* ------------------------------------------------------------------ */

function haystack(d: Dog): string {
  return [
    d.id, d.slug, d.name_ru, d.name_alt, d.name_latin, d.name_en, d.family,
    d.listing_badge, d.breed_species, d.passport_name, d.sex, d.color, d.eyes,
    d.exterior, d.card_teaser, d.character,
    ...(d.search_tags ?? []),
    ...((d.fun_facts ?? []).map((f) => f.text ?? "")),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function searchDogs(query: string, sectionSlug?: string): Dog[] {
  let pool = allDogs();
  if (sectionSlug) pool = pool.filter((d) => d.section_id === sectionSlug);

  const q = query.trim().toLowerCase();
  if (!q) return sectionSlug ? pool : [];

  return pool.filter((d) => haystack(d).includes(q));
}

/* ------------------------------------------------------------------ */
/* Утилиты                                                            */
/* ------------------------------------------------------------------ */

export function plural(n: number, one: string, two: string, five: string): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return five;
  if (b > 1 && b < 5) return two;
  if (b === 1) return one;
  return five;
}

export const TOTAL_DOGS = dogs.length;
export const TOTAL_SECTIONS = sectionsRaw.length;
