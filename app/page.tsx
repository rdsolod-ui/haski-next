import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { allDogs, allSections, getDog, dogSlug, TOTAL_DOGS } from "@/lib/data";
import SequenceHero from "@/components/SequenceHero";
import Reveal from "@/components/Reveal";
import DogCard from "@/components/DogCard";
import SectionCard from "@/components/SectionCard";
import JsonLd from "@/components/JsonLd";
import { IconArrow, IconPaw, IconTicket, IconSearch, IconHeart, IconSparkle, IconMountain } from "@/components/Icons";

export const metadata: Metadata = {
  verification: {
    yandex: "1548cae7d5e0f979",
  },
};

const FEATURED = ["adel", "bolt", "emmi", "yuki", "lord", "chelsi", "puma"];

const FAQ = [
  { q: "Можно выбрать любимцев заранее?", a: "Да. Откройте атлас, изучите характеры и сохраните понравившихся в избранное. Список останется в этом браузере и поможет построить маршрут на месте." },
  { q: "Подойдёт ли знакомство ребёнку?", a: "Хаски Лэнд задуман как семейный маршрут. Перед поездкой покажите ребёнку профили животных и вместе выберите тех, с кем хочется познакомиться. На месте соблюдайте подсказки сотрудников." },
  { q: "Можно гладить и кормить животных?", a: "Не кормите животных и не просовывайте руки в вольеры. Формат близкого знакомства определяет сотрудник Хаски Лэнд — так спокойнее гостям и безопаснее питомцам." },
  { q: "Где купить билет?", a: "Кнопка «Купить билет» ведёт на официальную билетную витрину Парка Сказка. Актуальные условия визита проверяйте там перед поездкой." },
];

const PATHS = [
  { icon: <IconSparkle />, code: "01", title: "Зацепиться взглядом", text: "Откройте портреты без спешки. Взгляд, окрас и энергия часто выбирают любимца раньше, чем факты." },
  { icon: <IconHeart />, code: "02", title: "Узнать характер", text: "В каждом профиле — темперамент, привычки и подсказка для знакомства. Не каталог пород, а карта живых характеров." },
  { icon: <IconMountain />, code: "03", title: "Приехать своей стаей", text: "Сохраните любимцев, купите билет и приезжайте в Парк Сказка уже с личным маршрутом." },
];

