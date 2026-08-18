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
  officialHuskyUrl: "https://parkskazka.com/places/husky/",
  officialContactsUrl: "https://parkskazka.com/kontakty/",
  officialFaqUrl: "https://parkskazka.com/faq/",
  address: "Москва, ул. Крылатская, 18",
  email: "info@parkskazka.com",
  parkHoursRegular: "Пн–Чт, Вс: 10:00–22:00",
  parkHoursWeekend: "Пт–Сб: 10:00–23:00",
  // Оба счётчика подтверждены владельцем 2026-08-17. tag.js загружается один раз.
  metrikaIds: ["108579634", "109784590"],
} as const;

// Изображения уже лежат на боевом домене (тот же домен после катовера).
// Это даёт реальные фото в dev/аудите и на проде без переноса гигабайтов.
export const IMG_BASE = "https://haski.parkskazka.ru/assets/images/";

export function img(path: string): string {
  return IMG_BASE + path.replace(/^\/+/, "");
}
