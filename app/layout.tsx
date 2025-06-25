import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hunt Compare",
  description: "Easily upload and compare multiple Hunt Analyzer JSON files.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Hunt Compare</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Easily upload and compare multiple Hunt Analyzer JSON files."
        />
        <meta property="og:title" content="Hunt Compare" />
        <meta
          property="og:description"
          content="Visualize and compare your Tibia hunt sessions with charts."
        />
        <meta property="og:image" content="/favicon.png" />
        <meta property="og:url" content="https://hunt-compare.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hunt Compare" />
        <meta
          name="twitter:description"
          content="Visualize and compare your Tibia hunt sessions with charts."
        />
        <meta name="twitter:image" content="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
