# Отчёт качества — 2026-08-17

## Контракт выпуска

- Канонический remote: `https://github.com/rdsolod-ui/haski-next.git`.
- Рабочая ветка: `codex/haski-stabilization`.
- Static export: 49 сгенерированных страниц.
- Исторический контракт: 39/39 URL сохранены.
- QR-контракт: 30/30 адресов `/dogs/<slug>` неизменны.
- CTA: «Купить билет» → `https://prices.parkskazka.com/`.
- Метрика: один `tag.js`, два init — `108579634` и `109784590`.

## Lighthouse before / after

| Профиль | Состояние | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile | production baseline | 44 | 92 | 73 | 100 | 6,37 с | 5,02 с | — |
| Mobile | candidate, median of 3 | 98 | 100 | 100 | 100 | 2,361 с | 50 мс | 0 |
| Desktop | production baseline | 65 | 96 | 73 | 100 | — | 0,8 с | — |
| Desktop | candidate, median of 3 | 98 | 100 | 100 | 100 | 2,394 с | 83 мс | 0 |

Команда: `npm run test:lighthouse`. Для защиты от шума shared runner каждый профиль измеряется трижды, а бюджеты применяются к медианному Performance run. Отчёты HTML/JSON сохраняются в `reports/lighthouse/` и публикуются CI artifact.

## Автоматическая приёмка

- `npm run lint`: 0 ошибок; остаются четыре осознанных предупреждения для внешних lazy-gallery изображений и no-JS пикселей.
- `npm run build`: успешно, Next.js 16.3.1, 49/49 static pages.
- `npm run test:routes`: 39 historical URL и 30 QR URL подтверждены.
- `npm run test:e2e`: 36/36 в desktop Chromium, mobile Chromium и mobile WebKit.
- Сценарии: no-JS, reduced motion, serious/critical axe violations, console/network failures, CTA, обе Метрики, HTTP всех исторических URL.
- `npm audit`: 0 vulnerabilities.
- `artifact-manifest.sha256`: 425 файлов release artifact.

## Осознанные ограничения

- Полные фото-галереи продолжают читаться через same-origin `/assets/`; первый экран и карточки переведены на локальные AVIF/WebP.
- Бизнес-данные, которых нет в официальных источниках, не выдумывались: цены, отзывы, возвраты, медицинские ограничения и парковка требуют подтверждения владельца.
- Полная offline PWA не заявляется; manifest честно использует browser display mode.
- Nginx release/current, security headers, MIME/cache и rollback подготовлены в source. Публичная HTTP-проверка этих настроек выполняется только в отдельном VPS-вороте.
