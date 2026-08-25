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
    const copy = section?.querySelector<HTMLElement>(".haski-sequence-hero__copyblock");
    const hint = section?.querySelector<HTMLElement>(".haski-sequence-hero__hintwrap");
    const chapter = section?.querySelector<HTMLElement>(".haski-sequence-hero__chapter");
    if (!section || !media) return;

    let frame = 0;
    let enabled = false;
    let inViewport = false;
    let startY = 0;
    let travel = 1;
    let lastStep = -1;
    const steps = 72;

    const measure = () => {
      startY = section.getBoundingClientRect().top + window.scrollY;
      travel = Math.max(1, section.offsetHeight - window.innerHeight);
    };

    const update = () => {
      frame = 0;
      if (!inViewport) return;
      const rawProgress = Math.min(1, Math.max(0, (window.scrollY - startY) / travel));
      const step = Math.round(rawProgress * steps);
      if (step === lastStep) return;
      lastStep = step;
      const progress = step / steps;

      if (copy) {
        copy.style.opacity = String(Math.max(.18, 1 - Math.max(0, progress - .48) * 1.58));
        copy.style.transform = `translate3d(0, ${(-progress * 10).toFixed(2)}%, 0)`;
      }
      if (hint) hint.style.opacity = String(Math.max(0, 1 - progress * 6));
      if (chapter) {
        chapter.style.opacity = String(Math.max(0, Math.min(1, (progress - .62) * 3.4)));
        chapter.style.transform = `translate3d(0, ${((1 - progress) * 28).toFixed(1)}px, 0)`;
      }
      if (Number.isFinite(media.duration) && media.duration > 0) {
        const target = Math.min(media.duration - .04, progress * media.duration);
        if (Math.abs(media.currentTime - target) > .055) {
          if (typeof media.fastSeek === "function") media.fastSeek(target);
          else media.currentTime = target;
        }
      }
    };
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
    const refresh = () => {
      measure();
      lastStep = -1;
      requestUpdate();
    };
    const observeViewport = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) {
        window.addEventListener("scroll", requestUpdate, { passive: true });
        requestUpdate();
      } else {
        window.removeEventListener("scroll", requestUpdate);
      }
    }, { rootMargin: "25% 0px 25% 0px" });

    const enable = () => {
      if (enabled) return;
      enabled = true;
      media.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach((source) => {
        source.src = source.dataset.src ?? "";
      });
      section.classList.add("is-video-enabled");
      measure();
      observeViewport.observe(section);
      media.addEventListener("loadedmetadata", requestUpdate);
      window.addEventListener("resize", refresh, { passive: true });
      media.load();
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
      window.removeEventListener("resize", refresh);
      media.removeEventListener("loadedmetadata", requestUpdate);
      observeViewport.disconnect();
    };
  }, []);

  return null;
}
