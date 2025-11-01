import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://snippetly.xyz"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/contact", "/signin", "/signup", "/privacy-policy", "/terms-of-service"],
        disallow: ["/dashboard/*", "/api/*", "/s/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
