"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SITE } from "@/lib/constants";
import { IconTicket, IconPaw } from "./Icons";

const EASE = [0.16, 1, 0.3, 1] as const;
// строки заголовка падают сверху из-под маски, по очереди
const lineV: Variants = {
  hidden: { y: "-118%" },
  show: (i: number) => ({ y: "0%", transition: { delay: 0.5 + i * 0.13, duration: 0.85, ease: EASE } }),
};
const leadV: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.7, ease: EASE } } };
const popV = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 24, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { delay, type: "spring", stiffness: 440, damping: 15 } },
});
const hintV: Variants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { delay: 1.85, duration: 0.6 } } };

const HERO_LINES: { t: string; a?: boolean }[][] = [
  [{ t: "Северная сказка," }],
  [{ t: "которую " }, { t: "выбирают", a: true }],
  [{ t: "до визита" }],
];

const DESKTOP = { path: "/frames/haski-hero/desktop/frame_", count: 75 };
const MOBILE = { path: "/frames/haski-hero/mobile/frame_", count: 60 };
const FINAL_POSTER = "/img/haski-hero-final.webp";

type Cfg = { path: string; count: number };
const frameUrl = (i: number, cfg: Cfg) => `${cfg.path}${String(i + 1).padStart(4, "0")}.webp`;

export default function SequenceHero() {
  const rm = useReducedMotion();
  const init = rm ? false : "hidden"; // reduced-motion → сразу финальное состояние
  const secRef = useRef<HTMLElement>(null);
  const canRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = secRef.current;
    const canvas = canRef.current;
    const poster = posRef.current;
    if (!section || !canvas || !poster) return;

    // prefers-reduced-motion → статичный финальный постер, без секвенции
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      poster.src = FINAL_POSTER;
      poster.style.opacity = "1";
      section.classList.add("is-static");
      section.style.setProperty("--hero-progress", "1");
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const mq = window.matchMedia("(max-width: 760px)");
    let isMobile = mq.matches;
    let cfg: Cfg = isMobile ? MOBILE : DESKTOP;
    let imgs: (HTMLImageElement | null)[] = new Array(cfg.count).fill(null);
    let ok: boolean[] = new Array(cfg.count).fill(false);
    let cur = -1;
    let ticking = false;

    function size() {
      const r = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      canvas!.width = Math.max(1, Math.round(r.width * dpr));
      canvas!.height = Math.max(1, Math.round(r.height * dpr));
    }

    // рисуем «cover»: кадр заполняет canvas (на мобиле canvas сам = 16:9 → точное совпадение)
    function draw(idx: number) {
      let i = idx;
      while (i >= 0 && !ok[i]) i--;
      if (i < 0) { i = idx; while (i < cfg.count && !ok[i]) i++; }
      if (i < 0 || i >= cfg.count || !ok[i]) return;
      const img = imgs[i]!;
      const cw = canvas!.width, ch = canvas!.height;
      const ir = img.width / img.height, cr = cw / ch;
      let dw, dh, ox, oy;
      if (ir > cr) { dh = ch; dw = dh * ir; ox = (cw - dw) / 2; oy = 0; }
      else { dw = cw; dh = dw / ir; ox = 0; oy = (ch - dh) / 2; }
      ctx!.fillStyle = "#05070a";
      ctx!.fillRect(0, 0, cw, ch);
      ctx!.drawImage(img, ox, oy, dw, dh);
      poster!.style.opacity = "0"; // как только нарисован реальный кадр — прячем постер-мост
    }

    function load(idx: number) {
      if (imgs[idx]) return;
      const im = new Image();
      im.decoding = "async";
      im.src = frameUrl(idx, cfg);
      imgs[idx] = im;
      im.onload = () => { ok[idx] = true; if (idx === cur) draw(cur); };
    }

    function preload() {
      const priority = Math.min(10, cfg.count);
      for (let i = 0; i < priority; i++) load(i);
      let n = priority;
      const idle: (cb: () => void) => void =
        (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback ||
        ((cb) => window.setTimeout(cb, 16));
      const step = () => { if (n >= cfg.count) return; load(n++); idle(step); };
      idle(step);
    }

    function update() {
      ticking = false;
      const r = section!.getBoundingClientRect();
      const total = section!.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-r.top / total, 0), 1) : 0;
      section!.style.setProperty("--hero-progress", p.toFixed(4));
      const f = Math.round(p * (cfg.count - 1));
      if (f !== cur) { cur = f; if (!ok[f]) load(f); draw(f); }
    }

    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    function onResize() {
      const nowMobile = mq.matches;
      if (nowMobile !== isMobile) {
        isMobile = nowMobile;
        cfg = nowMobile ? MOBILE : DESKTOP;
        imgs = new Array(cfg.count).fill(null);
        ok = new Array(cfg.count).fill(false);
        cur = -1;
        preload();
      }
      size();
      draw(cur < 0 ? 0 : cur);
      update();
    }

    size();
    preload();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      className="haski-sequence-hero"
      data-sequence-hero
      ref={secRef}
      style={{ "--hero-progress": 0 } as CSSProperties}
    >
      <div className="haski-sequence-hero__sticky">
        {/* постер-мост: первый кадр (глаза в темноте) до загрузки секвенции */}
        <img
          ref={posRef}
          className="haski-sequence-hero__poster"
          src="/img/haski-hero-first.webp"
          alt="Хаски с голубыми глазами в темноте — Хаски Лэнд в Парке Сказка"
          fetchPriority="high"
          decoding="async"
        />
        <canvas ref={canRef} className="haski-sequence-hero__canvas" data-sequence-canvas aria-hidden />
        <div className="haski-sequence-hero__backdrop" aria-hidden />
        <div className="haski-sequence-hero__overlay" aria-hidden />

        <div className="haski-sequence-hero__content">
          <div className="haski-sequence-hero__inner">
            <h1 className="display haski-sequence-hero__title">
              {HERO_LINES.map((segs, i) => (
                <span className="haski-sequence-hero__line" key={i}>
                  <motion.span className="haski-sequence-hero__lineInner" custom={i} variants={lineV} initial={init} animate="show">
                    {segs.map((s, j) => (
                      <span key={j} className={s.a ? "aurora-text" : undefined}>{s.t}</span>
                    ))}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p className="haski-sequence-hero__lead" variants={leadV} initial={init} animate="show">
              Стая хаски, маламутов и самоедов в сердце Москвы. Выберите любимцев — ещё до приезда.
            </motion.p>

            <div className="haski-sequence-hero__actions">
              <motion.a
                className="btn btn--cta btn--lg haski-sequence-hero__buy" href={SITE.ticketsUrl}
                target="_blank" rel="noopener noreferrer" data-analytics="buy-ticket"
                variants={popV(1.25)} initial={init} animate="show"
                whileHover={rm ? undefined : { scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                Купить билет <span className="btn__ic"><IconTicket /></span>
              </motion.a>
              <motion.span variants={popV(1.45)} initial={init} animate="show" style={{ display: "inline-flex" }} whileTap={{ scale: 0.97 }}>
                <Link className="btn btn--ghost btn--lg hc__ghost" href="/search" data-analytics="search">
                  Выбрать любимца <span className="btn__ic"><IconPaw /></span>
                </Link>
              </motion.span>
            </div>
          </div>
        </div>

        <div className="haski-sequence-hero__hintwrap" aria-hidden>
          <motion.div className="haski-sequence-hero__hint" variants={hintV} initial={init} animate="show">
            <span className="haski-sequence-hero__hintdot">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v13M6 12l6 6 6-6" /></svg>
            </span>
            <span>Листайте вниз</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
