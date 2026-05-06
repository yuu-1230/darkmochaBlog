import Image from "next/image";
import Link from "next/link";
import type { Note } from "@/lib/notes";

const PREVIEW_LIMIT = 2;

type NoteTimelineProps = {
  notes: Note[];
  mode?: "preview" | "full";
  limit?: number;
};

export function NoteTimeline({
  notes,
  mode = "preview",
  limit = PREVIEW_LIMIT,
}: NoteTimelineProps) {
  if (notes.length === 0) return null;

  const isFull = mode === "full";
  const displayNotes = isFull ? notes : notes.slice(0, limit);
  const hiddenCount = isFull ? 0 : Math.max(0, notes.length - displayNotes.length);

  return (
    <section
      id={isFull ? "notes-timeline" : "daily-notes"}
      aria-label="Daily notes"
      className="select-text"
    >
      {/* Section label (preview mode only) */}
      {!isFull && (
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="text-primary/60">//</span>
          notes
          <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">
            ({notes.length})
          </span>
        </h2>
      )}

      {/* Thread-style list */}
      <div className="space-y-0">
        {displayNotes.map((note, index) => (
          <NoteArticle
            key={note.id}
            note={note}
            isLast={index === displayNotes.length - 1 && (isFull || hiddenCount === 0)}
          />
        ))}
      </div>

      {/* "More" footer */}
      {!isFull && hiddenCount > 0 && (
        <div className="mt-4 pl-10">
          <Link
            href="/notes-timeline"
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            ほか {hiddenCount} 件 →
          </Link>
        </div>
      )}
    </section>
  );
}

function NoteArticle({ note, isLast }: { note: Note; isLast: boolean }) {
  const dateStr = new Date(note.createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="flex gap-4 group">
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        {/* Dot */}
        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary ring-4 ring-background transition-colors shrink-0 mt-0.5" />
        {/* Vertical line */}
        {!isLast && (
          <div className="w-px flex-1 bg-border mt-2 min-h-[2rem]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 min-w-0">
        <time
          dateTime={note.createdAt}
          className="block text-[11px] font-mono text-muted-foreground mb-1.5"
        >
          {dateStr}
        </time>
        <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {note.content}
        </p>
        {note.image && (
          <div className="mt-3 relative max-w-sm w-full aspect-video rounded-lg overflow-hidden border border-border">
            <Image
              src={note.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 24rem"
            />
          </div>
        )}
      </div>
    </article>
  );
}
