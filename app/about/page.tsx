import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/constants";
import { TOTAL_DOGS, TOTAL_SECTIONS } from "@/lib/data";
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
        <span className="eyebrow">О локации</span>
        <h1 className="h1">Знакомство со стаей <span className="aurora-text">начинается здесь</span></h1>
        <p className="lead">Хаски Лэнд — тематическая локация Парка Сказка, где гости наблюдают за северными собаками и другими обитателями, узнают их характеры и истории.</p>
      </header>

      <section className="info-section info-split">
        <article className="info-card">
          <span className="bento__ic"><IconPaw /></span>
          <h2 className="h2">{TOTAL_DOGS} профилей</h2>
          <p>Каталог сохраняет имена и постоянные адреса страниц собак. По этим адресам работают QR-коды на вольерах.</p>
          <Link className="seccard__go" href="/search">Открыть каталог <IconArrow /></Link>
        </article>
        <article className="info-card">
          <span className="bento__ic"><IconHeart /></span>
          <h2 className="h2">Забота и наблюдение</h2>
          <p>По официальной информации, об обитателях заботятся специалисты, которые рассказывают гостям об их привычках и особенностях характера.</p>
          <a className="seccard__go" href={SITE.officialHuskyUrl} target="_blank" rel="noopener noreferrer">Проверить официальный источник <IconArrow /></a>
        </article>
      </section>

      <section className="info-section info-card">
        <span className="eyebrow">Навигация</span>
        <h2 className="h2">{TOTAL_SECTIONS} разделов стаи</h2>
        <p className="lead">Сибирские хаски, маламуты, самоеды, лайки, кеесхонды и другие обитатели собраны в понятные разделы.</p>
        <div className="pagehero__actions">
          <Link className="btn btn--brand" href="/sections">Смотреть разделы <span className="btn__ic"><IconPaw /></span></Link>
          <Link className="btn btn--ghost" href="/search">Поиск по характеру <span className="btn__ic"><IconSearch /></span></Link>
        </div>
      </section>
    </div>
  );
}
