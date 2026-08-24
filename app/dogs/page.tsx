import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import SearchClient from "@/components/SearchClient";
import JsonLd from "@/components/JsonLd";
import { IconTicket } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Собаки Хаски Лэнд — каталог хаски, маламутов и самоедов",
  description:
    "Каталог собак Хаски Лэнд: профили, характер, фотографии и поиск по кличке, породе и окрасу. Выберите любимцев до визита в Парк Сказка.",
  alternates: { canonical: "/dogs" },
  openGraph: { title: "Собаки Хаски Лэнд", url: SITE.baseUrl + "/dogs" },
};

export default function DogsPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE.baseUrl + "/" },
      { "@type": "ListItem", position: 2, name: "Собаки" },
    ],
  };

  return (
    <div className="section container">
      <JsonLd data={ld} />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span aria-current="page">Собаки</span>
      </nav>

      <header className="pagehero" data-index="Атлас стаи / 30 профилей">
        <h1 className="h1">Тридцать характеров. <span className="aurora-text">Кто ваш?</span></h1>
        <p className="lead">Не листайте безликий каталог. Смотрите в глаза, читайте характер и сохраняйте тех, с кем захочется встретиться в Парке Сказка.</p>
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
