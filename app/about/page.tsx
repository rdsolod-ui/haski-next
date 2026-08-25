import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/constants";
import { TOTAL_DOGS } from "@/lib/data";
import { IconArrow, IconHeart, IconPaw, IconSearch } from "@/components/Icons";

export const metadata: Metadata = {
  title: "О Хаски Лэнд — обитатели, специалисты и бережное знакомство",
  description: "Хаски Лэнд в Парке Сказка: северные собаки, другие обитатели, персональные профили и правила бережного знакомства.",
  alternates: { canonical: "/about" },
  openGraph: { title: "О Хаски Лэнд", url: `${SITE.baseUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="section container info-page">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "AboutPage", name: "О Хаски Лэнд", url: `${SITE.baseUrl}/about` }} />
      <nav className="crumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span aria-current="page">О Хаски Лэнд</span></nav>
      <header className="pagehero">
        <h1 className="h1">У каждого зверя — история. <span className="aurora-text">У вас — встреча.</span></h1>
        <p className="lead">Хаски Лэнд — северный мир внутри Парка Сказка. Здесь не просто смотрят на животных: запоминают имена, считывают характеры и находят любимцев.</p>
      </header>

      <section className="info-section info-split">
        <article className="info-card">
          <span className="bento__ic"><IconPaw /></span>
          <h2 className="h2">{TOTAL_DOGS} историй</h2>
          <p>У каждого обитателя — постоянная цифровая страница. QR-код у вольера открывает именно её, чтобы имя и история всегда были рядом.</p>
          <Link className="seccard__go" href="/search">Открыть каталог <IconArrow /></Link>
        </article>
        <article className="info-card">
          <span className="bento__ic"><IconHeart /></span>
          <h2 className="h2">Забота прежде кадра</h2>
          <p>Специалисты знают привычки и настроение каждого обитателя. Поэтому знакомство строится вокруг бережного наблюдения и правил площадки.</p>
          <a className="seccard__go" href={SITE.officialHuskyUrl} target="_blank" rel="noopener noreferrer">Проверить официальный источник <IconArrow /></a>
        </article>
      </section>

      <section className="info-section info-card">
        <h2 className="h2">Разные породы. Одна большая стая.</h2>
        <p className="lead">Сибирские хаски, маламуты, самоеды, лайки, кеесхонды и другие обитатели — выбирайте путь по породе или по характеру.</p>
        <div className="pagehero__actions">
          <Link className="btn btn--brand" href="/sections">Смотреть разделы <span className="btn__ic"><IconPaw /></span></Link>
          <Link className="btn btn--ghost" href="/search">Поиск по характеру <span className="btn__ic"><IconSearch /></span></Link>
        </div>
      </section>
    </div>
  );
}
