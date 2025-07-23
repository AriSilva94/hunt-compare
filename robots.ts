import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cadastro", "/detalhe", "/home"],
    },
    sitemap: "https://www.hunt-compare.com/sitemap.xml",
  };
}
