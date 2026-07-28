import { getTranslations } from "next-intl/server";
import { ArrowLeft, Languages } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MacWindowBar } from "@/components/MacWindowBar";
import type { Locale } from "@/i18n/routing";

type Props = {
  /** 記事が存在するロケール（この言語版へ誘導する） */
  availableLocale: Locale;
  slug: string;
  /** 存在する側のタイトル。翻訳前でも何の記事か分かるように出す */
  title: string;
};

/**
 * 記事はあるが、いま見ている言語版がまだ無い場合に出す案内。
 * 404 にはせず、存在する言語版へのリンクを添える。
 */
export async function TranslationUnavailable({
  availableLocale,
  slug,
  title,
}: Props) {
  const t = await getTranslations("post.untranslated");

  return (
    <div className="py-16 max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <MacWindowBar title={title} />
        <div className="p-8 md:p-12 space-y-6">
          <div className="flex items-center gap-2.5 text-primary">
            <Languages className="w-5 h-5" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {t("title")}
            </h1>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {t("body")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {/*
              locale prop 付きの Link は forcePrefix が効くため /ja/blog/... を出す。
              これは冗長に見えるが意図的で、proxy.ts の cookie リダイレクトを
              サーバー側で確実に上書きできる唯一の形。プレフィックス無しの
              /blog/... にすると cookie が en のまま戻されてしまう。
            */}
            <Link
              href={`/blog/${slug}`}
              locale={availableLocale}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary/40 bg-primary/10 text-sm text-primary hover:bg-primary/20 transition-colors"
            >
              {t("readInOtherLanguage", { language: t(`languages.${availableLocale}`) })}
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToList")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
