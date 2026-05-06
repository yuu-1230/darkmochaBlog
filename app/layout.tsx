import type { Metadata } from "next";
import { Yomogi, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const yomogi = Yomogi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.darkmocha.dev",
  ),
  alternates: {
    canonical: "./",
  },
  title: "Darkmocha Blog",
  description: "Engineer and Everyday life Blog by Yuto Nagata",
  icons: {
    icon: "/images/icon.png",
    apple: "/images/icon.png",
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
    name: "Yuto Nagata",
    url: "https://www.darkmocha.dev",
    image: "https://www.darkmocha.dev/images/About/profile.jpg",
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
        className={`${yomogi.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        <SiteHeader />
        <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        <SiteFooter />
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics gaId="G-SFN4E61ERK" />
      </body>
    </html>
  );
}
