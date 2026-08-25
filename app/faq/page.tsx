import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/constants";
import { IconArrow, IconTicket } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Вопросы о Хаски Лэнд — дети, правила, адрес и билеты",
  description: "Ответы перед визитом в Хаски Лэнд: формат знакомства, сопровождение детей, адрес, правила бережного контакта и официальный переход к билетам.",
  alternates: { canonical: "/faq" },
  openGraph: { title: "Вопросы о Хаски Лэнд", url: `${SITE.baseUrl}/faq` },
};

const FAQ = [
  { q: "Что такое Хаски Лэнд?", a: "Тематическая локация Парка Сказка, где можно наблюдать за северными собаками и другими обитателями, узнавать факты об их жизни и знакомиться с их характерами." },
  { q: "Можно ли приехать с ребёнком?", a: "Да. На официальной странице указано: детям до 14 лет обязательно сопровождение взрослого; для детей ростом до 90 см действует отдельное условие прохода со взрослым." },
  { q: "Можно ли гладить и кормить животных?", a: "Близкий контакт возможен только по правилам площадки и указанию сотрудников. Не кормите животных самостоятельно, не шумите у вольеров и фотографируйте без вспышки." },
  { q: "Где находится Хаски Лэнд?", a: `Внутри Парка Сказка по адресу: ${SITE.address}. Перед поездкой откройте официальную схему и раздел контактов парка.` },
  { q: "Где посмотреть актуальную цену?", a: "Мы не дублируем изменяемые цены. Актуальные варианты билетов доступны на официальной витрине Парка Сказка по кнопке «Купить билет»." },
  { q: "Как сохранить выбранных собак?", a: "Нажмите на сердечко в карточке или профиле. Избранное хранится в вашем браузере и не требует регистрации." },
];

export default function FaqPage() {
  return (
    <div className="section container info-page">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) }} />
      <nav className="crumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><span aria-current="page">Вопросы</span></nav>
      <header className="pagehero">
        <h1 className="h1">Все ответы — до того, как <span className="aurora-text">завоет стая</span></h1>
        <p className="lead">Коротко о детях, правилах, адресе и билетах. Всё, что меняется оперативно, подтверждайте на официальном сайте Парка Сказка.</p>
      </header>
      <section className="info-section faq" aria-label="Вопросы и ответы">
        {FAQ.map((item) => <details key={item.q} className="faq__item"><summary>{item.q}</summary><p>{item.a}</p></details>)}
      </section>
      <div className="pagehero__actions">
        <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer">Купить билет <span className="btn__ic"><IconTicket /></span></a>
        <a className="btn btn--ghost" href={SITE.officialFaqUrl} target="_blank" rel="noopener noreferrer">FAQ Парка Сказка <span className="btn__ic"><IconArrow /></span></a>
      </div>
    </div>
  );
}
