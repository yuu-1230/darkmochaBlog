import Image from "next/image";
import Link from "next/link";
import { Terminal } from "lucide-react";
import type { Note } from "@/lib/notes";

const PREVIEW_LIMIT = 2;

type NoteTimelineProps = {
  notes: Note[];
  /** preview: 先頭のみ + 全件ページへの導線 / full: 全件 */
  mode?: "preview" | "full";
  /** mode=preview のときの最大件数 */
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
      aria-label="Daily notes and activity log"
      className="mb-16 px-2 scroll-mt-4 select-text"
    >
      <div className="rounded-t-xl border border-b-0 border-[#3c3c3c] bg-[#252526] px-3 py-2 flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-[#858585] shrink-0" aria-hidden />
        <span className="text-[11px] font-mono text-[#cccccc] tracking-wide">
          OUTPUT — Daily Notes / Logs
          <span className="text-[#858585] font-normal ml-2">
            {isFull ?
              `(all ${notes.length})`
            : `(latest ${displayNotes.length}${
                notes.length > limit ? ` / ${notes.length} total` : ""
              })`}
          </span>
        </span>
      </div>

      <div className="rounded-b-xl border border-[#3c3c3c] border-t-0 bg-[#1e1e1e]/80 p-4 md:p-5">
        <div className="border-l-2 border-[#3c3c3c] ml-2 pl-5 space-y-8">
          {displayNotes.map((note) => (
            <NoteArticle key={note.id} note={note} />
          ))}
        </div>

        <p className="mt-4 pt-3 border-t border-[#333] text-[10px] font-mono text-[#6a9955]">
          ~/content/notes.json — append-only log
          {!isFull && hiddenCount > 0 && (
            <span className="text-[#858585] block mt-1">
              … ほか {hiddenCount} 件は{" "}
              <Link
                href="/notes-timeline"
                className="text-[#3794ff] hover:text-[#4daafc] hover:underline underline-offset-2"
              >
                /notes-timeline
              </Link>{" "}
              で全件表示
            </span>
          )}
        </p>
      </div>
    </section>
  );
}

function NoteArticle({ note }: { note: Note }) {
  return (
    <article className="relative">
      <div
        className="absolute -left-[25px] top-[1px] w-2 h-2 rounded-full bg-[#007acc] ring-4 ring-[#1e1e1e]"
        aria-hidden
      />
      <time
        dateTime={note.createdAt}
        className="block leading-none text-[10px] font-mono text-[#858585] mb-2"
      >
        {new Date(note.createdAt).toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </time>
      <p className="text-sm leading-relaxed text-[#d4d4d4] whitespace-pre-wrap">
        {note.content}
      </p>
      {note.image && (
        <div className="mt-3 relative max-w-md w-full aspect-video rounded-md overflow-hidden border border-[#3c3c3c]">
          <Image
            src={note.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 28rem"
          />
        </div>
      )}
    </article>
  );
}
