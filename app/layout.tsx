import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { TitleBar } from "@/components/layout/title-bar";
import { StatusBar } from "@/components/layout/status-bar";
import { MainLayout } from "@/components/layout/main-layout"; // 新しく作ったやつをインポート

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Darkmocha Blog",
    default: "Darkmocha Blog",
  },
  description: "Next.jsとVS Code風デザインで作られたエンジニアブログ。",
  openGraph: {
    title: "Darkmocha Blog",
    description: "日常の記録とエンジニアの両方を発信するブログ",
    url: "https://your-domain.com",
    siteName: "Darkmocha Blog",
    images: [
      {
        url: "https://your-domain.com/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col`}
      >
        {/* 1. Title Bar */}
        <TitleBar />

        {/* 2. Main Layout (ActivityBar + Sidebar + Editor の機能付きコンテナ) */}
        <MainLayout>{children}</MainLayout>

        {/* 3. Status Bar */}
        <StatusBar />
      </body>
    </html>
  );
}
