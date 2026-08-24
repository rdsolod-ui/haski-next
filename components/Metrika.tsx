"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/constants";
import { ANALYTICS_GOALS, type AnalyticsGoal, type AnalyticsParams } from "@/lib/analytics";

type MetrikaWindow = Window & {
  ym?: ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
  dataLayer?: unknown[];
  __haskiMetrikaInitialized?: boolean;
  __haskiMetrikaReady?: boolean;
  __haskiReachGoal?: (goal: AnalyticsGoal, params?: AnalyticsParams) => void;
};

const TAG_URL = "https://mc.yandex.ru/metrika/tag.js";
const WEBVISOR_COUNTER_ID = "109784590";

function counterTagUrl(id: string) {
  return `${TAG_URL}?id=${id}`;
}

function loadMetrika() {
  const metrikaWindow = window as MetrikaWindow;
  if (metrikaWindow.__haskiMetrikaInitialized) return;
  metrikaWindow.__haskiMetrikaInitialized = true;

  metrikaWindow.ym = metrikaWindow.ym || function (...args: unknown[]) {
    (metrikaWindow.ym!.a = metrikaWindow.ym!.a || []).push(args);
  };
  metrikaWindow.ym.l = Date.now();

  metrikaWindow.dataLayer = metrikaWindow.dataLayer || [];
  const orderedCounterIds = [
    WEBVISOR_COUNTER_ID,
    ...SITE.metrikaIds.filter((id) => id !== WEBVISOR_COUNTER_ID),
  ];

  for (const id of orderedCounterIds) {
    const tagUrl = counterTagUrl(id);
    if (!document.querySelector(`script[src="${tagUrl}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = tagUrl;
      document.head.appendChild(script);
    }

    const isWebvisorCounter = id === WEBVISOR_COUNTER_ID;
    metrikaWindow.ym(Number(id), "init", {
      ssr: true,
      webvisor: isWebvisorCounter,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
      ...(isWebvisorCounter
        ? {
            ecommerce: "dataLayer",
            referrer: document.referrer,
            url: window.location.href,
          }
        : {}),
    });
  }
}

export default function Metrika() {
  useEffect(() => {
    const metrikaWindow = window as MetrikaWindow;
    metrikaWindow.__haskiMetrikaReady = true;

    const reachGoal = (goal: AnalyticsGoal, params: AnalyticsParams = {}) => {
      loadMetrika();
      for (const id of SITE.metrikaIds) {
        metrikaWindow.ym?.(Number(id), "reachGoal", goal, params);
      }
    };
    metrikaWindow.__haskiReachGoal = reachGoal;

    const onAnalyticsClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-analytics]")
        : null;
      if (!target) return;

      const action = target.dataset.analytics;
      const common = { path: window.location.pathname };
      if (action === "buy-ticket") {
        reachGoal(ANALYTICS_GOALS.ticket, {
          ...common,
          location: target.dataset.analyticsLocation || "page",
        });
      } else if (action === "open-dog") {
        const href = target.getAttribute("href") || "";
        reachGoal(ANALYTICS_GOALS.dogOpen, {
          ...common,
          dog_slug: target.dataset.analyticsSlug || href.split("/").filter(Boolean).at(-1) || "unknown",
        });
      } else if (action === "open-section") {
        const href = target.getAttribute("href") || "";
        reachGoal(ANALYTICS_GOALS.sectionOpen, {
          ...common,
          section_slug: target.dataset.analyticsSection || href.split("/").filter(Boolean).at(-1) || "unknown",
        });
      }
    };
    document.addEventListener("click", onAnalyticsClick, true);

    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    const start = () => {
      loadMetrika();
      for (const event of events) window.removeEventListener(event, start);
    };
    for (const event of events) window.addEventListener(event, start, { once: true, passive: true });
    const timer = window.setTimeout(start, 6_000);
    return () => {
      metrikaWindow.__haskiMetrikaReady = false;
      if (metrikaWindow.__haskiReachGoal === reachGoal) delete metrikaWindow.__haskiReachGoal;
      document.removeEventListener("click", onAnalyticsClick, true);
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, start);
    };
  }, []);

  return null;
}
