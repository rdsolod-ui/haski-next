import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import { allSections, getSection, dogsInSection, plural, TOTAL_DOGS } from "@/lib/data";
import DogCard from "@/components/DogCard";
import SectionCard from "@/components/SectionCard";
import SubNav from "@/components/SubNav";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { IconTicket, IconSearch, IconArrow } from "@/components/Icons";

export function generateStaticParams() {
  return allSections().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getSection(slug);
  if (!s) return {};
  const count = s.count;
  return {
    title: `${s.name} в Хаски Лэнд — ${count} ${plural(count, "профиль", "профиля", "профилей")} | Парк Сказка`,
    description: s.intro || `${s.name} — раздел Хаски Лэнд в Парке Сказка. ${count} профилей: фото, характеры и факты. Выберите любимцев до визита.`,
    alternates: { canonical: `/sections/${s.slug}` },
    openGraph: { title: `${s.name} — Хаски Лэнд`, url: `${SITE.baseUrl}/sections/${s.slug}`, images: s.cover ? [s.cover] : undefined },
  };
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  const dogs = dogsInSection(section.id);
  const others = allSections().filter((s) => s.slug !== section.slug);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE.baseUrl + "/" },
        { "@type": "ListItem", position: 2, name: "Разделы", item: SITE.baseUrl + "/sections" },
        { "@type": "ListItem", position: 3, name: section.name },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: section.name,
      numberOfItems: dogs.length,
      itemListElement: dogs.map((d, i) => ({
        "@type": "ListItem", position: i + 1, url: `${SITE.baseUrl}/dogs/${d.slug ?? d.id}`, name: d.name_ru,
      })),
    },
  ];

  return (
    <div className="section container">
      <JsonLd data={ld} />
      <SubNav title={section.name} buyHref={SITE.ticketsUrl} buyText="Купить билет" />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span>
        <Link href="/sections">Разделы</Link><span>/</span>
        <span aria-current="page">{section.name}</span>
      </nav>

      <header className="pagehero">
        <h1 className="h1">{section.name}</h1>
        {section.intro ? <p className="lead">{section.intro}</p> : null}
        <p className="muted">{section.count} {plural(section.count, "профиль", "профиля", "профилей")} в разделе · {TOTAL_DOGS} всего в каталоге</p>
        <div className="pagehero__actions">
          <Link className="btn btn--ghost" href="/search">Поиск по каталогу <span className="btn__ic"><IconSearch /></span></Link>
          <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">Купить билет <span className="btn__ic"><IconTicket /></span></a>
        </div>
      </header>

      <div className="grid-cards" style={{ marginTop: "clamp(28px,4vw,52px)" }}>
        {dogs.map((d, i) => (
          <Reveal key={d.id} delay={(i % 4) * 60} variant={i % 2 ? "scale" : "rise"}><DogCard dog={d} priority={i < 4} index={i} /></Reveal>
        ))}
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="section-head">
          <div className="section-head__t">
            <h2 className="h2">Продолжить знакомство со стаей</h2>
          </div>
          <Link href="/sections" className="seccard__go">Все разделы <IconArrow /></Link>
        </div>
        <div className="grid-cards">
          {others.map((s) => <SectionCard key={s.slug} section={s} />)}
        </div>
      </section>
    </div>
  );
}
