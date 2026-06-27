// Единая точка истины по внешним ссылкам и идентификаторам.
// Значения 1:1 с продакшеном (app/config/config.php).

export const SITE = {
  name: "Хаски Лэнд",
  fullName: "Хаски Лэнд — Парк Сказка",
  baseUrl: "https://haski.parkskazka.ru",
  phone: "+7 (495) 133-65-56",
  phoneHref: "+74951336556",
  parkUrl: "https://parkskazka.com/",
  ticketsUrl: "https://prices.parkskazka.com/",
  metrikaId: "108579634",
  // Отдельный счётчик для haski.parkskazka.ru (добавлен 2026-06-11)
  metrikaIdHaski: "109784590",
} as const;

// Изображения уже лежат на боевом домене (тот же домен после катовера).
// Это даёт реальные фото в dev/аудите и на проде без переноса гигабайтов.
export const IMG_BASE = "https://haski.parkskazka.ru/assets/images/";

export function img(path: string): string {
  return IMG_BASE + path.replace(/^\/+/, "");
}
