"use client";

import { useEffect } from "react";

type NetworkInformation = { saveData?: boolean };

/** Hydrates only the scroll controller; the LCP headline remains server-rendered. */
export default function HeroScrub() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    if (reduced || connection?.saveData) return;

    const section = document.querySelector<HTMLElement>('[data-hero="pack-atlas"]');
    const media = section?.querySelector<HTMLVideoElement>(".haski-sequence-hero__video");
    if (!section || !media) return;

    let frame = 0;
    let active = false;
    const update = () => {
      frame = 0;
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
      section.style.setProperty("--hero-progress", progress.toFixed(4));
      if (Number.isFinite(media.duration) && media.duration > 0) {
        const target = Math.min(media.duration - .03, progress * media.duration);
        if (Math.abs(media.currentTime - target) > .035) media.currentTime = target;
      }
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const enable = () => {
      if (active) return;
      active = true;
      media.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach((source) => {
        source.src = source.dataset.src ?? "";
      });
      section.classList.add("is-video-enabled");
      media.addEventListener("loadedmetadata", update);
      window.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      media.load();
      update();
      window.removeEventListener("wheel", enable);
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
    };

    window.addEventListener("wheel", enable, { passive: true, once: true });
    window.addEventListener("touchstart", enable, { passive: true, once: true });
    window.addEventListener("pointerdown", enable, { passive: true, once: true });
    window.addEventListener("keydown", enable, { passive: true, once: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("wheel", enable);
      window.removeEventListener("touchstart", enable);
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      media.removeEventListener("loadedmetadata", update);
    };
  }, []);

  return null;
}
