"use client";

import { useEffect, useState } from "react";
import { IconTicket } from "./Icons";

export default function SubNav({
  title,
  buyHref,
  buyText,
  anchors = [],
}: {
  title: string;
  buyHref: string;
  buyText: string;
  anchors?: { href: string; label: string }[];
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-subnav", on);
    return () => document.body.classList.remove("has-subnav");
  }, [on]);

  return (
    <div className={`subnav ${on ? "is-on" : ""}`} aria-hidden={!on}>
      <div className="subnav__pill glass">
        <span className="subnav__title">{title}</span>
        {anchors.length ? (
          <nav className="subnav__anchors" aria-label="Разделы профиля">
            {anchors.map((a) => <a key={a.href} href={a.href}>{a.label}</a>)}
          </nav>
        ) : <span />}
        <a className="btn btn--cta subnav__buy" href={buyHref} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
          {buyText} <span className="btn__ic"><IconTicket /></span>
        </a>
      </div>
    </div>
  );
}
