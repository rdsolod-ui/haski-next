import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { allSections, TOTAL_DOGS, TOTAL_SECTIONS } from "@/lib/data";
import SectionCard from "@/components/SectionCard";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { IconTicket, IconSearch } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Разделы Хаски Лэнд — хаски, маламуты, самоеды, лайки, кеесхонды",
  description:
    "Все разделы Хаски Лэнд в Парке Сказка: сибирские хаски, аляскинские маламуты, самоеды, карело-финские лайки, кеесхонды и другие обитатели. Откройте группу и выберите любимцев.",
  alternates: { canonical: "/sections" },
  openGraph: { title: "Разделы Хаски Лэнд", url: SITE.baseUrl + "/sections" },
};

export default function SectionsPage() {
  const sections = allSections();
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE.baseUrl + "/" },
        { "@type": "ListItem", position: 2, name: "Разделы" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Разделы Хаски Лэнд",
      itemListElement: sections.map((s, i) => ({
        "@type": "ListItem", position: i + 1, url: `${SITE.baseUrl}/sections/${s.slug}`, name: s.name,
      })),
    },
  ];

  return (
    <div className="section container">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span aria-current="page">Разделы</span>
      </nav>

      <header className="pagehero">
        <span className="eyebrow">Стая Хаски Лэнд</span>
        <h1 className="h1">{TOTAL_SECTIONS} разделов <span className="aurora-text">северной стаи</span></h1>
        <p className="lead">От сибирских хаски до благородного оленя — {TOTAL_DOGS} профилей обитателей Парка Сказка. Откройте раздел целиком и соберите любимцев до визита.</p>
        <div className="pagehero__actions">
          <Link className="btn btn--ghost" href="/search">Открыть поиск <span className="btn__ic"><IconSearch /></span></Link>
          <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Купить билет <span className="btn__ic"><IconTicket /></span></a>
        </div>
      </header>

      <div className="grid-cards" style={{ marginTop: "clamp(28px,4vw,52px)" }}>
        {sections.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 70}><SectionCard section={s} /></Reveal>
        ))}
      </div>
    </div>
  );
}
