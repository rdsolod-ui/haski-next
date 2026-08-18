import Link from "@/components/StaticLink";
import { dogSlug, type Dog } from "@/lib/data";
import DogImage, { localDogCover } from "./DogImage";
import FavButton from "./FavButton";
import { IconArrowUpRight } from "./Icons";

export default function DogCard({ dog, priority = false }: { dog: Dog; priority?: boolean }) {
  const slug = dogSlug(dog);
  const url = `/dogs/${slug}`;
  const breed = dog.breed_species || dog.family || dog.name_latin || "";
  const teaser = dog.card_teaser || dog.hero_text || "";

  return (
    <article className="dogcard">
      <Link href={url} className="dogcard__link" data-analytics="open-dog">
        <div className="dogcard__media">
          <DogImage
            slug={slug}
            alt={dog.image_alt || dog.name_ru}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            sizes="(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 280px"
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
      <FavButton item={{ slug, name: dog.name_ru, breed, img: localDogCover(slug, 480), url }} />
    </article>
  );
}
