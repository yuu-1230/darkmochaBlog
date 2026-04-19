import Image from "next/image";
import { Terminal } from "lucide-react";
import type { Note } from "@/lib/notes";

export function NoteTimeline({ notes }: { notes: Note[] }) {
  if (notes.length === 0) return null;

  return (
    <section
      id="daily-notes"
      aria-label="Daily notes and activity log"
      className="mb-16 px-2 scroll-mt-4 select-text"
    >
      {/* ターミナル / Output パネル風ヘッダー */}
      <div className="rounded-t-xl border border-b-0 border-[#3c3c3c] bg-[#252526] px-3 py-2 flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-[#858585] shrink-0" aria-hidden />
        <span className="text-[11px] font-mono text-[#cccccc] tracking-wide">
          OUTPUT — Daily Notes / Logs
        </span>
      </div>

      <div className="rounded-b-xl border border-[#3c3c3c] border-t-0 bg-[#1e1e1e]/80 p-4 md:p-5">
        <div className="border-l border-[#3c3c3c] ml-2 pl-5 space-y-8">
          {notes.map((note) => (
            <article key={note.id} className="relative">
              <div
                className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-[#007acc] ring-4 ring-[#1e1e1e]"
                aria-hidden
              />
              <time
                dateTime={note.createdAt}
                className="block text-[10px] font-mono text-[#858585] mb-1.5"
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
          ))}
        </div>

        <p className="mt-4 pt-3 border-t border-[#333] text-[10px] font-mono text-[#6a9955]">
          {/* コメント風のヒント */}
          ~/content/notes.json — append-only log
        </p>
      </div>
    </section>
  );
}
