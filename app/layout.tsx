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
  creator: "Ariovaldo Silva",
  metadataBase: new URL("https://huntcompare.com"),
  openGraph: {
    title: "Hunt Compare",
    description:
      "Gerencie seus dados JSON de forma simples, segura e organizada. Crie registros privados ou públicos e compartilhe com facilidade.",
    url: "https://huntcompare.com",
    siteName: "Hunt Compare",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "Hunt Compare Preview Image",
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
    images: ["/social.png"],
    creator: "@seu_twitter",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
