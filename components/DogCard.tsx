import Link from "@/components/StaticLink";
import { dogSlug, type Dog } from "@/lib/data";
import DogImage, { localDogCover } from "./DogImage";
import FavButton from "./FavButton";
import { IconArrowUpRight } from "./Icons";

export default function DogCard({ dog, priority = false, variant = "standard", index }: { dog: Dog; priority?: boolean; variant?: "standard" | "feature" | "compact"; index?: number }) {
  const slug = dogSlug(dog);
  const url = `/dogs/${slug}`;
  const breed = dog.breed_species || dog.family || dog.name_latin || "";
  const teaser = dog.card_teaser || dog.hero_text || "";

  return (
    <article className={`dogcard dogcard--${variant}`}>
      <Link href={url} className="dogcard__link" data-analytics="open-dog">
        <div className="dogcard__media">
          <DogImage
            slug={slug}
            alt={dog.image_alt || dog.name_ru}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            sizes="(max-width: 640px) 92vw, (max-width: 1100px) 45vw, 280px"
          />
          {typeof index === "number" ? <span className="dogcard__index">{String(index + 1).padStart(2, "0")}</span> : null}
          <span className="dogcard__open"><IconArrowUpRight /></span>
        </div>
        <div className="dogcard__body">
          <div className="dogcard__identity">
            <h3 className="dogcard__name h3">{dog.name_ru}</h3>
            {breed ? <p className="dogcard__breed">{breed}</p> : null}
          </div>
          {dog.listing_badge ? <p className="dogcard__signal">{dog.listing_badge}</p> : null}
          {teaser ? <p className="dogcard__teaser">{teaser}</p> : null}
          <span className="dogcard__route">Открыть историю <IconArrowUpRight /></span>
        </div>
      </Link>
      <FavButton item={{ slug, name: dog.name_ru, breed, img: localDogCover(slug, 480), url }} />
    </article>
  );
}
