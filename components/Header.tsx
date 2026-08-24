"use client";

import Link from "@/components/StaticLink";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw } from "./Icons";

export default function Header() {
  const [pathname, setPathname] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setPathname(window.location.pathname));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const is = (p: string) => p === "/" ? pathname === "/" : pathname.startsWith(p);
  const dogsActive = is("/search") || is("/dogs");

  return (
    <header className={`siteheader ${scrolled ? "is-scrolled" : ""}`}>
      <div className="siteheader__pill glass">
        <Link href="/" className="brand" aria-label="ХаскиЛэнд — главная">
          <span className="brand__mark"><IconPaw /></span>
          <span className="brand__text">Хаски<span>Лэнд</span></span>
        </Link>

        <nav className="siteheader__nav" aria-label="Основная навигация">
          <Link href="/" className={is("/") ? "is-active" : ""} aria-current={is("/") ? "page" : undefined}>Главная</Link>
          <Link href="/visit" className={is("/visit") ? "is-active" : ""} aria-current={is("/visit") ? "page" : undefined}>Визит</Link>
          <Link href="/dogs" className={dogsActive ? "is-active" : ""} aria-current={dogsActive ? "page" : undefined}>Атлас</Link>
          <Link href="/sections" className={is("/sections") ? "is-active" : ""} aria-current={is("/sections") ? "page" : undefined}>Разделы</Link>
          <a href={SITE.parkUrl} target="_blank" rel="noopener noreferrer">Парк Сказка</a>
        </nav>

        <div className="siteheader__tools">
          <a className="btn btn--cta siteheader__cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket" aria-label="Купить билет в Парк Сказка">
            <span>Купить билет</span><span className="btn__ic"><IconTicket /></span>
          </a>
        </div>
      </div>
    </header>
  );
}
