import type { MetadataRoute } from "next";
import { programs } from "@/content/programs";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/programs", "/private-lessons", "/group-classes", "/how-it-works", "/instructor", "/apply", "/faq", "/contact", "/privacy", "/terms"];
  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "/privacy" || path === "/terms" ? 0.3 : 0.8,
    })),
    ...programs.map((program) => ({
      url: `${site.url}/programs/${program.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
