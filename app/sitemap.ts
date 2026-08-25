import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { allDogs, allSections, dogSlug } from "@/lib/data";

export const dynamic = "force-static";
const RELEASE_LAST_MODIFIED = "2026-08-25";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/dogs`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/sections`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/visit`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contacts`, lastModified: RELEASE_LAST_MODIFIED, changeFrequency: "weekly", priority: 0.7 },
  ];
  const sections = allSections().map((s) => ({
    url: `${base}/sections/${s.slug}`,
    lastModified: RELEASE_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const dogs = allDogs().map((d) => ({
    url: `${base}/dogs/${dogSlug(d)}`,
    lastModified: RELEASE_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticPages, ...sections, ...dogs];
}
