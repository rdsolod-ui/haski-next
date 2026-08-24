"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { searchDogs, allSections, allDogs, plural, type Dog } from "@/lib/data";
import DogCard from "./DogCard";
import { IconSearch, IconClose, IconPaw } from "./Icons";
import { ANALYTICS_GOALS, trackGoal } from "@/lib/analytics";

export default function SearchClient() {
  const params = useSearchParams();
  const sections = useMemo(() => allSections(), []);
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [section, setSection] = useState(() => params.get("section") ?? "");
  const lastTrackedSearch = useRef("");

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

  useEffect(() => {
    const normalized = query.trim().toLocaleLowerCase("ru-RU");
    if (normalized.length < 2) return;
    const signature = `${normalized}|${section}`;
    const timer = window.setTimeout(() => {
      if (lastTrackedSearch.current === signature) return;
      lastTrackedSearch.current = signature;
      trackGoal(ANALYTICS_GOALS.search, {
        query: normalized,
        section_slug: section || "all",
        result_count: results.length,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [query, section, results.length]);

  const chooseSection = (nextSection: string) => {
    setSection(nextSection);
    trackGoal(ANALYTICS_GOALS.filter, {
      section_slug: nextSection || "all",
      action: "select",
    });
  };

  const resetFilters = () => {
    setQuery("");
    setSection("");
    trackGoal(ANALYTICS_GOALS.filter, { section_slug: "all", action: "reset" });
  };

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
          />
          {query ? (
            <button className="searchui__clear" onClick={() => setQuery("")} aria-label="Очистить"><IconClose /></button>
          ) : null}
        </div>
      </div>

      <div className="searchui__chips" role="group" aria-label="Разделы">
        <button className={`chip ${section === "" ? "is-active" : ""}`} onClick={() => chooseSection("")}>Все разделы</button>
        {sections.map((s) => (
          <button key={s.slug} className={`chip ${section === s.slug ? "is-active" : ""}`} onClick={() => chooseSection(s.slug)}>
            {s.short_name || s.name}
          </button>
        ))}
      </div>

      <div className="searchui__reshead">
        <div>
          <p className="section-no">Атлас / {results.length} из {total}</p>
          <h2 className="h2">{results.length ? (results.length === total ? "Вся стая" : `Найдено: ${results.length}`) : "Следов не найдено"}</h2>
        </div>
        {(query || section) ? <button className="btn btn--ghost" onClick={resetFilters}>Сбросить</button> : null}
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
