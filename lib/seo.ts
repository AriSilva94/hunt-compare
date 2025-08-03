import type { Metadata } from "next";

const siteConfig = {
  name: "Hunt Compare",
  description: "Analise suas sessões de hunt do Tibia com gráficos detalhados, compare armas e proficiências, e otimize sua performance no jogo.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hunt-compare.vercel.app",
  ogImage: "/images/social.png",
  author: "Ari Silva",
  twitter: "@hunt_compare",
  keywords: [
    "tibia hunt analysis",
    "tibia xp calculator", 
    "tibia profit tracker",
    "tibia session analyzer",
    "mmo analytics",
    "gaming statistics",
    "tibia tools",
    "hunt tracker",
    "xp/h calculator",
    "loot analyzer",
    "tibia weapons",
    "proficiencies calculator",
    "hunt comparison",
    "tibia efficiency",
    "session tracker"
  ]
};

export function createMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    alternates: {
      canonical: path ? `${siteConfig.url}${path}` : siteConfig.url,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      alternateLocale: ["en_US"],
      url: path ? `${siteConfig.url}${path}` : siteConfig.url,
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      images: [image || siteConfig.ogImage],
      creator: siteConfig.twitter,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

export { siteConfig };