import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Note } from "@/lib/notes";
import { OgpCard } from "@/components/ogp-card";
import { extractUrls } from "@/lib/ogp";
import { BCP47, type Locale } from "@/i18n/routing";

const PREVIEW_LIMIT = 2;

type NoteTimelineProps = {
  notes: Note[];
  mode?: "preview" | "full";
  limit?: number;
  activeTag?: string;
};

export async function NoteTimeline({
  notes,
  mode = "preview",
  limit = PREVIEW_LIMIT,
  activeTag,
}: NoteTimelineProps) {
  const t = await getTranslations("notes");

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {activeTag ? t("emptyTag", { tag: activeTag }) : t("empty")}
      </p>
    );
  }

  const isFull = mode === "full";
  const displayNotes = isFull ? notes : notes.slice(0, limit);
  const hiddenCount = isFull ? 0 : Math.max(0, notes.length - displayNotes.length);

  return (
    <section
      id={isFull ? "notes-timeline" : "daily-notes"}
      aria-label={t("sectionLabel")}
      className="select-text"
    >
      {/* Section label (preview mode only) */}
      {!isFull && (
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
          <span className="text-primary/60">{"//"}</span>
          notes
          <span className="text-muted-foreground font-normal normal-case tracking-normal">
            ({notes.length})
          </span>
        </h2>
      )}

      {/* Active tag filter indicator */}
      {isFull && activeTag && (
        <div className="mb-8 flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">{t("filtering")}</span>
          <span className="inline-flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            #{activeTag}
          </span>
          <Link
            href="/notes-timeline"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
          >
            {t("clear")}
          </Link>
        </div>
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
            {t("more", { count: hiddenCount })}
          </Link>
        </div>
      )}
    </section>
  );
}

function resolveImageSrc(image: string): string {
  if (image.startsWith("http") || image.startsWith("/")) return image;
  return `/images/Notes/${image}`;
}

function NoteContent({ content }: { content: string }) {
  const parts = content.split(/(#[\wぁ-鿿゠-ヿ一-鿿]+|https?:\/\/[^\s]+)/g);
  return (
    <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
      {parts.map((part, i) => {
        if (part.startsWith("#")) {
          const tag = part.slice(1);
          return (
            <Link
              key={i}
              href={`/notes-timeline?tag=${encodeURIComponent(tag)}`}
              className="text-primary/80 hover:text-primary font-mono text-xs hover:underline underline-offset-2 transition-colors"
            >
              {part}
            </Link>
          );
        }
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/80 hover:text-primary text-xs hover:underline underline-offset-2 transition-colors break-all"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

async function NoteArticle({ note, isLast }: { note: Note; isLast: boolean }) {
  const t = await getTranslations("notes");
  const locale = (await getLocale()) as Locale;

  const dateStr = new Date(note.createdAt).toLocaleString(BCP47[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  });

  const urls = extractUrls(note.content);

  return (
    <article className="flex gap-4 group" style={{ contentVisibility: "auto", containIntrinsicSize: "0 120px" }}>
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0 pt-1">
        <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary ring-4 ring-background transition-colors shrink-0 mt-0.5" />
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
        <NoteContent content={note.content} />
        {urls.map((url) => (
          <OgpCard key={url} url={url} />
        ))}
        {note.image && (
          <div className="mt-3 max-w-sm w-full rounded-lg overflow-hidden border border-border relative"
            style={{ aspectRatio: "4/3" }}>
            <Image
              src={resolveImageSrc(note.image)}
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 768px) 100vw, 24rem"
              className="object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </article>
  );
}
