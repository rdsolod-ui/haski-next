import Link from "@/components/StaticLink";
import { plural, type Section } from "@/lib/data";
import DogImage from "./DogImage";
import { IconArrow } from "./Icons";

export default function SectionCard({ section }: { section: Section }) {
  const count = section.count;
  const label = `${count} ${plural(count, "профиль", "профиля", "профилей")}`;
  return (
    <Link href={`/sections/${section.slug}`} className="seccard" data-analytics="open-section" data-analytics-section={section.slug}>
      <div className="seccard__media">
        {section.coverSlug ? (
          <DogImage slug={section.coverSlug} alt={section.name} sizes="(max-width: 700px) 92vw, 360px" />
        ) : (
          <div className="seccard__ph" />
        )}
      </div>
      <div className="seccard__body">
        <h3 className="h3">{section.name}</h3>
        {section.intro ? <p className="seccard__intro muted">{section.intro}</p> : null}
        <span className="seccard__foot">
          <span className="seccard__count">{label}</span>
          <span className="seccard__go">Открыть <IconArrow /></span>
        </span>
      </div>
    </Link>
  );
}
