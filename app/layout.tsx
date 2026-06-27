import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";
import "./components.css";
import { SITE } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollTop from "@/components/ScrollTop";
import FavoritesProvider from "@/components/FavoritesProvider";
import JsonLd from "@/components/JsonLd";

const display = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

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
  },
  twitter: { card: "summary_large_image" },
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

const METRIKA_HASKI = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${SITE.metrikaIdHaski}','ym');ym(${SITE.metrikaIdHaski},'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`;

const METRIKA = `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=${SITE.metrikaId}','ym');ym(${SITE.metrikaId},'init',{ssr:true,webvisor:true,clickmap:true,accurateTrackBounce:true,trackLinks:true});`;

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
    <html lang="ru" data-theme="dark" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="preconnect" href="https://haski.parkskazka.ru" crossOrigin="" />
        <link rel="preconnect" href="https://mc.yandex.ru" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: METRIKA_HASKI }} />
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
        </FavoritesProvider>
        <script dangerouslySetInnerHTML={{ __html: METRIKA }} />
        <noscript>
          <img src={`https://mc.yandex.ru/watch/${SITE.metrikaId}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
          <img src={`https://mc.yandex.ru/watch/${SITE.metrikaIdHaski}`} style={{ position: "absolute", left: "-9999px" }} alt="" />
        </noscript>
      </body>
    </html>
  );
}
