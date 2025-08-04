import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/shared/Header";
import { createMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = createMetadata({
  title: "Hunt Compare - Analise suas Sessões de Hunt do Tibia",
  description: "Analise suas sessões de hunt do Tibia com gráficos detalhados, compare armas e proficiências, calcule XP/h e lucro, e otimize sua performance no jogo.",
});

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
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <Header />
              <main className="min-h-screen bg-gray-50 dark:bg-gray-900 theme-transition pt-20">{children}</main>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
