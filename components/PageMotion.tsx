"use client";

import { useEffect } from "react";

/** One observer powers all editorial section and card reveals across the site. */
export default function PageMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;
    const activate = () => {
      const selectors = [
        ".reveal",
        "main .pagehero",
        "main .panel-v2 > .container",
        "main .info-section",
        "main .searchui .dogcard",
      ].join(",");
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(selectors));
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("motion-in");
          observer?.unobserve(entry.target);
        }
      }, { threshold: .06, rootMargin: "0px 0px -6% 0px" });
      nodes.forEach((node, index) => {
        if (node.closest(".reveal") && !node.classList.contains("reveal")) return;
        if (node.classList.contains("dogcard")) node.style.setProperty("--motion-delay", `${(index % 2) * 35}ms`);
        node.classList.add("motion-ready");
        observer?.observe(node);
      });
      window.removeEventListener("wheel", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
    };
    window.addEventListener("wheel", activate, { passive: true, once: true });
    window.addEventListener("touchstart", activate, { passive: true, once: true });
    window.addEventListener("pointerdown", activate, { passive: true, once: true });
    window.addEventListener("keydown", activate, { passive: true, once: true });
    return () => {
      window.removeEventListener("wheel", activate);
      window.removeEventListener("touchstart", activate);
      window.removeEventListener("pointerdown", activate);
      window.removeEventListener("keydown", activate);
      observer?.disconnect();
    };
  }, []);

  return null;
}
