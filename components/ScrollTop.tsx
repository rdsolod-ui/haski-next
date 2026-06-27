"use client";

import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
  };

  return (
    <button
      className={`scrolltop glass ${show ? "is-on" : ""}`}
      onClick={toTop}
      aria-label="Наверх"
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V6M6 12l6-6 6 6" />
      </svg>
    </button>
  );
}
