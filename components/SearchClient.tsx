"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { searchDogs, allSections, allDogs, plural, type Dog } from "@/lib/data";
import DogCard from "./DogCard";
import { IconSearch, IconClose, IconPaw } from "./Icons";

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

  const results: Dog[] = useMemo(
    () => query.trim() || section ? searchDogs(query, section || undefined) : allDogs(),
    [query, section],
  );
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
            placeholder="Найдите по имени, породе или характеру"
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

      <div className="searchui__reshead">
        <div>
          <p className="section-no">Атлас / {results.length} из {total}</p>
          <h2 className="h2">{results.length ? (results.length === total ? "Вся стая" : `Найдено: ${results.length}`) : "Следов не найдено"}</h2>
        </div>
        {(query || section) ? <button className="btn btn--ghost" onClick={() => { setQuery(""); setSection(""); }} data-analytics="filter">Сбросить</button> : null}
      </div>

      {results.length ? (
        <div className="grid-cards atlas-catalog">
          {results.map((d, index) => <DogCard key={d.id} dog={d} priority={index < 3} index={index} />)}
        </div>
      ) : (
            <div className="searchui__empty bezel">
              <div className="bezel__core searchui__emptycore">
                <span className="searchui__emptyic"><IconPaw /></span>
                <h3 className="h3">Стая ушла по другой тропе</h3>
                <p className="muted">Попробуйте имя, породу или снимите фильтр раздела.</p>
                <div className="searchui__chips">
                  {["хаски", "маламут", "самоед", "олень"].map((q) => (
                    <button key={q} className="chip" onClick={() => { setSection(""); setQuery(q); }}>{q}</button>
                  ))}
                </div>
              </div>
            </div>
      )}

      <p className="searchui__count muted">В каталоге {total} {plural(total, "профиль", "профиля", "профилей")} · {sections.length} {plural(sections.length, "раздел", "раздела", "разделов")}</p>
    </div>
  );
}
