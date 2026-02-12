import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { MainLayout } from "@/components/layout/main-layout";
import { getAllPosts } from "@/lib/mdx";
import { generateFileTree } from "@/lib/file-tree";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://darkmocha.dev",
  ),
  title: "Darkmocha Blog",
  description: "Engineer and Everyday life Blog by Yuto Nagata",
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <MainLayout tree={fileTree}>{children}</MainLayout>
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-SFN4E61ERK" />
      </body>
    </html>
  );
}
