import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AnchorScroll } from "@/components/anchor-scroll";
import { MacWindowBar } from "@/components/MacWindowBar";
import { MdxDocument } from "@/components/mdx-document";
import { TableOfContents } from "@/components/TableOfContents";
import { getLocalDoc, isLocalDocsEnabled } from "@/lib/local-docs";
import { generateTOC } from "@/lib/toc";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getLocalDoc(slug);

  return {
    title: doc?.title ?? "Local Docs",
    robots: { index: false, follow: false },
  };
}

export default async function LocalDocPage({ params }: Props) {
  if (!isLocalDocsEnabled()) notFound();

  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doc = await getLocalDoc(slug);
  if (!doc) notFound();

  const toc = generateTOC(doc.content);

  return (
    <div className="pb-20">
      <AnchorScroll />

      <div className="relative">
        {toc.length > 0 && (
          <aside className="hidden min-[1440px]:block absolute inset-y-0 left-[calc(50%+26rem)] w-64">
            <div className="sticky top-32 max-h-[70vh] overflow-y-auto">
              <TableOfContents toc={toc} />
            </div>
          </aside>
        )}

        <article className="max-w-3xl mx-auto bg-card border border-border rounded-xl overflow-hidden">
          <MacWindowBar title={doc.title} />

          <div className="p-6 md:p-10">
            <Link
              href="/docs"
              className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              docs一覧へ戻る
            </Link>

            <p className="mb-8 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-xs font-mono text-muted-foreground">
              localhost only · docs/{doc.slug}.md
            </p>

            {toc.length > 0 && (
              <TableOfContents toc={toc} className="mb-10 min-[1440px]:hidden" />
            )}

            <div className="min-h-[200px]">
              <MdxDocument source={doc.content} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
