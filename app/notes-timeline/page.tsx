import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";

export const metadata: Metadata = {
  title: "Notes | Darkmocha",
  description: "短文ログ（Daily Notes）の一覧",
};

export default function NotesTimelinePage() {
  const notes = getAllNotes();

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <header className="space-y-2 border-b border-border pb-8 mb-12">
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

      <NoteTimeline notes={notes} mode="full" />
    </div>
  );
}
