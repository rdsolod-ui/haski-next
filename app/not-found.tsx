import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { IconHome, IconSearch, IconTicket } from "@/components/Icons";

export const metadata = {
  title: "Страница не найдена — Хаски Лэнд",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="section container" style={{ textAlign: "center", minHeight: "60vh", display: "grid", placeContent: "center" }}>
      <div className="pagehero" data-index="404 / стая ушла другой тропой" style={{ margin: "0 auto", justifyItems: "center" }}>
        <h1 className="display" style={{ fontSize: "var(--fs-h1)" }}>Эта тропа <span className="aurora-text">потерялась в снегу</span></h1>
        <p className="lead" style={{ maxWidth: "48ch" }}>Страницы нет, но стая на месте. Вернитесь на главную, откройте каталог собак или спланируйте визит в Парк Сказка.</p>
        <div className="pagehero__actions" style={{ justifyContent: "center" }}>
          <Link className="btn btn--brand" href="/"><span className="btn__ic"><IconHome /></span> На главную</Link>
          <Link className="btn btn--ghost" href="/search">Каталог собак <span className="btn__ic"><IconSearch /></span></Link>
          <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Билеты <span className="btn__ic"><IconTicket /></span></a>
        </div>
      </div>
    </div>
  );
}
