import type { Metadata } from "next";
import { SITE_URL, AUTHOR_NAME } from "@/lib/constants";
import { GithubContributionGraph } from "@/components/github-contribution-graph";

export const metadata: Metadata = {
  title: "About",
  description: `長野県出身の学生エンジニア ${AUTHOR_NAME} のプロフィール。Web開発・Unity・旅行が好き。`,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About | Darkmocha",
    description: `長野県出身の学生エンジニア ${AUTHOR_NAME} のプロフィール。Web開発・Unity・旅行が好き。`,
    url: `${SITE_URL}/about`,
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="max-w-3xl mx-auto pb-12">
        <GithubContributionGraph />
      </div>
    </>
  );
}
