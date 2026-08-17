import { chromium } from "playwright";

const baseURL = process.env.LIVE_BASE_URL ?? "https://haski.parkskazka.ru";
const cdpURL = process.env.CDP_URL ?? "http://127.0.0.1:9223";
const outputDir = process.env.LIVE_SCREENSHOT_DIR ?? "C:/Users/admin/Downloads";
const requestedProfile = process.env.LIVE_PROFILE;
const stamp = new Date().toISOString().replaceAll(":", "").replaceAll(".", "-");

const browser = await chromium.connectOverCDP(cdpURL);
const context = await browser.newContext({
  colorScheme: "light",
  locale: "ru-RU",
  reducedMotion: "no-preference",
});

const results = [];
try {
  const profiles = [
    { name: "desktop", viewport: { width: 1440, height: 900 } },
    { name: "mobile", viewport: { width: 390, height: 844 } },
  ].filter((profile) => !requestedProfile || profile.name === requestedProfile);
  if (profiles.length === 0) throw new Error(`Unknown LIVE_PROFILE: ${requestedProfile}`);

  for (const profile of profiles) {
    const page = await context.newPage();
    await page.setViewportSize(profile.viewport);
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const metrikaRequests = [];

    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      failedRequests.push(`${request.failure()?.errorText ?? "failed"} ${request.url()}`);
    });
    page.on("request", (request) => {
      if (/mc\.yandex\.(?:ru|com)|yastatic\.net/.test(request.url())) {
        metrikaRequests.push(request.url());
      }
    });

    const home = await page.goto(baseURL, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
    await page.waitForTimeout(8000);
    const revealCount = await page.locator(".reveal").count();
    for (let index = 0; index < revealCount; index += 1) {
      await page.locator(".reveal").nth(index).scrollIntoViewIfNeeded();
      await page.waitForTimeout(70);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    const homeHTML = await page.content();
    const cta = page.getByRole("link", { name: "Купить билет", exact: true }).first();
    const dogLink = page.locator('a[href="/dogs/adel"]').first();
    const homeChecks = {
      status: home?.status(),
      title: await page.title(),
      ctaVisible: await cta.isVisible(),
      ctaText: (await cta.textContent())?.trim(),
      dogLinkVisible: await dogLink.isVisible(),
      counter108579634: homeHTML.includes("108579634"),
      counter109784590: homeHTML.includes("109784590"),
      tagLoads: metrikaRequests.filter((url) => url.includes("/metrika/tag.js")).length,
      counterHits108579634: metrikaRequests.filter((url) => url.includes("108579634")).length,
      counterHits109784590: metrikaRequests.filter((url) => url.includes("109784590")).length,
      metrikaState: await page.evaluate(() => ({
        initialized: window.__haskiMetrikaInitialized === true,
        ready: window.__haskiMetrikaReady === true,
        ymType: typeof window.ym,
        queuedCalls: Array.isArray(window.ym?.a) ? window.ym.a : null,
      })),
    };

    await page.screenshot({
      path: `${outputDir}/haski-live-${profile.name}-${stamp}.png`,
      fullPage: true,
    });

    const routeChecks = [];
    for (const route of ["/dogs/adel", "/visit", "/search"]) {
      const response = await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
      routeChecks.push({ route, status: response?.status(), title: await page.title() });
    }

    results.push({
      profile: profile.name,
      viewport: profile.viewport,
      home: homeChecks,
      routes: routeChecks,
      consoleErrors,
      pageErrors,
      failedRequests,
      metrikaRequests,
    });
    await page.close();
  }
} finally {
  await context.close();
}

console.log(JSON.stringify(results, null, 2));

const failed = results.some((result) =>
  result.home.status !== 200 ||
  !result.home.ctaVisible ||
  result.home.ctaText !== "Купить билет" ||
  !result.home.dogLinkVisible ||
  !result.home.counter108579634 ||
  !result.home.counter109784590 ||
  result.home.tagLoads !== 1 ||
  result.routes.some((route) => route.status !== 200) ||
  result.consoleErrors.length > 0 ||
  result.pageErrors.length > 0 ||
  result.failedRequests.length > 0
);

process.exit(failed ? 1 : 0);
