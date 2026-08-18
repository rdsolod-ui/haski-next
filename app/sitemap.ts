import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { allDogs, allSections, dogSlug } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/dogs`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/sections`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/visit`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contacts`, changeFrequency: "weekly", priority: 0.7 },
  ];
  const sections = allSections().map((s) => ({
    url: `${base}/sections/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const dogs = allDogs().map((d) => ({
    url: `${base}/dogs/${dogSlug(d)}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticPages, ...sections, ...dogs];
}
