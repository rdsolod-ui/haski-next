"use client";

import {
  createContext, useContext, useEffect, useState, useCallback, type ReactNode,
} from "react";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { IconClose, IconHeart, IconTicket, IconArrow } from "./Icons";

export interface FavItem { slug: string; name: string; breed?: string; img?: string; url: string }

interface Ctx {
  items: FavItem[];
  has: (slug: string) => boolean;
  toggle: (item: FavItem) => void;
  remove: (slug: string) => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
  count: number;
}

const FavCtx = createContext<Ctx | null>(null);
const KEY = "haski_favorites";

export function useFavorites() {
  const ctx = useContext(FavCtx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  // синхронизация между вкладками
  useEffect(() => {
    const h = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) { try { setItems(JSON.parse(e.newValue)); } catch {} }
    };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);
  const toggle = useCallback((item: FavItem) => {
    setItems((prev) =>
      prev.some((i) => i.slug === item.slug)
        ? prev.filter((i) => i.slug !== item.slug)
        : [item, ...prev]
    );
    try {
      const id = SITE.metrikaId;
      // @ts-expect-error ym global
      if (typeof window.ym === "function") window.ym(Number(id), "reachGoal", "favorite");
    } catch {}
  }, []);
  const remove = useCallback((slug: string) => setItems((p) => p.filter((i) => i.slug !== slug)), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <FavCtx.Provider value={{ items, has, toggle, remove, open, close, isOpen, count: items.length }}>
      {children}
      <div className={`favdrawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="favdrawer__backdrop" onClick={close} />
        <aside className="favdrawer__panel" role="dialog" aria-modal="true" aria-label="Избранные собаки">
          <header className="favdrawer__head">
            <div>
              <p className="favdrawer__title">Избранное</p>
              <p className="favdrawer__sub">
                {items.length
                  ? `${items.length} ${plural(items.length, "любимец", "любимца", "любимцев")} — сохранено в этом браузере`
                  : "Сохраняется только на этом устройстве"}
              </p>
            </div>
            <button className="favdrawer__close" onClick={close} aria-label="Закрыть"><IconClose /></button>
          </header>

          <div className="favdrawer__body">
            {items.length === 0 ? (
              <div className="favdrawer__empty">
                <span className="favdrawer__emoji"><IconHeart /></span>
                <p className="h3">Пока пусто</p>
                <p className="muted">Нажимайте на сердечко на карточках — соберите свою стаю любимцев до визита в Хаски Лэнд.</p>
                <Link href="/search" className="btn btn--brand" onClick={close} data-analytics="search">
                  Открыть каталог <span className="btn__ic"><IconArrow /></span>
                </Link>
              </div>
            ) : (
              <div className="favdrawer__list">
                {items.map((it) => (
                  <Link key={it.slug} href={it.url} className="favrow" onClick={close} data-analytics="open-dog">
                    <span className="favrow__media">{it.img ? <img src={it.img} alt={it.name} loading="lazy" /> : null}</span>
                    <span className="favrow__info">
                      <span className="favrow__name">{it.name}</span>
                      {it.breed ? <span className="favrow__breed">{it.breed}</span> : null}
                    </span>
                    <button
                      className="favrow__remove"
                      aria-label={`Убрать ${it.name}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(it.slug); }}
                    ><IconClose /></button>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <footer className="favdrawer__foot">
              <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
                Купить билет в Парк Сказка <span className="btn__ic"><IconTicket /></span>
              </a>
              <Link className="btn btn--ghost" href="/search" onClick={close} data-analytics="search">Добавить ещё собак</Link>
            </footer>
          )}
        </aside>
      </div>
    </FavCtx.Provider>
  );
}

function plural(n: number, one: string, two: string, five: string) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return five;
  if (b > 1 && b < 5) return two;
  if (b === 1) return one;
  return five;
}
