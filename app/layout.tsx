import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { TitleBar } from "@/components/layout/title-bar";
import { StatusBar } from "@/components/layout/status-bar";
import { MainLayout } from "@/components/layout/main-layout";
// 👇 記事取得ロジックとツリー生成関数をインポート
import { getAllPosts } from "@/lib/mdx";
import { generateFileTree } from "@/lib/file-tree";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
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
}: {
  children: React.ReactNode;
}) {
  // 1. サーバー側で記事全件取得 (ファイル操作OK)
  const posts = getAllPosts();

  // 2. ツリー構造を生成
  const fileTree = generateFileTree(posts);

  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col`}
      >
        <TitleBar />

        {/* 3. MainLayout にツリーを渡す */}
        <MainLayout tree={fileTree}>{children}</MainLayout>

        <StatusBar />
      </body>
    </html>
  );
}
