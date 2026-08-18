import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw } from "./Icons";

const HERO_LINES: { text: string; accent?: boolean }[][] = [
  [{ text: "Северная сказка," }],
  [{ text: "которую " }, { text: "выбирают", accent: true }],
  [{ text: "до визита" }],
];

/**
 * Poster-first hero: the 65 KB image is the only visual requested for LCP.
 * The former 135-frame sequence is intentionally not referenced by runtime
 * code, so reduced-motion, save-data and no-JS visitors receive the same
 * complete first screen without main-thread scroll work.
 */
export default function SequenceHero() {
  return (
    <section className="haski-sequence-hero is-static" data-hero="poster">
      <div className="haski-sequence-hero__sticky">
        <picture>
          <source media="(max-width: 600px)" type="image/avif" srcSet="/media/hero/haski-768.avif" />
          <source media="(max-width: 600px)" type="image/webp" srcSet="/media/hero/haski-768.webp" />
          <source type="image/avif" srcSet="/media/hero/haski-1440.avif" />
          <source type="image/webp" srcSet="/media/hero/haski-1440.webp" />
          <img
            className="haski-sequence-hero__poster"
            src="/img/haski-hero-final.webp"
            alt="Хаски с голубыми глазами — Хаски Лэнд в Парке Сказка"
            width={1920}
            height={1080}
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="haski-sequence-hero__backdrop" aria-hidden />
        <div className="haski-sequence-hero__overlay" aria-hidden />

        <div className="haski-sequence-hero__content">
          <div className="haski-sequence-hero__inner">
            <h1 className="display haski-sequence-hero__title">
              {HERO_LINES.map((segments, lineIndex) => (
                <span className="haski-sequence-hero__line" key={lineIndex}>
                  <span className="haski-sequence-hero__lineInner">
                    {segments.map((segment, segmentIndex) => (
                      <span key={segmentIndex} className={segment.accent ? "aurora-text" : undefined}>
                        {segment.text}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>

            <p className="haski-sequence-hero__lead">
              Стая хаски, маламутов и самоедов в сердце Москвы. Выберите любимцев — ещё до приезда.
            </p>

            <div className="haski-sequence-hero__actions">
              <a
                className="btn btn--cta btn--lg haski-sequence-hero__buy"
                href={SITE.ticketsUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="buy-ticket"
              >
                Купить билет <span className="btn__ic"><IconTicket /></span>
              </a>
              <Link className="btn btn--ghost btn--lg hc__ghost" href="/search" data-analytics="search">
                Выбрать любимца <span className="btn__ic"><IconPaw /></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
