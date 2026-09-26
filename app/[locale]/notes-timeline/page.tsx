import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllNotes, getAllTags } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";
import { Link } from "@/i18n/navigation";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";
import { EditorialPageHeader } from "@/components/magazine/EditorialPageHeader";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ tag?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "notes" });
  const canonical = localeUrl(locale, "/notes-timeline");

  return {
    title: "Notes",
    description: t("metaDescription"),
    alternates: { canonical, languages: localeAlternates("/notes-timeline") },
    openGraph: {
      title: "Notes | Darkmocha",
      description: t("metaDescription"),
      url: canonical,
    },
  };
}

export default async function NotesTimelinePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("notes");
  const { tag } = await searchParams;
  const allNotes = getAllNotes(locale);
  const allTags = getAllTags(allNotes);
  const notes = tag ? allNotes.filter((n) => n.tags.includes(tag)) : allNotes;

  return (
    <div className="editorial-index editorial-notes-page">
      <EditorialPageHeader
        title="Daily Notes"
        description={t("description")}
        meta={`${notes.length} notes`}
      />

      {/* Tag filter */}
      {allTags.length > 0 && (
        <nav className="editorial-tag-filter" aria-label="Note tags">
          {allTags.map((t) => (
            <Link
              key={t}
              href={tag === t ? "/notes-timeline" : `/notes-timeline?tag=${encodeURIComponent(t)}`}
              className={tag === t ? "is-active" : undefined}
            >
              #{t}
            </Link>
          ))}
        </nav>
      )}

      <NoteTimeline notes={notes} mode="full" activeTag={tag} />
    </div>
  );
}
