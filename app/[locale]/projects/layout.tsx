import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AUTHOR_NAME } from "@/lib/constants";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const description = t("metaDescription", { author: AUTHOR_NAME });
  const canonical = localeUrl(locale, "/projects");

  return {
    title: "Projects",
    description,
    alternates: { canonical, languages: localeAlternates("/projects") },
    openGraph: {
      title: "Projects | Darkmocha",
      description,
      url: canonical,
    },
  };
}

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
