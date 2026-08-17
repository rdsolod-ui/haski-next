import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import {
  allSections, getDog, dogSlug, TOTAL_DOGS, TOTAL_SECTIONS,
} from "@/lib/data";
import SequenceHero from "@/components/SequenceHero";
import ScrollStory from "@/components/ScrollStory";
import Reveal from "@/components/Reveal";
import DogCard from "@/components/DogCard";
import SectionCard from "@/components/SectionCard";
import JsonLd from "@/components/JsonLd";
import { IconArrow, IconPaw, IconTicket, IconSearch, IconHeart, IconSparkle, IconMountain } from "@/components/Icons";

const POPULAR = ["adel", "bolt", "emmi", "yuki", "lord", "chelsi", "puma", "oliver"];

const FAQ = [
  { q: "Что такое Хаски Лэнд?", a: "Хаски Лэнд — раздел Парка Сказка в Москве, где живут северные собаки: хаски, маламуты, самоеды, лайки и кеесхонды, а также другие обитатели. На сайте можно заранее познакомиться с их профилями и выбрать любимцев до визита." },
  { q: "Можно ли потрогать или погладить собак?", a: "Любой контакт с животными возможен только по правилам площадки и подсказке сотрудников. Заранее на сайте вы выбираете профили, а формат знакомства на месте определяют сотрудники Хаски Лэнд — это безопасно и для гостей, и для животных." },
  { q: "Как выбрать собаку до поездки?", a: "Откройте каталог, листайте карточки, добавляйте понравившихся в избранное (сохраняется в вашем браузере) и приходите со списком любимцев. Так визит проходит спокойнее и интереснее, особенно с детьми." },
  { q: "Подходит ли Хаски Лэнд для детей?", a: "Да, это семейный формат. Заранее показать ребёнку собак, выбрать «своего» любимца и обсудить правила бережного контакта — отличная подготовка к поездке." },
  { q: "Где купить билет?", a: "Билет в Парк Сказка покупается на официальной витрине. Кнопка «Купить билет» на сайте ведёт именно туда." },
  { q: "Сколько собак и разделов в Хаски Лэнд?", a: `Сейчас в каталоге ${TOTAL_DOGS} профилей и ${TOTAL_SECTIONS} разделов: сибирские хаски, аляскинские маламуты, самоеды, карело-финские лайки, кеесхонды и другие обитатели.` },
];

const SCENARIOS = [
  { icon: <IconPaw />, title: "Хочу выбрать собаку", text: "Листайте каталог и собирайте любимцев в избранное до приезда.", href: "/search", cta: "Открыть каталог" },
  { icon: <IconMountain />, title: "Хочу посмотреть разделы", text: "Хаски, маламуты, самоеды, лайки, кеесхонды и другие обитатели.", href: "/sections", cta: "Все разделы" },
  { icon: <IconHeart />, title: "Планирую визит с ребёнком", text: "Проверьте правила сопровождения, адрес и актуальные условия до поездки.", href: "/visit", cta: "Спланировать визит" },
];

