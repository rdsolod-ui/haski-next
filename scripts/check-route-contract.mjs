import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));

const contract = await readJson("tests/contracts/legacy-routes.json");
const dogsData = await readJson("data/dogs.json");
const sectionsData = await readJson("data/sections.json");
const sitemap = await readFile(path.join(root, "out", "sitemap.xml"), "utf8");
const homeHtml = await readFile(path.join(root, "out", "index.html"), "utf8");

const yandexVerificationMatches = homeHtml.match(
  /<meta[^>]+name="yandex-verification"[^>]+content="1548cae7d5e0f979"[^>]*>/g,
) ?? [];
if (yandexVerificationMatches.length !== 1) {
  throw new Error(
    `Expected exactly one Yandex verification meta tag on the homepage, found ${yandexVerificationMatches.length}.`,
  );
}

for (const counterId of ["108579634", "109784590"]) {
  const noscriptMatches = homeHtml.match(
    new RegExp(`<img[^>]+src="https://mc\\.yandex\\.ru/watch/${counterId}"[^>]*>`, "g"),
  ) ?? [];
  if (noscriptMatches.length !== 1) {
    throw new Error(
      `Expected exactly one no-JS fallback for Metrika counter ${counterId}, found ${noscriptMatches.length}.`,
    );
  }
}

const expectedDogPaths = contract.paths.filter((route) => route.startsWith("/dogs/"));
const currentDogPaths = dogsData.dogs.map((dog) => `/dogs/${dog.slug || dog.id}`);
const expectedSectionPaths = contract.paths.filter((route) => route.startsWith("/sections/"));
const currentSectionPaths = sectionsData.sections.map((section) => `/sections/${section.id}`);

function assertSameSet(label, expected, actual) {
  const missing = expected.filter((item) => !actual.includes(item));
  const unexpected = actual.filter((item) => !expected.includes(item));
  if (missing.length || unexpected.length) {
    throw new Error(
      `${label} contract changed. Missing: ${missing.join(", ") || "none"}. ` +
        `Unexpected: ${unexpected.join(", ") || "none"}.`,
    );
  }
}

assertSameSet("Dog URL", expectedDogPaths, currentDogPaths);
assertSameSet("Section URL", expectedSectionPaths, currentSectionPaths);

for (const route of contract.paths) {
  const absoluteUrl = `${contract.baseUrl}${route}`;
  if (route !== "/search" && !sitemap.includes(`<loc>${absoluteUrl}</loc>`)) {
    throw new Error(`Legacy URL is missing from sitemap: ${absoluteUrl}`);
  }

  const outputFile = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  await stat(path.join(root, "out", outputFile)).catch(() => {
    throw new Error(`Legacy URL has no static HTML artifact: ${route} (${outputFile})`);
  });
}

if (sitemap.includes(`<loc>${contract.baseUrl}/search</loc>`)) {
  throw new Error("Functional /search route must be excluded from the indexable sitemap.");
}
const sitemapUrls = sitemap.match(/<loc>[^<]+<\/loc>/g) ?? [];
if (sitemapUrls.length !== 43) {
  throw new Error(`Expected 43 canonical sitemap URLs, found ${sitemapUrls.length}.`);
}

console.log(
  `Route contract OK: ${contract.paths.length} legacy URLs, ` +
    `${expectedDogPaths.length} immutable dog-card URLs.`,
);
