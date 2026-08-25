import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "@/components/StaticLink";
import { SITE } from "@/lib/constants";
import {
  allDogs, getDog, dogSlug, galleryUrls, isDog, breedLabel,
  getSection, relatedDogs, navDog,
} from "@/lib/data";
import DogGallery from "@/components/DogGallery";
import DogImage, { localDogCover } from "@/components/DogImage";
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
  const socialImage = `/media/social/dogs/${dogSlug(d)}.jpg`;
  return {
    title: d.seo_title || `${d.name_ru} — ${d.breed_species ?? ""} в Хаски Лэнд`,
    description: d.seo_description || d.hero_text || d.card_teaser,
    alternates: { canonical: `/dogs/${dogSlug(d)}` },
    openGraph: {
      type: "article",
      title: d.seo_title || d.name_ru,
      description: d.seo_description || d.hero_text,
      url: `${SITE.baseUrl}/dogs/${dogSlug(d)}`,
      images: [{ url: socialImage, width: 1200, height: 630, alt: `${d.name_ru} — профиль Хаски Лэнд` }],
    },
    twitter: { card: "summary_large_image", title: d.seo_title || d.name_ru, description: d.seo_description || d.hero_text, images: [socialImage] },
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

  const favItem = { slug: dogSlug(dog), name: dog.name_ru, breed: dog.breed_species || dog.family, img: localDogCover(dogSlug(dog), 480), url: `/dogs/${dogSlug(dog)}` };

  const subAnchors = [
    (dog.about || dog.character) ? { href: "#story", label: "Характер" } : null,
    (params2.length || dog.appearance_text || dog.breed_block) ? { href: "#portrait", label: "Портрет" } : null,
    (dog.visitor_scenario || dog.fun_facts?.length || dog.photo_advice) ? { href: "#highlights", label: "Главное" } : null,
    (dog.safety_text || dog.rules?.length) ? { href: "#meeting", label: "Встреча" } : null,
    gallery.length > 1 ? { href: "#gallery", label: "Фото" } : null,
  ].filter(Boolean) as { href: string; label: string }[];

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE.baseUrl + "/" },
        { "@type": "ListItem", position: 2, name: "Каталог собак", item: SITE.baseUrl + "/dogs" },
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
        <Link href="/dogs">Каталог</Link><span>/</span>
        {section ? (<><Link href={`/sections/${section.slug}`}>{section.name}</Link><span>/</span></>) : null}
        <span aria-current="page">{dog.name_ru}</span>
      </nav>

      {/* HERO */}
      <div className="dogpage__hero">
        <div className="dogpage__copy">
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
              Купить билет <span className="btn__ic"><IconTicket /></span>
            </a>
            <FavButton item={favItem} variant="hero" />
          </div>
        </div>

        <Reveal className="dogpage__visual bezel">
          <div className="bezel__core">
            <DogGallery images={gallery} alt={dog.image_alt || dog.name_ru} slug={dogSlug(dog)} />
          </div>
        </Reveal>
      </div>

      {/* ANCHORS */}
      <nav className="dogpage__anchors glass" aria-label="Разделы профиля">
        {(dog.about || dog.character) ? <a href="#story">Характер</a> : null}
        {(params2.length || dog.appearance_text || dog.breed_block) ? <a href="#portrait">Портрет</a> : null}
        {(dog.visitor_scenario || dog.fun_facts?.length || dog.photo_advice) ? <a href="#highlights">Главное</a> : null}
        {(dog.safety_text || dog.rules?.length) ? <a href="#meeting">Встреча</a> : null}
        {gallery.length > 1 ? <a href="#gallery">Фото</a> : null}
      </nav>

      {/* Пять смысловых глав вместо длинной однотипной ленты. */}
      {(dog.about || dog.character) ? (
        <Reveal as="article" id="story" className="dogblock dogchapter">
          <h2 className="h2">{dogIsDog ? `Характер ${dog.name_gen || dog.name_ru}` : `История ${dog.name_gen || dog.name_ru}`}</h2>
          {dog.about ? <p>{dog.about}</p> : null}
          {dog.character ? <p>{dog.character}</p> : null}
          {dog.contact_note ? <p className="dognote"><span aria-hidden>🤝</span><span>{dog.contact_note}</span></p> : null}
        </Reveal>
      ) : null}

      {(params2.length || dog.appearance_text || dog.breed_block) ? (
        <Reveal as="article" id="portrait" className="dogblock dogchapter" style={{ maxWidth: "none" }}>
          <h2 className="h2">Взгляд, окрас, приметы</h2>
          {dog.appearance_text ? <p>{dog.appearance_text}</p> : null}
          {params2.length ? (
            <div className="dogparams">
              {params2.map((p) => (
                <div key={p.label} className="dogparam"><span>{p.label}</span><strong>{p.value}</strong></div>
              ))}
            </div>
          ) : null}
          {dog.breed_block ? <p>{dog.breed_block}</p> : null}
        </Reveal>
      ) : null}

      {(dog.visitor_scenario || dog.fun_facts?.length || dog.photo_advice) ? (
        <Reveal as="section" id="highlights" className="dogblock dogchapter" style={{ maxWidth: "none" }}>
          <h2 className="h2">Что стоит запомнить</h2>
          {dog.visitor_scenario ? <p>{dog.visitor_scenario}</p> : null}
          {dog.fun_facts?.length ? (
            <div className="dogfacts">
              {dog.fun_facts.map((f, i) => (
                <div key={i} className="dogfact"><span>{f.emoji || "⭐"}</span><strong>{f.text}</strong></div>
              ))}
            </div>
          ) : null}
          {dog.photo_advice ? <p className="dognote"><span aria-hidden>📷</span><span>{dog.photo_advice}</span></p> : null}
        </Reveal>
      ) : null}

      {(dog.safety_text || dog.rules?.length) ? (
        <Reveal as="article" id="meeting" className="dogblock dogchapter" style={{ maxWidth: "none" }}>
          <h2 className="h2">Чтобы встреча понравилась всем</h2>
          {dog.safety_text ? <p>{dog.safety_text}</p> : null}
          {dog.rules?.length ? (
            <div className="dogrules">{dog.rules.map((r) => <span key={r} className="dogrule">{r}</span>)}</div>
          ) : null}
        </Reveal>
      ) : null}

      {gallery.length > 1 ? (
        <Reveal as="section" id="gallery" className="dogblock dogchapter" style={{ maxWidth: "none" }}>
          <h2 className="h2">Ещё несколько взглядов</h2>
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
              <h2 className="h2">Кто может понравиться ещё</h2>
            </div>
            <Link href="/dogs" className="seccard__go">Весь каталог <IconArrow /></Link>
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
            <h2 className="h2">Следующий характер уже рядом</h2>
          </div>
        </div>
        <div className="navhub">
          {nav ? (
            <Link href={`/dogs/${dogSlug(nav.dog)}`} className="navhub__feat">
              <div className="navhub__photo"><DogImage slug={dogSlug(nav.dog)} alt={nav.dog.name_ru} sizes="(max-width: 760px) 92vw, 420px" /></div>
              <div className="navhub__featbody">
                <p className="muted">{nav.label}</p>
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

      <StickyCTA item={favItem} ticketHref={SITE.ticketsUrl} ticketText="Купить билет" />
    </div>
  );
}
