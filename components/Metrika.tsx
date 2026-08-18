"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/constants";

type MetrikaWindow = Window & {
  ym?: ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
  __haskiMetrikaInitialized?: boolean;
  __haskiMetrikaReady?: boolean;
};

const TAG_URL = "https://mc.yandex.ru/metrika/tag.js";

function loadMetrika() {
  const metrikaWindow = window as MetrikaWindow;
  if (metrikaWindow.__haskiMetrikaInitialized) return;
  metrikaWindow.__haskiMetrikaInitialized = true;

  metrikaWindow.ym = metrikaWindow.ym || function (...args: unknown[]) {
    (metrikaWindow.ym!.a = metrikaWindow.ym!.a || []).push(args);
  };
  metrikaWindow.ym.l = Date.now();

  if (!document.querySelector(`script[src="${TAG_URL}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = TAG_URL;
    document.head.appendChild(script);
  }

  for (const id of SITE.metrikaIds) {
    metrikaWindow.ym(Number(id), "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }
}

export default function Metrika() {
  useEffect(() => {
    const metrikaWindow = window as MetrikaWindow;
    metrikaWindow.__haskiMetrikaReady = true;
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll"];
    const start = () => {
      loadMetrika();
      for (const event of events) window.removeEventListener(event, start);
    };
    for (const event of events) window.addEventListener(event, start, { once: true, passive: true });
    const timer = window.setTimeout(start, 6_000);
    return () => {
      metrikaWindow.__haskiMetrikaReady = false;
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, start);
    };
  }, []);

  return null;
}
