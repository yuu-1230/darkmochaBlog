import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FileText, FolderOpen, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAllLocalDocs, isLocalDocsEnabled } from "@/lib/local-docs";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export const metadata: Metadata = {
  title: "Local Docs",
  robots: { index: false, follow: false },
};

export default async function LocalDocsPage({ params }: Props) {
  if (!isLocalDocsEnabled()) notFound();

  const { locale } = await params;
  setRequestLocale(locale);
  const docs = await getAllLocalDocs();

  return (
    <div className="py-4 max-w-3xl mx-auto">
      <header className="space-y-3 border-b border-border pb-8 mb-8">
        <p className="text-xs font-mono text-primary uppercase tracking-widest">
          {"// localhost only"}
        </p>
        <div className="flex items-center gap-3">
          <FolderOpen className="w-7 h-7 text-primary" aria-hidden />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Project Docs
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          リポジトリの <code>docs/</code> にあるMarkdown資料です。本番環境では表示されません。
        </p>
      </header>

      {docs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          表示できるドキュメントがありません。
        </p>
      ) : (
        <ul className="grid gap-3">
          {docs.map((doc) => (
            <li key={doc.slug}>
              <Link
                href={`/docs/${doc.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <FileText
                  className="w-5 h-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">
                    {doc.title}
                  </span>
                  <span className="block truncate text-xs font-mono text-muted-foreground mt-1">
                    docs/{doc.slug}.md
                  </span>
                </span>
                <ArrowRight
                  className="w-4 h-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
