import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Yuto Nagata が手がけた個人・チーム開発プロジェクト一覧。Next.js・Flutter・Unity など。",
  alternates: { canonical: "https://www.darkmocha.dev/projects" },
  openGraph: {
    title: "Projects | Darkmocha",
    description: "Yuto Nagata が手がけた個人・チーム開発プロジェクト一覧。Next.js・Flutter・Unity など。",
    url: "https://www.darkmocha.dev/projects",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
