"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw } from "./Icons";

export default function HeroCinematic() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Хореография: графит → глаза → образ собаки → текст → уход к контенту
  const eyesOpacity = useTransform(scrollYProgress, [0.02, 0.16, 0.4, 0.5], [0, 1, 1, 0]);
  const eyesGlow = useTransform(scrollYProgress, [0.02, 0.18], [0.4, 1]);
  const veilOpacity = useTransform(scrollYProgress, [0.18, 0.5], [1, 0]);
  const imgScale = useTransform(scrollYProgress, [0.18, 0.82], [1.14, 1]);
  const imgY = useTransform(scrollYProgress, [0.5, 1], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0.5, 0.74], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.5, 0.74], [30, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const Copy = (
    <>
      <span className="eyebrow hc__eyebrow">Хаски Лэнд · Парк Сказка</span>
      <h1 className="display hc__title">
        Северная сказка,<br />которую <span className="aurora-text">выбирают</span> до визита
      </h1>
      <p className="hc__lead">
        Стая хаски, маламутов и самоедов в сердце Москвы. Выберите любимцев — ещё до приезда.
      </p>
      <div className="hc__actions">
        <a className="btn btn--cta btn--lg" href={SITE.ticketsUrl} target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket">
          Купить билет <span className="btn__ic"><IconTicket /></span>
        </a>
        <Link className="btn btn--ghost btn--lg hc__ghost" href="/search" data-analytics="search">
          Выбрать любимца <span className="btn__ic"><IconPaw /></span>
        </Link>
      </div>
    </>
  );

  if (rm) {
    return (
      <section className="hc hc--static">
        <div className="hc__sticky">
          <div className="hc__stage">
            <img className="hc__img" src="/hero-husky.webp" alt="Хаски с голубыми глазами — Хаски Лэнд" width={900} height={1378} fetchPriority="high" />
          </div>
          <div className="hc__copy">{Copy}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="hc" ref={ref}>
      <div className="hc__sticky">
        <motion.div className="hc__stage" style={{ scale: imgScale, y: imgY }}>
          <img className="hc__img" src="/hero-husky.webp" alt="Хаски с голубыми глазами — Хаски Лэнд" width={900} height={1378} fetchPriority="high" />
          <motion.div className="hc__veil" style={{ opacity: veilOpacity }} aria-hidden />
          <motion.span className="hc__eye hc__eye--l" style={{ opacity: eyesOpacity, scale: eyesGlow }} aria-hidden />
          <motion.span className="hc__eye hc__eye--r" style={{ opacity: eyesOpacity, scale: eyesGlow }} aria-hidden />
        </motion.div>

        <motion.div className="hc__copy" style={{ opacity: copyOpacity, y: copyY }}>
          {Copy}
        </motion.div>

        <motion.div className="hc__hint" style={{ opacity: hintOpacity }} aria-hidden>
          <span>Листайте вниз</span>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </motion.div>
      </div>
    </section>
  );
}
