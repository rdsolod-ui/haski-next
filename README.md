# Хаски Лэнд — haski.parkskazka.ru

Канонический исходный проект статического сайта Хаски Лэнд в Парке Сказка. Next.js собирает immutable static export для Nginx; production не является местом разработки.

## Контракты, которые нельзя ломать

- Все 39 исторических URL должны оставаться рабочими.
- 30 адресов `/dogs/<slug>` закреплены напечатанными QR-кодами на вольерах. Их нельзя переименовывать или удалять без отдельного решения владельца и redirect map.
- CTA остаётся «Купить билет» и ведёт на `https://prices.parkskazka.com/`.
- Яндекс.Метрика загружается одним тегом и инициализирует оба подтверждённых счётчика: `108579634` и `109784590`.

Контракт маршрутов хранится в `tests/contracts/legacy-routes.json` и проверяется после каждой сборки.

## Локальная работа

Требования: Node.js 22+, npm.

```bash
npm ci
npm run lint
npm run build
npm run test:routes
npm run test:e2e
npm run test:lighthouse
```

Полный контур: `npm run check`. Результат сборки находится в `out/`. Команда `npm run artifact:manifest` добавляет SHA-256 manifest для неизменяемого release artifact.

Адаптивные изображения собак и hero воспроизводимо генерируются командой:

```bash
node scripts/generate-responsive-media.mjs
```

## CI и выпуск

GitHub Actions выполняет lint, production build, проверку 39 исторических URL, browser acceptance в Chromium/WebKit, Lighthouse mobile/desktop и публикует проверенный `out/` как artifact. Dependency tree должен проходить `npm audit` без уязвимостей.

Production-схема:

```text
/var/www/haski-next/
├── releases/<timestamp>-<sha>/
├── current -> releases/<active>
└── backups/
```

Nginx-конфигурация находится в `haski-nginx.conf`, security headers — в `ops/nginx/haski-security-headers.conf`, атомарный выпуск с проверкой hash/smoke/rollback — в `ops/deploy-release.sh`. GitHub push и VPS deployment являются разными воротами; серверный выпуск выполняется только после отдельного подтверждения владельца.

## Осознанный backlog

- Полные галереи пока читаются из существующего same-origin `/assets/`; адаптивные обложки и hero уже принадлежат immutable artifact.
- Цены, отзывы, медицинские ограничения, возвраты, парковка и новые коммерческие обещания не публикуются без подтверждённых бизнес-данных.
- Manifest честно заявляет browser-mode: offline/PWA не обещается без service worker, offline fallback и update flow.
- Полный редизайн и moodboard требуют отдельного визуального утверждения; текущий выпуск стабилизирует и развивает существующую концепцию.
