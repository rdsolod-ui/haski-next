"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

const WORDS =
  "Хаски Лэнд начинается не у входа в парк — а здесь, когда вы выбираете свою стаю.".split(" ");

function Word({ progress, i, n }: { progress: MotionValue<number>; i: number; n: number }) {
  // окно проявления слова — со сдвигом, чтобы фраза «зажигалась» слева направо
  const start = (i / n) * 0.82;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  const accent = WORDS[i].replace(/[.,—]/g, "").toLowerCase();
  const isAccent = accent === "стаю" || accent === "выбираете";
  return (
    <motion.span className={`story__word ${isAccent ? "aurora-text" : ""}`} style={{ opacity }}>
      {WORDS[i] + " "}
    </motion.span>
  );
}

export default function ScrollStory() {
  const rm = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  if (rm) {
    return (
      <section className="panel panel--mist">
        <div className="container">
          <p className="story__text" style={{ margin: "0 auto" }}>
            Хаски Лэнд начинается не у входа в парк — а здесь, когда вы выбираете свою <span className="aurora-text">стаю</span>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="story panel--mist" ref={ref} aria-label="О Хаски Лэнд">
      <div className="story__sticky">
        <p className="story__text">
          {WORDS.map((_, i) => (
            <Word key={i} progress={scrollYProgress} i={i} n={WORDS.length} />
          ))}
        </p>
      </div>
    </section>
  );
}
