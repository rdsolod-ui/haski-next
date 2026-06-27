"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw, IconSparkle } from "./Icons";

const LINE1 = ["Северная", "сказка,"];
const LINE2 = ["которую", "выбирают"];
const LINE3 = ["до", "визита"];

export default function Hero({
  totalDogs,
  sectionCount,
  heroImg,
  heroAlt,
}: {
  totalDogs: number;
  sectionCount: number;
  heroImg: string;
  heroAlt: string;
}) {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, rm ? 1 : 1.12]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : -40]);

  const word = {
    hidden: { y: rm ? 0 : "0.9em", opacity: 0, filter: "blur(10px)" },
    show: (i: number) => ({
      y: 0, opacity: 1, filter: "blur(0px)",
      transition: { delay: 0.12 + i * 0.06, duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
    }),
  };

  let idx = 0;
  const renderLine = (words: string[], accent = false) => (
    <span className="herohome__line">
      {words.map((w) => {
        const i = idx++;
        return (
          <span className="herohome__word" key={w + i}>
            <motion.span className={accent ? "aurora-text" : ""} custom={i} variants={word} initial="hidden" animate="show">
              {w}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </span>
  );

  return (
    <section className="herohome" ref={ref}>
      <div className="herohome__orbs" aria-hidden>
        <span className="aurora-orb herohome__orb1" />
        <span className="aurora-orb herohome__orb2" />
        <span className="aurora-orb herohome__orb3" />
      </div>

      <div className="herohome__inner">
        <motion.span className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          Хаски Лэнд · Парк Сказка
        </motion.span>

        <h1 className="display herohome__title">
          {renderLine(LINE1)}
          {renderLine(LINE2, true)}
          {renderLine(LINE3)}
        </h1>

        <motion.p
          className="lead herohome__lead"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Стая хаски, маламутов, самоедов и лаек в сердце Москвы. Выберите любимцев и спланируйте семейный маршрут — ещё до приезда.
        </motion.p>

        <motion.div
          className="herohome__actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <a className="btn btn--cta btn--lg" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
            Купить билет <span className="btn__ic"><IconTicket /></span>
          </a>
          <Link className="btn btn--ghost btn--lg" href="/search" data-analytics="search">
            Выбрать любимца <span className="btn__ic"><IconPaw /></span>
          </Link>
        </motion.div>

        <motion.div
          className="herohome__visual"
          initial={{ opacity: 0, scale: 0.94, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="herohome__photo">
            <motion.img src={heroImg} alt={heroAlt} loading="eager" fetchPriority="high" width={1200} height={1200} style={{ scale: photoScale, y: photoY }} />
          </div>
          <motion.div
            className="herohome__chip glass"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7 }}
          >
            <span className="herohome__chipic"><IconSparkle /></span>
            <span>
              <strong>Живой контакт по правилам</strong>
              <em>безопасно для гостей и животных</em>
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="herohome__stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.8 }}
        >
          <Link href="/search" className="herohome__stat">
            <span className="herohome__statnum aurora-text">{totalDogs}</span>
            <span className="herohome__statlbl">профилей обитателей</span>
          </Link>
          <Link href="/sections" className="herohome__stat">
            <span className="herohome__statnum aurora-text">{sectionCount}</span>
            <span className="herohome__statlbl">разделов стаи</span>
          </Link>
          <a className="herohome__stat" href={SITE.parkUrl} target="_blank" rel="noopener noreferrer">
            <span className="herohome__statnum aurora-text">1</span>
            <span className="herohome__statlbl">маршрут в Парке Сказка</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
