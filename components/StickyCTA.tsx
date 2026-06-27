"use client";

import { useEffect, useState } from "react";
import FavButton from "./FavButton";
import type { FavItem } from "./FavoritesProvider";
import { IconTicket } from "./Icons";

export default function StickyCTA({
  item,
  ticketHref,
  ticketText,
}: {
  item: FavItem;
  ticketHref: string;
  ticketText: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`stickycta glass ${show ? "is-visible" : ""}`}>
      <FavButton item={item} variant="sticky" />
      <a className="stickycta__ticket" href={ticketHref} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
        <IconTicket /><span>{ticketText}</span>
      </a>
    </div>
  );
}
