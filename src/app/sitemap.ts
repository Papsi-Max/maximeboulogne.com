import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { noteItems } from "@/data/notes";
import { workItems } from "@/data/work";
import { projectItems } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/work`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/notes`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/projects`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = workItems.map((item) => ({
    url: `${siteConfig.url}/work/${item.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const noteRoutes: MetadataRoute.Sitemap = noteItems.map((item) => ({
    url: `${siteConfig.url}/notes/${item.slug}`,
    lastModified: item.date,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectItems.map((item) => ({
    url: `${siteConfig.url}/projects/${item.slug}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...workRoutes, ...noteRoutes, ...projectRoutes];
}
