"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchDogs, allSections, allDogs, plural, type Dog } from "@/lib/data";
import DogCard from "./DogCard";
import SectionCard from "./SectionCard";
import { IconSearch, IconClose, IconPaw } from "./Icons";

const QUICK: { label: string; q: string }[] = [
  { label: "Голубоглазые", q: "голубые" },
  { label: "Упряжные", q: "упряжной" },
  { label: "Белоснежные", q: "белый" },
  { label: "Фотогеничные", q: "фото" },
  { label: "Спокойные", q: "спокой" },
  { label: "Активные", q: "энергич" },
];

export default function SearchClient() {
  const params = useSearchParams();
  const sections = useMemo(() => allSections(), []);
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [section, setSection] = useState(() => params.get("section") ?? "");

  // держим URL в синхроне (deep-link/назад), без перерисовки роутера
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (section) sp.set("section", section);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `/search?${qs}` : "/search");
  }, [query, section]);

  const hasSearch = query.trim() !== "" || section !== "";
  const results: Dog[] = useMemo(() => searchDogs(query, section || undefined), [query, section]);
  const total = allDogs().length;

  return (
    <div className="searchui">
      <div className="searchui__bar bezel">
        <div className="bezel__core searchui__barcore">
          <span className="searchui__icon"><IconSearch /></span>
          <input
            className="searchui__input"
            name="q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Кличка, порода, окрас, характер… например: Адель, самоед, голубые глаза"
            aria-label="Поиск собак"
            autoComplete="off"
            data-analytics="search"
          />
          {query ? (
            <button className="searchui__clear" onClick={() => setQuery("")} aria-label="Очистить"><IconClose /></button>
          ) : null}
        </div>
      </div>

      <div className="searchui__chips" role="group" aria-label="Разделы">
        <button className={`chip ${section === "" ? "is-active" : ""}`} onClick={() => setSection("")} data-analytics="filter">Все разделы</button>
        {sections.map((s) => (
          <button key={s.slug} className={`chip ${section === s.slug ? "is-active" : ""}`} onClick={() => setSection(s.slug)} data-analytics="filter">
            {s.short_name || s.name}
          </button>
        ))}
      </div>

      <div className="searchui__chips searchui__chips--quick" role="group" aria-label="Быстрые подборки">
        {QUICK.map((c) => (
          <button key={c.q} className={`chip chip--soft ${query.toLowerCase() === c.q ? "is-active" : ""}`} onClick={() => setQuery(c.q)} data-analytics="filter">
            {c.label}
          </button>
        ))}
      </div>

      {!hasSearch ? (
        <div className="searchui__discovery">
          <div className="searchui__reshead">
            <h2 className="h2">Разделы стаи</h2>
            <p className="muted">Откройте группу целиком — или наберите кличку выше.</p>
          </div>
          <div className="grid-cards">
            {sections.map((s) => <SectionCard key={s.slug} section={s} />)}
          </div>
        </div>
      ) : (
        <>
          <div className="searchui__reshead">
            <div>
              <span className="eyebrow">Результаты</span>
              <h2 className="h2">{results.length ? `Найдено: ${results.length}` : "Ничего не нашлось"}</h2>
            </div>
            <button className="btn btn--ghost" onClick={() => { setQuery(""); setSection(""); }} data-analytics="filter">Сбросить</button>
          </div>

          {results.length ? (
            <div className="grid-cards">
              {results.map((d) => <DogCard key={d.id} dog={d} />)}
            </div>
          ) : (
            <div className="searchui__empty bezel">
              <div className="bezel__core searchui__emptycore">
                <span className="searchui__emptyic"><IconPaw /></span>
                <h3 className="h3">Совпадений нет</h3>
                <p className="muted">Попробуйте другое слово, снимите фильтр раздела или выберите подборку.</p>
                <div className="searchui__chips">
                  {["хаски", "маламут", "самоед", "олень"].map((q) => (
                    <button key={q} className="chip" onClick={() => { setSection(""); setQuery(q); }}>{q}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <p className="searchui__count muted">В каталоге {total} {plural(total, "профиль", "профиля", "профилей")} · {sections.length} {plural(sections.length, "раздел", "раздела", "разделов")}</p>
    </div>
  );
}
