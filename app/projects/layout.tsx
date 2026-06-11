import type { Metadata } from "next";
import { SITE_URL, AUTHOR_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Projects",
  description: `${AUTHOR_NAME} が手がけた個人・チーム開発プロジェクト一覧。Next.js・Flutter・Unity など。`,
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    title: "Projects | Darkmocha",
    description: `${AUTHOR_NAME} が手がけた個人・チーム開発プロジェクト一覧。Next.js・Flutter・Unity など。`,
    url: `${SITE_URL}/projects`,
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
