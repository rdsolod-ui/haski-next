import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { IconPaw, IconTicket, IconSearch } from "./Icons";

export default function Footer() {
  return (
    <footer className="sitefooter">
      <div className="container">
        <div className="sitefooter__grid bezel">
          <div className="bezel__core sitefooter__core">
            <div className="sitefooter__brandcol">
              <Link href="/" className="brand brand--footer" aria-label="ХаскиЛэнд — главная">
                <span className="brand__mark"><IconPaw /></span>
                <span className="brand__text">Хаски<span>Лэнд</span></span>
              </Link>
              <p className="muted">Цифровой атлас живых характеров. Выберите любимцев до поездки — и приезжайте в Парк Сказка уже со своей стаей.</p>
              <a className="sitefooter__phone" href={`tel:${SITE.phoneHref}`}>{SITE.phone}</a>
            </div>

            <nav className="sitefooter__nav" aria-label="Навигация по сайту">
              <span className="sitefooter__navtitle">Проложить маршрут</span>
              <Link href="/">Главная</Link>
              <Link href="/visit">Спланировать визит</Link>
              <Link href="/sections">Разделы</Link>
              <Link href="/dogs">Атлас стаи</Link>
              <Link href="/about">О Хаски Лэнд</Link>
              <Link href="/faq">Вопросы</Link>
              <Link href="/contacts">Контакты</Link>
              <a href={SITE.parkUrl} target="_blank" rel="noopener noreferrer">Парк Сказка</a>
            </nav>

            <div className="sitefooter__cta">
              <span className="sitefooter__navtitle">Спланировать визит</span>
              <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
                Купить билет <span className="btn__ic"><IconTicket /></span>
              </a>
              <Link className="btn btn--ghost" href="/dogs" data-analytics="search">
                Открыть поиск <span className="btn__ic"><IconSearch /></span>
              </Link>
              <Link className="btn btn--ghost" href="/visit">Правила и адрес</Link>
            </div>
          </div>
        </div>
        <p className="sitefooter__legal muted">© {new Date().getFullYear()} Хаски Лэнд · Парк Сказка. Профили обитателей носят справочный характер; контакт с животными — только по правилам площадки.</p>
      </div>
    </footer>
  );
}
