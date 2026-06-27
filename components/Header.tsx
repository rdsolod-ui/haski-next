"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const is = (p: string) => pathname === p;

  return (
    <header className={`siteheader ${scrolled ? "is-scrolled" : ""}`}>
      <div className="siteheader__pill glass">
        <Link href="/" className="brand" aria-label="Хаски Лэнд — главная">
          <span className="brand__mark"><IconPaw /></span>
          <span className="brand__text">Хаски<span>Лэнд</span></span>
        </Link>

        <nav className="siteheader__nav" aria-label="Основная навигация">
          <Link href="/" className={is("/") ? "is-active" : ""}>Главная</Link>
          <Link href="/sections" className={is("/sections") ? "is-active" : ""}>Разделы</Link>
          <Link href="/search" className={is("/search") ? "is-active" : ""}>Поиск</Link>
          <a href={SITE.parkUrl} target="_blank" rel="noopener noreferrer">Парк Сказка</a>
        </nav>

        <div className="siteheader__tools">
          <a className="btn btn--cta siteheader__cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
            <span>Билеты</span><span className="btn__ic"><IconTicket /></span>
          </a>
        </div>
      </div>
    </header>
  );
}