export default function HomePage() {
  const dogs = allDogs();
  const sections = allSections();
  const featured = FEATURED.map((slug) => getDog(slug)).filter(Boolean) as NonNullable<ReturnType<typeof getDog>>[];

  const ld = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: SITE.fullName, url: SITE.baseUrl + "/", inLanguage: "ru-RU", description: "Цифровой атлас северных собак Хаски Лэнд в Парке Сказка." },
    { "@context": "https://schema.org", "@type": "ItemList", name: "Стая Хаски Лэнд", itemListElement: dogs.map((d, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.baseUrl}/dogs/${dogSlug(d)}`, name: d.name_ru })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <SequenceHero />

      <section className="pack-index panel-v2" aria-label="Имена стаи">
        <div className="container container--wide">
          <Reveal variant="clip" className="section-title section-title--split">
            <h2>Не выбирайте породу.<br /><span>Выберите характер.</span></h2>
            <p>У каждого — своё имя, взгляд и способ покорить гостей. Начните с того, кто позвал первым.</p>
          </Reveal>
          <Reveal as="nav" variant="soft" className="pack-names" aria-label="Все профили животных">
            {dogs.map((dog, index) => (
              <span key={dog.id}>
                <Link href={`/dogs/${dogSlug(dog)}`}><small>{String(index + 1).padStart(2, "0")}</small>{dog.name_ru}</Link>
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="character-atlas panel-v2 panel-v2--frost">
        <div className="container">
          <Reveal variant="soft" className="section-title">
            <h2>Знакомство начинается<br />ещё <span>до поездки</span></h2>
          </Reveal>
          <div className="path-grid">
            {PATHS.map((path, index) => (
              <Reveal as="article" key={path.code} delay={index * 90} variant={index === 1 ? "scale" : "rise"} className="path-card">
                <div className="path-card__top"><span>{path.code}</span><i>{path.icon}</i></div>
                <h3>{path.title}</h3>
                <p>{path.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="portrait-rail panel-v2">
        <div className="container container--wide">
          <Reveal variant="clip" className="section-title section-title--split">
            <h2>Семь причин<br /><span>задержаться</span></h2>
            <p>Листайте не по породам, а по эмоции. Карточка не обрезает животное: портрет остаётся цельным на любом экране.</p>
          </Reveal>
          <div className="atlas-grid">
            {featured.map((dog, index) => (
              <Reveal key={dog.id} variant={index === 0 ? "scale" : "rise"} delay={(index % 3) * 80} className={index === 0 ? "atlas-grid__feature" : ""}>
                <DogCard dog={dog} variant={index === 0 ? "feature" : "standard"} index={index} />
              </Reveal>
            ))}
          </div>
          <Reveal className="panel-action" variant="soft">
            <Link href="/dogs" className="text-link">Смотреть все {TOTAL_DOGS} профилей <IconArrow /></Link>
          </Reveal>
        </div>
      </section>

      <section className="route-scene panel-v2 panel-v2--night">
        <div className="container route-scene__grid">
          <Reveal variant="left" className="route-scene__copy">
            <h2>Сначала — имя.<br />Потом — <span>настоящая встреча.</span></h2>
            <p>Добавьте любимцев в избранное. На месте откройте список и превратите прогулку по Хаски Лэнд в личную экспедицию.</p>
            <Link className="btn btn--ghost btn--lg" href="/search">Собрать свою стаю <span className="btn__ic"><IconPaw /></span></Link>
          </Reveal>
          <Reveal variant="right" className="route-map" aria-hidden>
            <span className="route-map__orbit route-map__orbit--a" />
            <span className="route-map__orbit route-map__orbit--b" />
            <span className="route-map__point route-map__point--a">Выбор</span>
            <span className="route-map__point route-map__point--b">Встреча</span>
            <strong>ХАСКИ<br />ЛЭНД</strong>
          </Reveal>
        </div>
      </section>

      <section className="section-atlas panel-v2 panel-v2--frost">
        <div className="container">
          <Reveal variant="clip" className="section-title section-title--split">
            <h2>Одна стая.<br /><span>Разные миры.</span></h2>
            <p>Хаски, маламуты, самоеды, лайки, кеесхонды и другие обитатели — откройте раздел целиком.</p>
          </Reveal>
          <div className="section-atlas__grid">
            {sections.map((section, index) => <Reveal key={section.slug} delay={(index % 3) * 80} variant={index % 2 ? "scale" : "rise"}><SectionCard section={section} /></Reveal>)}
          </div>
          <div className="panel-action"><Link href="/sections" className="text-link">Открыть все разделы <IconArrow /></Link></div>
        </div>
      </section>

      <section className="faq-v2 panel-v2">
        <div className="container faq-v2__grid">
          <Reveal variant="left" className="section-title">
            <h2>Чтобы на месте<br />остались только <span>эмоции</span></h2>
          </Reveal>
          <Reveal variant="right" className="faq-v2__list">
            {FAQ.map((item, index) => (
              <details key={item.q} className="faq-v2__item" open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="closing-v2 panel-v2">
        <div className="container">
          <Reveal variant="scale" className="closing-v2__card">
            <h2>Ваша стая уже ждёт.</h2>
            <p>Выберите любимцев сегодня. Познакомьтесь по-настоящему — в Парке Сказка.</p>
            <div className="closing-v2__actions">
              <a className="btn btn--cta btn--lg" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Купить билет <span className="btn__ic"><IconTicket /></span></a>
              <Link className="btn btn--ghost btn--lg" href="/dogs">Открыть атлас <span className="btn__ic"><IconSearch /></span></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
