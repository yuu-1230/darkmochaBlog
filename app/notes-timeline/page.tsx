import type { Metadata } from "next";
import { getAllNotes } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";

export const metadata: Metadata = {
  title: "Notes Timeline | Darkmocha",
  description: "短文ログ（Daily Notes）の一覧",
};

export default function NotesTimelinePage() {
  const notes = getAllNotes();

  return (
    <div className="relative h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans overflow-y-auto p-4 md:p-12 select-none scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto z-10 relative pb-20">
        <header className="mb-10 px-2 border-b border-[#333] pb-6">
          <p className="text-[10px] font-mono text-[#858585] mb-2">
            notes-timeline.tsx
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-[#cccccc]">
            Daily Notes / Logs
          </h1>
        </header>
        <NoteTimeline notes={notes} mode="full" />
      </div>
    </div>
  );
}
