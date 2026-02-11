import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { MainLayout } from "@/components/layout/main-layout";
import { getAllPosts } from "@/lib/mdx";
import { generateFileTree } from "@/lib/file-tree";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yuto Nagata",
    url: "https://darkmocha.dev",
    image: "https://darkmocha.dev/images/About/profile.jpg",
    jobTitle: "Student Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Suwa Univ. of science",
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Nagano",
      addressCountry: "JP",
    },
    sameAs: [
      "https://github.com/yuu-1230",
      "https://twitter.com/DarkmochaJP",
      "https://bsky.app/profile/darkmochajapan.bsky.social",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "Unity",
      "Web Development",
      "Game Development",
    ],
  };
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col`}
      >
        <MainLayout tree={fileTree}>{children}</MainLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}
