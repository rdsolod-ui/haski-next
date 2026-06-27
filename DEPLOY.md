# Хаски Лэнд — Next.js (static export). Деплой и катовер

Новый сайт собран как **статический экспорт** Next.js (`output: "export"`) →
папка `out/` с готовым HTML/CSS/JS. Node-рантайм на сервере НЕ нужен —
раздаётся тем же nginx, что и текущий PHP.

## Сборка
```bash
npm install
npm run build       # → out/ (44 страницы: /, /search, /sections, 6 разделов, 30 собак, 404, sitemap, robots)
```

## Локальный просмотр
```bash
npx serve out -l 4321     # http://localhost:4321  (чистые URL: /dogs/adel и т.п.)
```

## Что внутри out/
- `index.html`, `search.html`, `sections.html`, `sections/<slug>.html`, `dogs/<slug>.html`
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, иконки
- `_next/` — хешированные CSS/JS (кешируются навсегда)
- `.txt` файлы рядом — RSC-пейлоады для client-навигации (можно раздавать, можно игнорировать)

## Изображения
Фото собак НЕ копируются в проект — ссылки идут на боевой домен
`https://haski.parkskazka.ru/assets/images/...` (см. `lib/constants.ts` → `IMG_BASE`).
После катовера это тот же домен, поэтому пути валидны. Если переносить картинки
в `out/` — поменяйте `IMG_BASE` на `/assets/images/` и положите `assets/images/` рядом.

## nginx (пример)
Нужны: чистые URL без `.html` и SPA-fallback на 404.
```nginx
server {
    server_name haski.parkskazka.ru;
    root /var/www/haski-next/out;
    index index.html;

    # отдаём /path → /path.html, иначе каталог, иначе 404
    location / {
        try_files $uri $uri.html $uri/ /404.html;
    }
    location /_next/ {           # вечный кеш хешированных ассетов
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    error_page 404 /404.html;
}
```

## КАТОВЕР (важно — делать осознанно)
Сейчас прод (`/var/www/haski.parkskazka.ru`, PHP) **не тронут**. Переключение:
1. Залить `out/` на сервер (например `/var/www/haski-next/out`).
2. Сверить SEO-паритет: все URL `/`, `/search`, `/sections/<slug>`, `/dogs/<slug>`
   отдают 200; `sitemap.xml`/`robots.txt` на месте; canonical/OG/JSON-LD совпадают.
3. Переключить `root` nginx на новую папку (или симлинк) и `nginx -s reload`.
4. Откат — вернуть `root` на PHP-проект (мгновенно).

⚠️ Маршруты 1:1 со старым сайтом, данные собак те же (`data/dogs.json`),
SEO зеркалировано. Но это **смена платформы** — после катовера проверьте
Яндекс.Вебмастер (переобход) и Метрику (счётчик `108579634` уже встроен).

## Стек
Next.js 16 · React 19 · Tailwind v4 · Framer Motion · next/font (Unbounded + Manrope).
Дизайн-система — `app/globals.css` (токены, fluid-type) + `app/components.css`.