export default function HomePage() {
  const sections = allSections();
  const popular = POPULAR.map((s) => getDog(s)).filter(Boolean) as NonNullable<ReturnType<typeof getDog>>[];

  const ld = [
    { "@context": "https://schema.org", "@type": "CollectionPage", name: SITE.fullName, url: SITE.baseUrl + "/", inLanguage: "ru-RU", description: "Каталог северных собак Хаски Лэнд в Парке Сказка." },
    { "@context": "https://schema.org", "@type": "ItemList", name: "Популярные собаки Хаски Лэнд", itemListElement: popular.map((d, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE.baseUrl}/dogs/${dogSlug(d)}`, name: d.name_ru })) },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ];

  return (
    <>
      <JsonLd data={ld} />

      <SequenceHero />

      {/* Сценарии визита — светлый «снег» */}
      <section className="panel panel--snow">
        <div className="container">
          <Reveal className="lede">
            <span className="eyebrow">С чего начать</span>
            <h2 className="h2">Выберите свой сценарий визита</h2>
            <p className="muted">Сайт помогает подготовиться к поездке заранее — чтобы в Хаски Лэнд вы пришли уже со своими любимцами.</p>
          </Reveal>
          <div className="bento">
            {SCENARIOS.map((s, i) => (
              <Reveal key={s.title} as="article" delay={i * 70} className="bento__cell bento__cell--third">
                <span className="bento__ic">{s.icon}</span>
                <h3 className="h3">{s.title}</h3>
                <p>{s.text}</p>
                <Link href={s.href} className="seccard__go" style={{ marginTop: "auto" }}>{s.cta} <IconArrow /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Разделы стаи — поверхность */}
      <section className="panel panel--pure" id="sections">
        <div className="container">
          <Reveal className="lede">
            <span className="eyebrow">Стая Хаски Лэнд</span>
            <h2 className="h2">{TOTAL_SECTIONS} разделов · {TOTAL_DOGS} профилей</h2>
            <p className="muted">От сибирских хаски до благородного оленя — каждый раздел можно открыть целиком.</p>
          </Reveal>
          <div className="grid-cards">
            {sections.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}><SectionCard section={s} /></Reveal>
            ))}
          </div>
          <div className="panel__foot">
            <Link href="/sections" className="btn btn--ghost">Все разделы <span className="btn__ic"><IconArrow /></span></Link>
          </div>
        </div>
      </section>

      {/* Pinned scroll-story — word-by-word reveal */}
      <ScrollStory />

      {/* Знакомьтесь со стаей — «снег» */}
      <section className="panel panel--snow">
        <div className="container">
          <Reveal className="lede">
            <span className="eyebrow">Любимцы гостей</span>
            <h2 className="h2">Познакомьтесь со стаей</h2>
            <p className="muted">Откройте профиль, посмотрите фото и характер — и добавьте в избранное.</p>
          </Reveal>
          <div className="grid-cards">
            {popular.map((d, i) => (
              <Reveal key={d.id} delay={(i % 4) * 60}><DogCard dog={d} /></Reveal>
            ))}
          </div>
          <div className="panel__foot">
            <Link href="/search" className="btn btn--ghost">Весь каталог <span className="btn__ic"><IconSearch /></span></Link>
          </div>
        </div>
      </section>

      {/* Перед визитом — тёмная панель (ритм свет/тьма) */}
      <section className="panel panel--night">
        <div className="container">
          <Reveal className="lede">
            <span className="eyebrow">Перед визитом</span>
            <h2 className="h2">Спокойная подготовка к поездке</h2>
          </Reveal>
          <div className="duo">
            <Reveal as="article" className="duo__col">
              <span className="duo__ic"><IconSparkle /></span>
              <h3 className="h3">Как выбрать любимца</h3>
              <p>Листайте каталог, открывайте профили, читайте характер и факты. Добавляйте понравившихся в избранное — список сохранится в браузере и будет под рукой в день визита.</p>
              <Link href="/search" className="duo__link">Начать выбор <IconArrow /></Link>
            </Reveal>
            <Reveal as="article" delay={90} className="duo__col">
              <span className="duo__ic"><IconHeart /></span>
              <h3 className="h3">Правила бережного контакта</h3>
              <p>Не кормите животных, не шумите рядом с вольерами, фотографируйте без вспышки. Любой близкий контакт — только по правилам площадки и подсказке сотрудников Хаски Лэнд.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ — «снег» */}
      <section className="panel panel--snow">
        <div className="container">
          <Reveal className="lede">
            <span className="eyebrow">Вопросы</span>
            <h2 className="h2">Частые вопросы</h2>
          </Reveal>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q} className="faq__item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Финальный CTA — единственный громкий янтарный момент */}
      <section className="panel panel--pure">
        <div className="container">
          <Reveal className="finalcta">
            <span className="finalcta__orb aurora-orb" style={{ width: "60%", height: "120%", left: "-10%", top: "-30%", background: "radial-gradient(circle, rgba(58,208,196,.5), transparent 70%)" }} />
            <span className="eyebrow" style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)", background: "rgba(255,255,255,.12)" }}>Живой цифровой вход в Хаски Лэнд</span>
            <h2 className="h2">Соберите свою стаю — и приезжайте в Парк Сказка</h2>
            <p>Выберите любимцев заранее, покажите детям северных собак и спланируйте маршрут. Билет — на официальной витрине Парка Сказка.</p>
            <div className="finalcta__actions">
              <a className="btn btn--cta btn--lg" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Купить билет <span className="btn__ic"><IconTicket /></span></a>
              <Link className="btn btn--ghost btn--lg" href="/search" data-analytics="search" style={{ color: "#fff", background: "rgba(255,255,255,.12)", borderColor: "rgba(255,255,255,.28)" }}>Выбрать любимца <span className="btn__ic"><IconPaw /></span></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
