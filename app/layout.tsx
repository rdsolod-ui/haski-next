import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./components.css";
import "./v2.css";
import { SITE } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollTop from "@/components/ScrollTop";
import FavoritesProvider from "@/components/FavoritesProvider";
import JsonLd from "@/components/JsonLd";
import Metrika from "@/components/Metrika";
import PageMotion from "@/components/PageMotion";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default: "Хаски Лэнд в Парке Сказка — северные собаки, профили и билеты",
    template: "%s",
  },
  description:
    "Хаски Лэнд — каталог северных собак Парка Сказка в Москве. Познакомьтесь с хаски, маламутами, самоедами и лайками до визита, выберите любимцев и купите билет.",
  applicationName: SITE.name,
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE.fullName,
    url: SITE.baseUrl,
    images: [{ url: "/img/haski-hero-final.webp", width: 1920, height: 1080, alt: "Хаски Лэнд в Парке Сказка" }],
  },
  twitter: { card: "summary_large_image", images: ["/img/haski-hero-final.webp"] },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.fullName,
  url: SITE.baseUrl,
  inLanguage: "ru-RU",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE.baseUrl}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="dark">
      <head>
        <JsonLd data={websiteLd} />
      </head>
      <body>
        <FavoritesProvider>
          <a className="skip-link" href="#main-content">Перейти к содержимому</a>
          <Header />
          <main className="site-main" id="main-content">{children}</main>
          <Footer />
          <BottomNav />
          <ScrollTop />
          <PageMotion />
        </FavoritesProvider>
        <Metrika />
        <noscript>
          {SITE.metrikaIds.map((id) => (
            <img key={id} src={`https://mc.yandex.ru/watch/${id}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
          ))}
        </noscript>
      </body>
    </html>
  );
}
