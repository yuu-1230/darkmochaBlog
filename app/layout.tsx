import type { Metadata } from "next";
import { Yomogi, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { SITE_URL, AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants";

const yomogi = Yomogi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",   // フォント未読み込み中はフォールバックフォントで表示
  preload: false,    // 日本語フォントは巨大なので preload しない
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || SITE_URL),
  title: {
    default: "Darkmocha Blog",
    template: "%s | Darkmocha",
  },
  description: "Engineer and Everyday life Blog by Yuto Nagata",
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "Darkmocha Blog",
    title: "Darkmocha Blog",
    description: "Engineer and Everyday life Blog by Yuto Nagata",
    images: [{ url: "/images/OG.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DarkmochaJP",
    creator: "@DarkmochaJP",
    title: "Darkmocha Blog",
    description: "Engineer and Everyday life Blog by Yuto Nagata",
    images: ["/images/OG.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    image: `${SITE_URL}/images/About/profile.jpg`,
    jobTitle: "Student Engineer",
    worksFor: { "@type": "Organization", name: "Suwa Univ. of science" },
    address: { "@type": "PostalAddress", addressRegion: "Nagano", addressCountry: "JP" },
    sameAs: [
      "https://github.com/yuu-1230",
      "https://twitter.com/DarkmochaJP",
      "https://bsky.app/profile/darkmochajapan.bsky.social",
    ],
    knowsAbout: ["Next.js", "React", "Unity", "Web Development", "Game Development"],
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${yomogi.variable} ${jetbrainsMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:border focus:border-border"
          >
            本文へスキップ
          </a>
          <SiteHeader />
          <main id="main-content" className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {children}
          </main>
          <SiteFooter />
        </Providers>
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-SFN4E61ERK" />
      </body>
    </html>
  );
}
