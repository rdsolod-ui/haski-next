"use client";

import { useFavorites, type FavItem } from "./FavoritesProvider";
import { IconHeart, IconHeartFill } from "./Icons";

export default function FavButton({
  item,
  variant = "card",
}: {
  item: FavItem;
  variant?: "card" | "hero" | "sticky";
}) {
  const { has, toggle } = useFavorites();
  const active = has(item.slug);

  const label = active ? `Убрать из избранного: ${item.name}` : `В избранное: ${item.name}`;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(item);
  };

  if (variant === "hero") {
    return (
      <button className={`btn btn--ghost favbtn-hero ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={label} data-analytics="favorite">
        {active ? <IconHeartFill /> : <IconHeart />}
        <span>{active ? "В избранном" : "В избранное"}</span>
      </button>
    );
  }

  if (variant === "sticky") {
    return (
      <button className={`stickycta__fav ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={label} data-analytics="favorite">
        {active ? <IconHeartFill /> : <IconHeart />}
      </button>
    );
  }

  return (
    <button className={`favbtn ${active ? "is-active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={label} data-analytics="favorite">
      {active ? <IconHeartFill /> : <IconHeart />}
    </button>
  );
}
