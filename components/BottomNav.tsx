"use client";

import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { useFavorites } from "./FavoritesProvider";
import { IconHome, IconSearch, IconHeart, IconMountain, IconTicket } from "./Icons";
import { useEffect, useState } from "react";

export default function BottomNav() {
  const [pathname, setPathname] = useState("");
  const { count, open, isOpen } = useFavorites();
  const is = (p: string) => pathname === p;

  useEffect(() => {
    queueMicrotask(() => setPathname(window.location.pathname));
  }, []);

  return (
    <nav className="bottomnav glass" aria-label="Навигация Хаски Лэнд">
      <Link href="/" className={`bottomnav__tab ${is("/") ? "is-active" : ""}`} aria-current={is("/") ? "page" : undefined} data-analytics="nav-home">
        <span className="bottomnav__ic"><IconHome /></span><span className="bottomnav__lbl">Главная</span>
      </Link>
      <Link href="/dogs" className={`bottomnav__tab ${is("/search") || pathname.startsWith("/dogs") ? "is-active" : ""}`} aria-current={is("/search") || pathname.startsWith("/dogs") ? "page" : undefined} data-analytics="nav-search">
        <span className="bottomnav__ic"><IconSearch /></span><span className="bottomnav__lbl">Поиск</span>
      </Link>
      <button className={`bottomnav__tab ${isOpen ? "is-active" : ""}`} onClick={open} aria-haspopup="dialog" aria-expanded={isOpen} data-analytics="favorite-open">
        <span className="bottomnav__ic">
          <IconHeart />
          {count > 0 ? <span className="bottomnav__badge">{count}</span> : null}
        </span>
        <span className="bottomnav__lbl">Избранное</span>
      </button>
      <Link href="/visit" className={`bottomnav__tab ${is("/visit") ? "is-active" : ""}`} aria-current={is("/visit") ? "page" : undefined} data-analytics="nav-visit">
        <span className="bottomnav__ic"><IconMountain /></span><span className="bottomnav__lbl">Визит</span>
      </Link>
      <a className="bottomnav__tab is-cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
        <span className="bottomnav__ic"><IconTicket /></span><span className="bottomnav__lbl">Билеты</span>
      </a>
    </nav>
  );
}
