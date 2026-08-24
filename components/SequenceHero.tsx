import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw } from "./Icons";
import HeroScrub from "./HeroScrub";

export default function SequenceHero() {
  return (
    <section className="haski-sequence-hero is-scrubbed" data-hero="pack-atlas">
      <noscript><style>{`.haski-sequence-hero.is-scrubbed{height:100svh}.haski-sequence-hero__sticky{position:relative}`}</style></noscript>
      <div className="haski-sequence-hero__sticky">
        <picture>
          <source media="(max-width: 600px)" type="image/avif" srcSet="/media/hero/haski-768.avif" />
          <source media="(max-width: 600px)" type="image/webp" srcSet="/media/hero/haski-768.webp" />
          <source type="image/avif" srcSet="/media/hero/haski-1440.avif" />
          <source type="image/webp" srcSet="/media/hero/haski-1440.webp" />
          <img className="haski-sequence-hero__poster" src="/img/haski-hero-final.webp" alt="Северная собака Хаски Лэнд в Парке Сказка" width={1920} height={1080} sizes="100vw" loading="eager" fetchPriority="high" decoding="async" />
        </picture>
        <video className="haski-sequence-hero__video" muted playsInline preload="none" aria-hidden tabIndex={-1}>
          <source media="(max-width: 760px)" data-src="/media/hero-v2/haski-scroll-768.mp4" type="video/mp4" />
          <source data-src="/media/hero-v2/haski-scroll-1440.mp4" type="video/mp4" />
        </video>
        <div className="haski-sequence-hero__backdrop" aria-hidden />
        <div className="haski-sequence-hero__overlay" aria-hidden />
        <div className="haski-sequence-hero__content">
          <div className="haski-sequence-hero__copyblock">
            <p className="hero-coordinate">55°45′ N · Москва · Парк Сказка</p>
            <h1 className="display haski-sequence-hero__title">Найдите <span>своего</span><br />в нашей стае</h1>
            <p className="haski-sequence-hero__lead">30 живых характеров. Один визит, который ребёнок будет пересказывать ещё долго.</p>
            <div className="haski-sequence-hero__actions">
              <a className="btn btn--cta btn--lg" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Купить билет <span className="btn__ic"><IconTicket /></span></a>
              <Link className="btn btn--ghost btn--lg hc__ghost" href="/dogs" data-analytics="search">Открыть атлас <span className="btn__ic"><IconPaw /></span></Link>
            </div>
          </div>
          <p className="haski-sequence-hero__chapter" aria-hidden>Листайте. Север приближается.</p>
        </div>
        <div className="haski-sequence-hero__hintwrap" aria-hidden><span className="haski-sequence-hero__hintline" /><span>листайте</span></div>
      </div>
      <HeroScrub />
    </section>
  );
}
