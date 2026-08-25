import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/constants";
import { IconArrow, IconMountain, IconTicket } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Контакты Хаски Лэнд — адрес Парка Сказка и как добраться",
  description: `Хаски Лэнд находится в Парке Сказка: ${SITE.address}. Телефон, режим работы парка и официальная схема проезда.`,
  alternates: { canonical: "/contacts" },
  openGraph: { title: "Контакты Хаски Лэнд", url: `${SITE.baseUrl}/contacts` },
};

export default function ContactsPage() {
  return (
    <div className="section container info-page">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Контакты Хаски Лэнд", url: `${SITE.baseUrl}/contacts` }} />
      <nav className="crumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span aria-current="page">Контакты</span></nav>
      <header className="pagehero">
        <h1 className="h1">Север начинается <span className="aurora-text">на Крылатской</span></h1>
        <p className="lead">{SITE.address}. Сохраните маршрут — и приезжайте знакомиться с теми, кого уже выбрали в атласе.</p>
      </header>

      <section className="info-section info-split">
        <article className="info-card">
          <span className="bento__ic"><IconMountain /></span>
          <h2 className="h2">Как добраться</h2>
          <p>На официальной странице контактов есть маршруты от метро, расписание бесплатных автобусов, схема для автомобиля и информация о парковке.</p>
          <a className="seccard__go" href={SITE.officialContactsUrl} target="_blank" rel="noopener noreferrer">Открыть официальный маршрут <IconArrow /></a>
        </article>
        <article className="info-card">
          <h2 className="h2">Задать вопрос</h2>
          <p className="lead"><a href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a></p>
          <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
          <p className="muted">{SITE.parkHoursRegular}<br />{SITE.parkHoursWeekend}</p>
        </article>
      </section>

      <section className="info-section finalcta">
        <h2 className="h2">Пусть первая встреча начнётся сейчас</h2>
        <p>Сохраните несколько профилей — и приезжайте уже со своей маленькой стаей.</p>
        <div className="finalcta__actions">
          <Link className="btn btn--ghost btn--lg" href="/search">Открыть каталог</Link>
          <a className="btn btn--cta btn--lg" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer">Купить билет <span className="btn__ic"><IconTicket /></span></a>
        </div>
      </section>
    </div>
  );
}
