import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import contract from "../contracts/legacy-routes.json";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const coreRoutes = ["/", "/visit", "/dogs", "/dogs/adel", "/sections/siberian-husky", "/search"];

test.describe("static release contract", () => {
  for (const route of coreRoutes) {
    test(`${route} renders without console or request failures`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error" && !message.text().includes("mc.yandex.ru")) errors.push(message.text());
      });
      page.on("requestfailed", (request) => {
        if (!request.url().includes("mc.yandex.ru")) errors.push(`${request.method()} ${request.url()}`);
      });

      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("main")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test("all historical routes return HTML", async ({ request }) => {
    for (const route of contract.paths) {
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      expect(response.headers()["content-type"], route).toContain("text/html");
    }
  });

  test("current ticket CTA and both Metrika counters are retained", async ({ page }) => {
    const tagRequests: string[] = [];
    await page.route(/https:\/\/mc\.yandex\.ru\/metrika\/tag\.js\?id=\d+/, async (route) => {
      tagRequests.push(route.request().url());
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.__ymCalls=window.__ymCalls||(window.ym&&window.ym.a)||[];window.ym=(...args)=>window.__ymCalls.push(args);",
      });
    });
    await page.goto("/");
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __haskiMetrikaReady?: boolean }).__haskiMetrikaReady)).toBe(true);
    await page.evaluate(() => window.dispatchEvent(new Event("pointerdown")));

    const ticket = page.getByRole("link", { name: "Купить билет", exact: true }).first();
    await expect(ticket).toHaveAttribute("href", "https://prices.parkskazka.com/");
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __ymCalls?: unknown[] }).__ymCalls?.length ?? 0)).toBe(2);
    const calls = await page.evaluate(() =>
      (window as typeof window & { __ymCalls?: unknown[][] }).__ymCalls ?? [],
    );
    expect(calls.map((call) => call[0])).toEqual([109784590, 108579634]);
    expect(calls[0][2]).toMatchObject({
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      accurateTrackBounce: true,
      trackLinks: true,
    });
    expect(calls[1][2]).toMatchObject({
      ssr: true,
      webvisor: false,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
    });
    expect(tagRequests.sort()).toEqual([
      "https://mc.yandex.ru/metrika/tag.js?id=108579634",
      "https://mc.yandex.ru/metrika/tag.js?id=109784590",
    ]);
  });

  test("product goals are sent once per interaction to both Metrika counters", async ({ page }) => {
    await page.route(/https:\/\/mc\.yandex\.ru\/metrika\/tag\.js\?id=\d+/, async (route) => {
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.__ymCalls=window.__ymCalls||(window.ym&&window.ym.a)||[];window.ym=(...args)=>window.__ymCalls.push(args);",
      });
    });

    const startMetrika = async () => {
      await expect.poll(() => page.evaluate(() =>
        Boolean((window as typeof window & { __haskiMetrikaReady?: boolean }).__haskiMetrikaReady),
      )).toBe(true);
      await page.evaluate(() => window.dispatchEvent(new Event("pointerdown")));
      await expect.poll(() => page.evaluate(() =>
        (window as typeof window & { __ymCalls?: unknown[] }).__ymCalls?.length ?? 0,
      )).toBeGreaterThanOrEqual(2);
    };
    const goalNames = () => page.evaluate(() =>
      ((window as typeof window & { __ymCalls?: unknown[][] }).__ymCalls ?? [])
        .filter((call) => call[1] === "reachGoal")
        .map((call) => call[2]),
    );
    const clickWithoutNavigation = async (selector: string) => {
      await page.locator(selector).first().evaluate((element) => {
        element.addEventListener("click", (event) => event.preventDefault(), { once: true });
        (element as HTMLElement).click();
      });
    };
    const clickDom = async (selector: string) => {
      await page.locator(selector).first().evaluate((element) => (element as HTMLElement).click());
    };

    await page.goto("/dogs");
    await startMetrika();
    await clickWithoutNavigation('[data-analytics="buy-ticket"]');
    await clickWithoutNavigation('[data-analytics="open-dog"]');
    await clickDom(".dogcard .favbtn");
    await clickDom(".dogcard .favbtn");
    await expect.poll(goalNames).toEqual([
      "ticket", "ticket",
      "dog_open", "dog_open",
      "favorite_add", "favorite_add",
      "favorite_remove", "favorite_remove",
    ]);

    await page.goto("/sections");
    await startMetrika();
    await clickWithoutNavigation('[data-analytics="open-section"]');
    await expect.poll(goalNames).toEqual(["section_open", "section_open"]);

    await page.goto("/search");
    await startMetrika();
    await page.getByRole("searchbox", { name: "Поиск собак" }).fill("Адель");
    await expect.poll(goalNames, { timeout: 3_000 }).toEqual(["search", "search"]);
    await page.getByRole("button", { name: "Хаски", exact: true }).click();
    await expect.poll(goalNames).toEqual(["search", "search", "filter", "filter"]);
  });

  test("search stays functional but is excluded from indexing signals", async ({ page, request }) => {
    await page.goto("/search");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /follow/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://haski.parkskazka.ru/dogs");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("https://haski.parkskazka.ru/search");
    expect(sitemap.match(/<loc>/g)).toHaveLength(43);

    await page.goto("/dogs/adel");
    await expect(page.locator('.crumbs a[href="/dogs"]')).toHaveText("Каталог");
    await expect(page.locator('.crumbs a[href="/search"]')).toHaveCount(0);
  });

  test("catalog opens with all 30 uncropped animal cards", async ({ page }) => {
    await page.goto("/dogs", { waitUntil: "networkidle" });
    await expect(page.locator(".dogcard")).toHaveCount(30);
    const media = page.locator(".dogcard__media img").first();
    await expect(media).toBeVisible();
    expect(await media.evaluate((image) => getComputedStyle(image).objectFit)).toBe("contain");
  });

  test("mobile catalog uses compact rows with usable touch targets", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dogs");
    const firstCard = page.locator(".atlas-catalog .dogcard").first();
    const box = await firstCard.boundingBox();
    expect(box?.height).toBeLessThanOrEqual(190);
    const favorite = firstCard.locator(".favbtn");
    const favoriteBox = await favorite.boundingBox();
    expect(favoriteBox?.width).toBeGreaterThanOrEqual(42);
    expect(favoriteBox?.height).toBeGreaterThanOrEqual(42);
  });

  test("dog profiles use at most five editorial chapters and personal social metadata", async ({ page }) => {
    await page.goto("/dogs/adel");
    await expect(page.locator(".dogchapter")).toHaveCount(5);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://haski.parkskazka.ru/media/social/dogs/adel.jpg");
    await expect(page.locator(".section-no, [data-index]")).toHaveCount(0);
  });

  test("hero scrub does not recalculate a progress variable on its parent", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })));
    await expect(page.locator('[data-hero="pack-atlas"]')).toHaveClass(/is-video-enabled/);
    expect(await page.locator('[data-hero="pack-atlas"]').evaluate((element) =>
      (element as HTMLElement).style.getPropertyValue("--hero-progress"),
    )).toBe("");
  });

  test("core pages have no serious automated accessibility violations", async ({ page }) => {
    for (const route of ["/", "/visit", "/dogs/adel", "/search"]) {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .analyze();
      expect(
        results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? "")),
        route,
      ).toEqual([]);
    }
  });
});

test("no-JS visitors see the complete hero and dog links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Найдите своего");
  await expect(page.locator('a[href="/dogs/adel"]').first()).toBeVisible();
  await context.close();
});

test("reduced motion disables reveal transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const reveal = page.locator(".reveal").first();
  await expect(reveal).toBeVisible();
  expect(await reveal.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
});

test("capture review screenshots", async ({ page }, testInfo) => {
  const output = path.join(process.cwd(), "reports", "screenshots");
  await mkdir(output, { recursive: true });
  for (const [name, route] of [["home", "/"], ["visit", "/visit"], ["dog-adel", "/dogs/adel"]] as const) {
    await page.goto(route);
    await page.screenshot({
      path: path.join(output, `${testInfo.project.name}-${name}.png`),
      fullPage: false,
      animations: "disabled",
    });
  }
});
