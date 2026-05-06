import type { Metadata } from "next";
import { getAllNotes, getAllTags } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notes",
  description: "短文ログ（Daily Notes）の一覧",
  alternates: { canonical: "https://www.darkmocha.dev/notes-timeline" },
  openGraph: {
    title: "Notes | Darkmocha",
    description: "短文ログ（Daily Notes）の一覧",
    url: "https://www.darkmocha.dev/notes-timeline",
  },
};

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function NotesTimelinePage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const allNotes = getAllNotes();
  const allTags = getAllTags(allNotes);
  const notes = tag ? allNotes.filter((n) => n.tags.includes(tag)) : allNotes;

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <header className="space-y-2 border-b border-border pb-8 mb-10">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          // notes
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Daily Notes
        </h1>
        <p className="text-sm text-muted-foreground">
          日々の短い思考・メモのログ。
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
