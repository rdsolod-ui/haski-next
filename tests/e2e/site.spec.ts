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
    let tagRequests = 0;
    await page.route("https://mc.yandex.ru/metrika/tag.js", async (route) => {
      tagRequests += 1;
      await route.fulfill({
        contentType: "application/javascript",
        body: "window.__ymCalls=(window.ym&&window.ym.a)||[];window.ym=(...args)=>window.__ymCalls.push(args);",
      });
    });
    await page.goto("/");
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __haskiMetrikaReady?: boolean }).__haskiMetrikaReady)).toBe(true);
    await page.evaluate(() => window.dispatchEvent(new Event("pointerdown")));

    const ticket = page.getByRole("link", { name: "Купить билет", exact: true }).first();
    await expect(ticket).toHaveAttribute("href", "https://prices.parkskazka.com/");
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __ymCalls?: unknown[] }).__ymCalls?.length ?? 0)).toBe(2);
    const ids = await page.evaluate(() =>
      ((window as typeof window & { __ymCalls?: unknown[][] }).__ymCalls ?? []).map((call) => call[0]),
    );
    expect(ids).toEqual([108579634, 109784590]);
    expect(tagRequests).toBe(1);
  });

  test("catalog opens with all 30 uncropped animal cards", async ({ page }) => {
    await page.goto("/dogs", { waitUntil: "networkidle" });
    await expect(page.locator(".dogcard")).toHaveCount(30);
    const media = page.locator(".dogcard__media img").first();
    await expect(media).toBeVisible();
    expect(await media.evaluate((image) => getComputedStyle(image).objectFit)).toBe("contain");
  });

  test("core pages have no serious automated accessibility violations", async ({ page }) => {
    for (const route of ["/", "/visit", "/dogs/adel", "/search"]) {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
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
