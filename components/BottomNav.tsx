"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";
import { useFavorites } from "./FavoritesProvider";
import { IconHome, IconSearch, IconHeart, IconGrid, IconTicket } from "./Icons";

export default function BottomNav() {
  const pathname = usePathname();
  const { count, open, isOpen } = useFavorites();
  const is = (p: string) => pathname === p;

  return (
    <nav className="bottomnav glass" aria-label="Навигация Хаски Лэнд">
      <Link href="/" className={`bottomnav__tab ${is("/") ? "is-active" : ""}`} data-analytics="nav-home">
        <span className="bottomnav__ic"><IconHome /></span><span className="bottomnav__lbl">Главная</span>
      </Link>
      <Link href="/search" className={`bottomnav__tab ${is("/search") ? "is-active" : ""}`} data-analytics="nav-search">
        <span className="bottomnav__ic"><IconSearch /></span><span className="bottomnav__lbl">Поиск</span>
      </Link>
      <button className={`bottomnav__tab ${isOpen ? "is-active" : ""}`} onClick={open} aria-haspopup="dialog" data-analytics="favorite-open">
        <span className="bottomnav__ic">
          <IconHeart />
          {count > 0 ? <span className="bottomnav__badge">{count}</span> : null}
        </span>
        <span className="bottomnav__lbl">Избранное</span>
      </button>
      <Link href="/sections" className={`bottomnav__tab ${is("/sections") ? "is-active" : ""}`} data-analytics="open-section">
        <span className="bottomnav__ic"><IconGrid /></span><span className="bottomnav__lbl">Разделы</span>
      </Link>
      <a className="bottomnav__tab is-cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
        <span className="bottomnav__ic"><IconTicket /></span><span className="bottomnav__lbl">Билеты</span>
      </a>
    </nav>
  );
}
