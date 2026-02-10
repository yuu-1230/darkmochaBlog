import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { StatusBar } from "@/components/layout/status-bar";
import { MainLayout } from "@/components/layout/main-layout";
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
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getAllPosts();
  const fileTree = generateFileTree(posts);

  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col`}
      >
        <MainLayout tree={fileTree}>{children}</MainLayout>

        <StatusBar />
      </body>
    </html>
  );
}
