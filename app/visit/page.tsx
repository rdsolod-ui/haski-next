import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/constants";
import { IconArrow, IconHeart, IconMountain, IconSearch, IconTicket } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Спланировать визит в Хаски Лэнд — адрес, правила и билеты",
  description:
    "Подготовьтесь к визиту в Хаски Лэнд: адрес Парка Сказка, актуальные правила для детей, формат знакомства с животными и официальная ссылка на билеты.",
  alternates: { canonical: "/visit" },
  openGraph: { title: "Спланировать визит в Хаски Лэнд", url: `${SITE.baseUrl}/visit` },
};

const facts = [
  {
    title: "Где находится",
    text: `Хаски Лэнд находится в Парке Сказка по адресу: ${SITE.address}.`,
    icon: <IconMountain />,
  },
  {
    title: "Что можно делать",
    text: "Наблюдать за обитателями, узнавать факты об их жизни и характере и сохранять фотографии на память.",
    icon: <IconSearch />,
  },
  {
    title: "С детьми",
    text: "Детям до 14 лет нужен взрослый сопровождающий. Для детей ростом до 90 см действует условие прохода, указанное на официальной странице локации.",
    icon: <IconHeart />,
  },
];

export default function VisitPage() {
  const attractionLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Хаски Лэнд",
    url: `${SITE.baseUrl}/visit`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Крылатская, 18",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    containedInPlace: {
      "@type": "AmusementPark",
      name: "Парк Сказка",
      url: SITE.parkUrl,
    },
  };

  return (
    <div className="section container info-page">
      <JsonLd data={attractionLd} />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span><span aria-current="page">Визит</span>
      </nav>

      <header className="pagehero" data-index="Маршрут / подготовка к встрече">
        <h1 className="h1">Подготовьте маршрут. <span className="aurora-text">Оставьте место чуду.</span></h1>
        <p className="lead">
          Выберите любимцев, покажите их ребёнку, проверьте актуальные условия — и приезжайте без лишней суеты.
        </p>
        <div className="pagehero__actions">
          <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
            Купить билет <span className="btn__ic"><IconTicket /></span>
          </a>
          <Link className="btn btn--ghost" href="/search">Выбрать собак <span className="btn__ic"><IconSearch /></span></Link>
        </div>
      </header>

      <section className="info-section" aria-labelledby="visit-format">
        <div className="section-head">
          <div className="section-head__t">
            <p className="section-no">Три опоры визита</p>
            <h2 className="h2" id="visit-format">Как проходит знакомство</h2>
          </div>
        </div>
        <div className="bento">
          {facts.map((fact) => (
            <article className="bento__cell bento__cell--third" key={fact.title}>
              <span className="bento__ic">{fact.icon}</span>
              <h3 className="h3">{fact.title}</h3>
              <p>{fact.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="info-section info-split" aria-labelledby="visit-hours">
        <article className="info-card">
          <p className="section-no">Режим Парка Сказка</p>
          <h2 className="h2" id="visit-hours">Когда приезжать</h2>
          <p className="lead">{SITE.parkHoursRegular}<br />{SITE.parkHoursWeekend}</p>
          <p className="muted">Это режим всего Парка Сказка. Работа конкретной локации может меняться — проверьте её перед выездом.</p>
          <a className="seccard__go" href={SITE.officialHuskyUrl} target="_blank" rel="noopener noreferrer">
            Официальная страница Хаски Лэнд <IconArrow />
          </a>
        </article>
        <article className="info-card">
          <p className="section-no">Главное правило</p>
          <h2 className="h2">Бережный контакт</h2>
          <p className="lead">Следуйте указаниям сотрудников и правилам площадки. Не кормите животных, не шумите у вольеров и снимайте без вспышки.</p>
          <a className="seccard__go" href={SITE.officialFaqUrl} target="_blank" rel="noopener noreferrer">
            Вопросы и правила Парка Сказка <IconArrow />
          </a>
        </article>
      </section>

      <p className="source-note">
        Факты проверены 17 августа 2026 года по официальным страницам Парка Сказка. Перед поездкой сверяйте оперативные изменения на сайте парка.
      </p>
    </div>
  );
}
