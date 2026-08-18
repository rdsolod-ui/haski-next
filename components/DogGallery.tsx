"use client";

import { useRef, useState } from "react";
import { IconChevron } from "./Icons";
import DogImage from "./DogImage";

export default function DogGallery({ images, alt, slug }: { images: string[]; alt: string; slug: string }) {
  const [i, setI] = useState(0);
  const startX = useRef(0);
  const delta = useRef(0);
  const n = images.length;
  const go = (next: number) => setI(((next % n) + n) % n);

  return (
    <div className="doggal">
      <div
        className="doggal__track"
        style={{ transform: `translate3d(${-i * 100}%,0,0)` }}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; delta.current = 0; }}
        onTouchMove={(e) => { delta.current = e.touches[0].clientX - startX.current; }}
        onTouchEnd={() => { if (Math.abs(delta.current) > 40) go(i + (delta.current < 0 ? 1 : -1)); }}
      >
        {images.map((src, k) => (
          <div className="doggal__slide" key={src}>
            {k === 0 ? (
              <DogImage slug={slug} alt={alt} loading="eager" fetchPriority="high" sizes="(max-width: 900px) 100vw, 58vw" />
            ) : (
              <img src={src} alt={`${alt} — фото ${k + 1}`} loading="lazy" width={1200} height={1200} decoding="async" />
            )}
          </div>
        ))}
      </div>

      {n > 1 && (
        <>
          <div className="doggal__counter glass">{i + 1} / {n}</div>
          <button className="doggal__arrow doggal__arrow--prev" onClick={() => go(i - 1)} aria-label="Предыдущее фото"><IconChevron style={{ transform: "rotate(180deg)" }} /></button>
          <button className="doggal__arrow doggal__arrow--next" onClick={() => go(i + 1)} aria-label="Следующее фото"><IconChevron /></button>
          <div className="doggal__dots">
            {images.map((src, k) => (
              <button key={src} className={`doggal__dot ${k === i ? "is-active" : ""}`} onClick={() => go(k)} aria-label={`Фото ${k + 1}`} aria-current={k === i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
