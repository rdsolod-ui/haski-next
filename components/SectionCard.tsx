import Link from "next/link";
import { plural, type Section } from "@/lib/data";
import { IconArrow } from "./Icons";

export default function SectionCard({ section }: { section: Section }) {
  const count = section.count;
  const label = `${count} ${plural(count, "профиль", "профиля", "профилей")}`;
  return (
    <Link href={`/sections/${section.slug}`} className="seccard" data-analytics="open-section">
      <div className="seccard__media">
        {section.cover ? (
          <img src={section.cover} alt={section.name} loading="lazy" width={800} height={800} decoding="async" />
        ) : (
          <div className="seccard__ph" />
        )}
        <span className="seccard__tag">Раздел Хаски Лэнд</span>
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
