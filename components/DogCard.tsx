import Link from "next/link";
import { coverUrl, dogSlug, type Dog } from "@/lib/data";
import FavButton from "./FavButton";
import { IconArrowUpRight } from "./Icons";

export default function DogCard({ dog, priority = false }: { dog: Dog; priority?: boolean }) {
  const slug = dogSlug(dog);
  const url = `/dogs/${slug}`;
  const cover = coverUrl(dog);
  const breed = dog.breed_species || dog.family || dog.name_latin || "";
  const teaser = dog.card_teaser || dog.hero_text || "";

  return (
    <article className="dogcard">
      <Link href={url} className="dogcard__link" data-analytics="open-dog">
        <div className="dogcard__media">
          <img
            src={cover}
            alt={dog.image_alt || dog.name_ru}
            loading={priority ? "eager" : "lazy"}
            width={900}
            height={900}
            decoding="async"
          />
          {dog.listing_badge ? <span className="dogcard__badge">{dog.listing_badge}</span> : null}
          <span className="dogcard__open"><IconArrowUpRight /></span>
        </div>
        <div className="dogcard__body">
          <h3 className="dogcard__name h3">{dog.name_ru}</h3>
          {breed ? <p className="dogcard__breed muted">{breed}</p> : null}
          {teaser ? <p className="dogcard__teaser">{teaser}</p> : null}
        </div>
      </Link>
      <FavButton item={{ slug, name: dog.name_ru, breed, img: cover, url }} />
    </article>
  );
}
