"use client";

import { useLayoutEffect, useRef, type ReactNode, type ElementType, type CSSProperties } from "react";

/**
 * Progressive enhancement: content is visible in HTML and remains visible
 * without JavaScript, IntersectionObserver, or when the bundle fails.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  style,
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const bounds = el.getBoundingClientRect();
    if (bounds.top < window.innerHeight * 0.96 && bounds.bottom > 0) return;

    let io: IntersectionObserver | undefined;
    try {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add("is-reveal-ready");
      io = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
      );
      io.observe(el);
    } catch {
      el.classList.remove("is-reveal-ready");
      el.style.removeProperty("transition-delay");
    }

    return () => io?.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
