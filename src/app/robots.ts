import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vitababy.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portal/",
          "/admin/",
          "/api/",
          "/_next/",
          "/contrato/",
          "/assinar/",
        ],
      },
      // AI Search & Citations (Perplexity, ChatGPT, Claude, Gemini, Copilot, Apple)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Bingbot",
          "Applebot-Extended",
        ],
        allow: ["/", "/galeria", "/agendamento", "/llms.txt"],
        disallow: [
          "/portal/",
          "/admin/",
          "/api/",
          "/_next/",
          "/contrato/",
          "/assinar/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
