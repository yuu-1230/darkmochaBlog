import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// 作成したコンポーネントをすべてインポート
import { TitleBar } from "@/components/layout/title-bar";
import { ActivityBar } from "@/components/layout/activity-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { TabBar } from "@/components/layout/tab-bar";
import { StatusBar } from "@/components/layout/status-bar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Darkmocha Blog",
  description: "VS Code Styled Engineer Blog",
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
        {/* 1. Title Bar (最上部: ウィンドウ枠) */}
        <TitleBar />

        {/* 2. Middle Area (ActivityBar + Sidebar + Editor) */}
        <div className="flex flex-1 overflow-hidden w-full">
          {/* 左端: アクティビティバー */}
          <ActivityBar />

          {/* その右: サイドバー (エクスプローラー) */}
          <Sidebar />

          {/* 残りの領域: エディタ (メインコンテンツ) */}
          <main className="flex-1 flex flex-col min-w-0 bg-background relative">
            {/* エディタ上部: タブバー */}
            <TabBar />

            {/* エディタ本文: スクロールエリア */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
              {/* ここにページの中身が表示されます */}
              {children}
            </div>
          </main>
        </div>

        {/* 3. Status Bar (最下部: 青いバー) */}
        <StatusBar />
      </body>
    </html>
  );
}
