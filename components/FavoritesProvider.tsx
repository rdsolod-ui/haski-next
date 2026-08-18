"use client";

import {
  createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode,
} from "react";
import Link from "@/components/StaticLink";
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
type MetrikaWindow = Window & { ym?: (id: number, method: string, goal: string) => void };

export function useFavorites() {
  const ctx = useContext(FavCtx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setItems(JSON.parse(raw));
      } catch {}
      setReady(true);
    });
    return () => { active = false; };
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
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      openerRef.current?.focus();
    };
  }, [isOpen]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);
  const toggle = useCallback((item: FavItem) => {
    setItems((prev) =>
      prev.some((i) => i.slug === item.slug)
        ? prev.filter((i) => i.slug !== item.slug)
        : [item, ...prev]
    );
    try {
      const ym = (window as MetrikaWindow).ym;
      if (typeof ym === "function") {
        for (const id of SITE.metrikaIds) ym(Number(id), "reachGoal", "favorite");
      }
    } catch {}
  }, []);
  const remove = useCallback((slug: string) => setItems((p) => p.filter((i) => i.slug !== slug)), []);
  const open = useCallback(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <FavCtx.Provider value={{ items, has, toggle, remove, open, close, isOpen, count: items.length }}>
      {children}
      <div className={`favdrawer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="favdrawer__backdrop" onClick={close} />
        <aside ref={panelRef} className="favdrawer__panel" role="dialog" aria-modal="true" aria-labelledby="favorites-title">
          <header className="favdrawer__head">
            <div>
              <p className="favdrawer__title" id="favorites-title">Избранное</p>
              <p className="favdrawer__sub">
                {items.length
                  ? `${items.length} ${plural(items.length, "любимец", "любимца", "любимцев")} — сохранено в этом браузере`
                  : "Сохраняется только на этом устройстве"}
              </p>
            </div>
            <button ref={closeRef} className="favdrawer__close" onClick={close} aria-label="Закрыть избранное"><IconClose /></button>
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
                  <div key={it.slug} className="favrow">
                    <Link href={it.url} className="favrow__link" onClick={close} data-analytics="open-dog">
                      <span className="favrow__media">{it.img ? <img src={it.img} alt="" loading="lazy" width={60} height={60} /> : null}</span>
                      <span className="favrow__info">
                        <span className="favrow__name">{it.name}</span>
                        {it.breed ? <span className="favrow__breed">{it.breed}</span> : null}
                      </span>
                    </Link>
                    <button
                      className="favrow__remove"
                      aria-label={`Убрать ${it.name}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(it.slug); }}
                    ><IconClose /></button>
                  </div>
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
