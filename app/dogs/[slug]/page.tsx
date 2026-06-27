import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import {
  allDogs, getDog, dogSlug, coverUrl, galleryUrls, isDog, breedLabel,
  getSection, relatedDogs, navDog,
} from "@/lib/data";
import DogGallery from "@/components/DogGallery";
import DogCard from "@/components/DogCard";
import FavButton from "@/components/FavButton";
import StickyCTA from "@/components/StickyCTA";
import SubNav from "@/components/SubNav";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { IconTicket, IconArrow, IconPaw, IconSearch } from "@/components/Icons";

export function generateStaticParams() {
  return allDogs().map((d) => ({ slug: dogSlug(d) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDog(slug);
  if (!d) return {};
  return {
    title: d.seo_title || `${d.name_ru} — ${d.breed_species ?? ""} в Хаски Лэнд`,
    description: d.seo_description || d.hero_text || d.card_teaser,
    alternates: { canonical: `/dogs/${dogSlug(d)}` },
    openGraph: {
      type: "article",
      title: d.seo_title || d.name_ru,
      description: d.seo_description || d.hero_text,
      url: `${SITE.baseUrl}/dogs/${dogSlug(d)}`,
      images: [{ url: coverUrl(d), alt: d.image_alt || d.name_ru }],
    },
  };
}

export default async function DogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dog = getDog(slug);
  if (!dog) notFound();

  const sectionId = dog.section_id;
  const section = getSection(sectionId);
  const gallery = galleryUrls(dog);
  const related = relatedDogs(dog, 4);
  const nav = navDog(dog);
  const dogIsDog = isDog(dog);

  const params2: { label: string; value: string }[] = [
    { label: breedLabel(dog), value: dog.breed_species || dog.family || "" },
    { label: "Пол", value: dog.sex || "" },
    { label: "Дата рождения", value: dog.birth_date || "" },
    { label: "Окрас", value: dog.color || "" },
    { label: "Глаза", value: dog.eyes || "" },
    { label: "Экстерьер", value: dog.exterior || "" },
    { label: "Имя по паспорту", value: dog.passport_name && dog.passport_name !== "—" ? dog.passport_name : "" },
  ].filter((p) => p.value.trim() !== "");
  const quick = params2.slice(0, 3);

  const chips = [dog.listing_badge, dog.name_alt, dog.breed_species]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i) as string[];

  const favItem = { slug: dogSlug(dog), name: dog.name_ru, breed: dog.breed_species || dog.family, img: coverUrl(dog), url: `/dogs/${dogSlug(dog)}` };

  const subAnchors = [
    dog.character ? { href: "#character", label: "Характер" } : null,
    gallery.length > 1 ? { href: "#gallery", label: "Фото" } : null,
    related.length ? { href: "#related", label: "Похожие" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE.baseUrl + "/" },
        { "@type": "ListItem", position: 2, name: "Поиск собак", item: SITE.baseUrl + "/search" },
        ...(section ? [{ "@type": "ListItem", position: 3, name: section.name, item: `${SITE.baseUrl}/sections/${section.slug}` }] : []),
        { "@type": "ListItem", position: section ? 4 : 3, name: dog.name_ru },
      ],
    },
  ];

  return (
    <div className="dogpage section container">
      <JsonLd data={ld} />
      <SubNav title={dog.name_ru} buyHref={SITE.ticketsUrl} buyText="Купить билет" anchors={subAnchors} />
      <nav className="crumbs" aria-label="Хлебные крошки">
        <Link href="/">Главная</Link><span>/</span>
        <Link href="/search">Поиск</Link><span>/</span>
        {section ? (<><Link href={`/sections/${section.slug}`}>{section.name}</Link><span>/</span></>) : null}
        <span aria-current="page">{dog.name_ru}</span>
      </nav>

      {/* HERO */}
      <div className="dogpage__hero">
        <div className="dogpage__copy">
          <span className="eyebrow">{dogIsDog ? "Профиль собаки" : "Профиль обитателя"}</span>
          <h1 className="display" style={{ fontSize: "var(--fs-h1)" }}>{dog.name_ru}</h1>

          {chips.length ? (
            <div className="dogpage__chips">
              {chips.map((c) => <span key={c} className="dogpage__chip">{c}</span>)}
              {section ? <span className="dogpage__chip">Раздел · {section.name}</span> : null}
            </div>
          ) : null}

          {dog.hero_text ? <p className="lead">{dog.hero_text}</p> : null}

          {quick.length ? (
            <div className="dogpage__quick">
              {quick.map((p) => (
                <div key={p.label} className="dogpage__quickitem">
                  <span>{p.label}</span><strong>{p.value}</strong>
                </div>
              ))}
            </div>
          ) : null}

          <div className="dogpage__actions">
            <a className="btn btn--cta" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
              {dog.cta_text || "Купить билет"} <span className="btn__ic"><IconTicket /></span>
            </a>
            <FavButton item={favItem} variant="hero" />
          </div>
        </div>

        <Reveal className="dogpage__visual bezel">
          <div className="bezel__core">
            <DogGallery images={gallery} alt={dog.image_alt || dog.name_ru} />
          </div>
        </Reveal>
      </div>

      {/* ANCHORS */}
      <nav className="dogpage__anchors glass" aria-label="Разделы профиля">
        {dog.about ? <a href="#about">{dogIsDog ? "О собаке" : "Об обитателе"}</a> : null}
        {(params2.length || dog.appearance_text) ? <a href="#appearance">Внешность</a> : null}
        {dog.character ? <a href="#character">Характер</a> : null}
        {dog.breed_block ? <a href="#breed">{dogIsDog ? "О породе" : "О виде"}</a> : null}
        {dog.visitor_scenario ? <a href="#visitor">Кому понравится</a> : null}
        {dog.fun_facts?.length ? <a href="#facts">Факты</a> : null}
        {dog.photo_advice ? <a href="#photo">Для фото</a> : null}
        {(dog.safety_text || dog.rules?.length) ? <a href="#rules">Бережно</a> : null}
        {gallery.length > 1 ? <a href="#gallery">Фото</a> : null}
        {related.length ? <a href="#related">Похожие</a> : null}
      </nav>

      {/* BLOCKS */}
      {dog.about ? (
        <Reveal as="article" id="about" className="dogblock">
          <span className="eyebrow">Знакомство</span>
          <h2 className="h2">{dogIsDog ? "О собаке" : "Об обитателе"}</h2>
          <p>{dog.about}</p>
        </Reveal>
      ) : null}

      {(params2.length || dog.appearance_text) ? (
        <Reveal as="article" id="appearance" className="dogblock" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Параметры</span>
          <h2 className="h2">Внешность и особенности</h2>
          {dog.appearance_text ? <p>{dog.appearance_text}</p> : null}
          {params2.length ? (
            <div className="dogparams">
              {params2.map((p) => (
                <div key={p.label} className="dogparam"><span>{p.label}</span><strong>{p.value}</strong></div>
              ))}
            </div>
          ) : null}
        </Reveal>
      ) : null}

      {dog.character ? (
        <Reveal as="article" id="character" className="dogblock">
          <span className="eyebrow">Характер</span>
          <h2 className="h2">Характер и темперамент</h2>
          <p>{dog.character}</p>
          {dog.contact_note ? <p className="dognote"><span aria-hidden>🤝</span><span>{dog.contact_note}</span></p> : null}
        </Reveal>
      ) : null}

      {dog.breed_block ? (
        <Reveal as="article" id="breed" className="dogblock">
          <span className="eyebrow">{dogIsDog ? "О породе" : "О виде"}</span>
          <h2 className="h2">{dogIsDog ? "Особенности породы" : "Особенности вида"}</h2>
          <p>{dog.breed_block}</p>
        </Reveal>
      ) : null}

      {dog.visitor_scenario ? (
        <Reveal as="article" id="visitor" className="dogblock">
          <span className="eyebrow">Кому понравится</span>
          <h2 className="h2">Кому особенно понравится</h2>
          <p>{dog.visitor_scenario}</p>
        </Reveal>
      ) : null}

      {dog.fun_facts?.length ? (
        <Reveal as="section" id="facts" className="dogblock" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Факты</span>
          <h2 className="h2">Интересные факты</h2>
          <div className="dogfacts">
            {dog.fun_facts.map((f, i) => (
              <div key={i} className="dogfact"><span>{f.emoji || "⭐"}</span><strong>{f.text}</strong></div>
            ))}
          </div>
        </Reveal>
      ) : null}

      {dog.photo_advice ? (
        <Reveal as="article" id="photo" className="dogblock">
          <span className="eyebrow">Для фото</span>
          <h2 className="h2">Рекомендация для кадра</h2>
          <p>{dog.photo_advice}</p>
        </Reveal>
      ) : null}

      {(dog.safety_text || dog.rules?.length) ? (
        <Reveal as="article" id="rules" className="dogblock" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Бережный контакт</span>
          <h2 className="h2">Правила бережного контакта</h2>
          {dog.safety_text ? <p>{dog.safety_text}</p> : null}
          {dog.rules?.length ? (
            <div className="dogrules">{dog.rules.map((r) => <span key={r} className="dogrule">{r}</span>)}</div>
          ) : null}
        </Reveal>
      ) : null}

      {gallery.length > 1 ? (
        <Reveal as="section" id="gallery" className="dogblock" style={{ maxWidth: "none" }}>
          <span className="eyebrow">Галерея</span>
          <h2 className="h2">Фотографии</h2>
          <div className="doggallerygrid">
            {gallery.map((src, i) => (
              <img key={src} src={src} alt={`${dog.name_ru} — фото ${i + 1}`} loading="lazy" decoding="async" width={600} height={600} />
            ))}
          </div>
        </Reveal>
      ) : null}

      {related.length ? (
        <section id="related" className="section" style={{ paddingBottom: 0 }}>
          <div className="section-head">
            <div className="section-head__t">
              <span className="eyebrow">Рекомендуем</span>
              <h2 className="h2">С кем ещё познакомиться</h2>
            </div>
            <Link href="/search" className="seccard__go">Весь каталог <IconArrow /></Link>
          </div>
          <div className="grid-cards">
            {related.map((d, i) => <Reveal key={d.id} delay={(i % 4) * 60}><DogCard dog={d} /></Reveal>)}
          </div>
        </section>
      ) : null}

      {/* NAV HUB */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="section-head">
          <div className="section-head__t">
            <span className="eyebrow">Навигация</span>
            <h2 className="h2">Продолжить знакомство</h2>
          </div>
        </div>
        <div className="navhub">
          {nav ? (
            <Link href={`/dogs/${dogSlug(nav.dog)}`} className="navhub__feat">
              <div className="navhub__photo"><img src={coverUrl(nav.dog)} alt={nav.dog.name_ru} loading="lazy" /></div>
              <div className="navhub__featbody">
                <span className="eyebrow">{nav.label}</span>
                <h3 className="h3">{nav.dog.name_ru}</h3>
                <p className="muted">{nav.dog.breed_species || nav.dog.family}</p>
                <span className="seccard__go">Открыть профиль <IconArrow /></span>
              </div>
            </Link>
          ) : <div />}

          <div className="navhub__actions">
            {section ? (
              <Link href={`/sections/${section.slug}`} className="navhub__act">
                <span className="navhub__actic"><IconPaw /></span>
                <span><strong>Вернуться в раздел</strong><small>Все профили: {section.name}</small></span>
              </Link>
            ) : null}
            <Link href="/search" className="navhub__act">
              <span className="navhub__actic"><IconSearch /></span>
              <span><strong>Открыть поиск</strong><small>Подобрать по породе и характеру</small></span>
            </Link>
            <a href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" className="navhub__act navhub__act--cta" data-analytics="buy-ticket">
              <span className="navhub__actic"><IconTicket /></span>
              <span><strong>Купить билет</strong><small>Спланировать визит в Парк Сказка</small></span>
            </a>
          </div>
        </div>
      </section>

      <StickyCTA item={favItem} ticketHref={SITE.ticketsUrl} ticketText={dog.cta_text || "Купить билет"} />
    </div>
  );
}
