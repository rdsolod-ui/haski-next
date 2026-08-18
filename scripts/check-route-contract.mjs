import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const readJson = async (file) => JSON.parse(await readFile(path.join(root, file), "utf8"));

const contract = await readJson("tests/contracts/legacy-routes.json");
const dogsData = await readJson("data/dogs.json");
const sectionsData = await readJson("data/sections.json");
const sitemap = await readFile(path.join(root, "out", "sitemap.xml"), "utf8");

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
  if (!sitemap.includes(`<loc>${absoluteUrl}</loc>`)) {
    throw new Error(`Legacy URL is missing from sitemap: ${absoluteUrl}`);
  }

  const outputFile = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  await stat(path.join(root, "out", outputFile)).catch(() => {
    throw new Error(`Legacy URL has no static HTML artifact: ${route} (${outputFile})`);
  });
}

console.log(
  `Route contract OK: ${contract.paths.length} legacy URLs, ` +
    `${expectedDogPaths.length} immutable dog-card URLs.`,
);
