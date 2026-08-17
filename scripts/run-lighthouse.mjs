import { createReadStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { createGzip } from "node:zlib";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const root = path.join(process.cwd(), "out");
const reportDirectory = path.join(process.cwd(), "reports", "lighthouse");
const port = 4174;

const mimeTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname);
  let relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  if (!path.extname(relative)) relative += ".html";
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${path.resolve(root)}${path.sep}`) && file !== path.join(root, "index.html")) {
    response.writeHead(403).end();
    return;
  }
  const stream = createReadStream(file);
  stream.on("open", () => {
    const contentType = mimeTypes[path.extname(file)] ?? "application/octet-stream";
    const compress = /^(text\/|application\/(?:json|javascript|manifest\+json|xml))/.test(contentType);
    response.writeHead(200, {
      "Content-Type": contentType,
      ...(compress ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
    });
    if (compress) stream.pipe(createGzip({ level: 6 })).pipe(response);
    else stream.pipe(response);
  });
  stream.on("error", () => response.writeHead(404).end("Not found"));
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
await mkdir(reportDirectory, { recursive: true });

const chrome = await chromeLauncher.launch({
  chromePath: process.env.CHROME_PATH || undefined,
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage"],
});

const profiles = [
  {
    name: "mobile",
    flags: {
      formFactor: "mobile",
      screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 2.75, disabled: false },
    },
  },
  {
    name: "desktop",
    flags: { preset: "desktop" },
  },
];

const thresholds = {
  performance: 0.9,
  accessibility: 1,
  "best-practices": 0.95,
  seo: 1,
};

const failures = [];
try {
  for (const profile of profiles) {
    const runs = [];
    for (let run = 1; run <= 3; run += 1) {
      const result = await lighthouse(`http://127.0.0.1:${port}/`, {
        port: chrome.port,
        output: ["json", "html"],
        logLevel: "error",
        onlyCategories: Object.keys(thresholds),
        throttlingMethod: "simulate",
        ...profile.flags,
      });
      if (!result) throw new Error(`Lighthouse returned no result for ${profile.name}, run ${run}`);

      const [json, html] = result.report;
      const scores = Object.fromEntries(
        Object.keys(thresholds).map((category) => [category, result.lhr.categories[category].score ?? 0]),
      );
      const metrics = {
        lcpMs: Math.round(result.lhr.audits["largest-contentful-paint"].numericValue ?? 0),
        tbtMs: Math.round(result.lhr.audits["total-blocking-time"].numericValue ?? 0),
        cls: Number((result.lhr.audits["cumulative-layout-shift"].numericValue ?? 0).toFixed(3)),
      };
      runs.push({ scores, metrics, json, html });
      await writeFile(path.join(reportDirectory, `${profile.name}-run-${run}.json`), json, "utf8");
      await writeFile(path.join(reportDirectory, `${profile.name}-run-${run}.html`), html, "utf8");
      console.log(`${profile.name} run ${run}: ${JSON.stringify({ scores, metrics })}`);
    }

    runs.sort((a, b) => a.scores.performance - b.scores.performance);
    const { scores, metrics, json, html } = runs[1];
    await writeFile(path.join(reportDirectory, `${profile.name}.json`), json, "utf8");
    await writeFile(path.join(reportDirectory, `${profile.name}.html`), html, "utf8");
    console.log(`${profile.name} median: ${JSON.stringify({ scores, metrics })}`);

    for (const [category, minimum] of Object.entries(thresholds)) {
      if (scores[category] < minimum) failures.push(`${profile.name} ${category}: ${scores[category]} < ${minimum}`);
    }
    if (metrics.lcpMs > 2500) failures.push(`${profile.name} LCP: ${metrics.lcpMs} ms > 2500 ms`);
    if (metrics.tbtMs > 200) failures.push(`${profile.name} TBT: ${metrics.tbtMs} ms > 200 ms`);
    if (metrics.cls > 0.1) failures.push(`${profile.name} CLS: ${metrics.cls} > 0.1`);
  }
} finally {
  try {
    await chrome.kill();
  } catch (error) {
    console.warn(`Chrome cleanup warning: ${error instanceof Error ? error.message : String(error)}`);
  }
  await new Promise((resolve) => server.close(resolve));
}

if (failures.length) throw new Error(`Lighthouse budget failed:\n- ${failures.join("\n- ")}`);
console.log("Lighthouse budgets OK for mobile and desktop.");
