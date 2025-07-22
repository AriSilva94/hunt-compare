import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/shared/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hunt Compare",
  description:
    "Gerencie seus dados JSON de forma simples, segura e organizada. Crie registros privados ou públicos e compartilhe com facilidade.",
  keywords: [
    "hunt compare",
    "tibia",
    "json session tracker",
    "xp analysis",
    "loot parser",
    "análise de hunt",
  ],
  authors: [{ name: "Ari Silva" }],
  creator: "Ari Silva",
  metadataBase: new URL("https://www.hunt-compare.com"),
  openGraph: {
    title: "Hunt Compare",
    description:
      "Gerencie seus dados JSON de forma simples, segura e organizada. Crie registros privados ou públicos e compartilhe com facilidade.",
    url: "https://www.hunt-compare.com",
    siteName: "Hunt Compare",
    images: [
      {
        url: "https://www.hunt-compare.com/social.png",
        width: 1200,
        height: 630,
        alt: "Hunt Compare - Sistema de Gerenciamento de Sessões",
        type: "image/png",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hunt Compare",
    description:
      "Gerencie seus dados JSON de forma simples, segura e organizada.",
    images: ["https://www.hunt-compare.com/social.png"],
    creator: "@seu_twitter",
  },
  other: {
    "og:image:secure_url": "https://www.hunt-compare.com/social.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta
          property="og:image"
          content="https://www.hunt-compare.com/social.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta
          name="twitter:image"
          content="https://www.hunt-compare.com/social.png"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
