import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import SearchClient from "@/components/SearchClient";
import JsonLd from "@/components/JsonLd";
import { IconTicket } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Поиск собак Хаски Лэнд — каталог хаски, маламутов, самоедов",
  description:
    "Каталог собак Хаски Лэнд: ищите по кличке, породе, окрасу и характеру. Хаски, маламуты, самоеды, лайки, кеесхонды и другие обитатели Парка Сказка.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/dogs" },
  openGraph: { title: "Поиск собак Хаски Лэнд", url: SITE.baseUrl + "/dogs" },
};

export default function SearchPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE.baseUrl + "/" },
      { "@type": "ListItem", position: 2, name: "Поиск собак" },
    ],
  };

  return (
    <div className="section container">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span aria-current="page">Поиск</span>
      </nav>

      <header className="pagehero">
        <h1 className="h1">Найдите того, кто <span className="aurora-text">запомнится</span></h1>
        <p className="lead">Имя, порода, окрас или черта характера — одна строка приведёт к нужному профилю. А избранное сохранит маршрут до визита.</p>
        <div className="pagehero__actions">
          <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Купить билет <span className="btn__ic"><IconTicket /></span></a>
        </div>
      </header>

      <div style={{ marginTop: "clamp(28px,4vw,48px)" }}>
        <Suspense fallback={<div className="skeleton" style={{ height: 320, borderRadius: 24 }} />}>
          <SearchClient />
        </Suspense>
      </div>
    </div>
  );
}
