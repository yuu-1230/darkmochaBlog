import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllNotes, getAllTags } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";
import { Link } from "@/i18n/navigation";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

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
  const allNotes = getAllNotes();
  const allTags = getAllTags(allNotes);
  const notes = tag ? allNotes.filter((n) => n.tags.includes(tag)) : allNotes;

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <header className="space-y-2 border-b border-border pb-8 mb-10">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// notes"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Daily Notes
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("description")}
        </p>
      </header>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {allTags.map((t) => (
            <Link
              key={t}
              href={tag === t ? "/notes-timeline" : `/notes-timeline?tag=${encodeURIComponent(t)}`}
              className={`text-xs font-mono px-2.5 py-1 rounded-full border transition-colors ${
                tag === t
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              #{t}
            </Link>
          ))}
        </div>
      )}

      <NoteTimeline notes={notes} mode="full" activeTag={tag} />
    </div>
  );
}
