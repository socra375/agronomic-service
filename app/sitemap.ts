import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/propiedades"), changeFrequency: "daily", priority: 0.9 },
    ...properties.map((p) => ({
      url: absoluteUrl(`/propiedades/${p.slug}`),
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
