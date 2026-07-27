import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AUTHOR_NAME } from "@/lib/constants";
import { GithubContributionGraph } from "@/components/github-contribution-graph";
import { localeUrl } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const description = t("metaDescription", { author: AUTHOR_NAME });
  const canonical = localeUrl(locale, "/about");

  return {
    title: "About",
    description,
    alternates: { canonical },
    openGraph: {
      title: "About | Darkmocha",
      description,
      url: canonical,
    },
  };
}

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
