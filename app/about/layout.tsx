import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "長野県出身の学生エンジニア Yuto Nagata のプロフィール。Web開発・Unity・旅行が好き。",
  alternates: { canonical: "https://www.darkmocha.dev/about" },
  openGraph: {
    title: "About | Darkmocha",
    description: "長野県出身の学生エンジニア Yuto Nagata のプロフィール。Web開発・Unity・旅行が好き。",
    url: "https://www.darkmocha.dev/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
