import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vitababy.com.br";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // We can add dynamic service URLs if we have specific service pages in the future,
    // e.g. /servicos/amamentacao
  ];
}
