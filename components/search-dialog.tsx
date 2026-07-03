"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, FileText, StickyNote, FolderOpen, ArrowRight, Hash } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { SearchItem } from "@/app/api/search/route";
import { extractSnippet, findMatchedSection } from "@/lib/search-utils";
import { useFocusTrap } from "@/hooks/use-focus-trap";

// ──────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────
const TYPE_LABEL: Record<SearchItem["type"], string> = {
  blog: "Blog",
  note: "Notes",
  project: "Project",
};

const TYPE_ICON: Record<SearchItem["type"], React.ReactNode> = {
  blog:    <FileText   className="w-3.5 h-3.5 shrink-0" />,
  note:    <StickyNote className="w-3.5 h-3.5 shrink-0" />,
  project: <FolderOpen className="w-3.5 h-3.5 shrink-0" />,
};

function highlight(text: string, query: string) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

function scoreItem(item: SearchItem, lq: string): number {
  if (item.title.toLowerCase().includes(lq)) return 4;
  if (item.description.toLowerCase().includes(lq)) return 3;
  if (item.tags.some((t) => t.toLowerCase().includes(lq))) return 2;
  if (item.body?.toLowerCase().includes(lq)) return 1;
  return 0;
}

/**
 * ブログ記事のみ: マッチしたセクションのアンカーを href に付加して返す
 * notes / project はそのまま
 */
function resolveHref(item: SearchItem, query: string): string {
  if (item.type !== "blog" || !item.sections || !query.trim()) return item.href;
  const lq = query.toLowerCase();
  // title/description にマッチしていれば記事トップ
  if (
    item.title.toLowerCase().includes(lq) ||
    item.description.toLowerCase().includes(lq)
  ) return item.href;

  const section = findMatchedSection(item.sections, query);
  if (section?.anchor) return `${item.href}#${section.anchor}`;
  return item.href;
}

// ──────────────────────────────────────────
// Result card
// ──────────────────────────────────────────
type CardProps = {
  item: SearchItem;
  query: string;
  isActive: boolean;
  idx: number;
  onClose: () => void;
  onHover: (idx: number) => void;
};

function ResultCard({ item, query, isActive, idx, onClose, onHover }: CardProps) {
  const href = resolveHref(item, query);
  const lq = query.toLowerCase();

  // どこにマッチしたか判定
  const inTitle = item.title.toLowerCase().includes(lq);
  const inDesc  = item.description.toLowerCase().includes(lq);
  const inBody  = !inTitle && !inDesc && !!item.body?.toLowerCase().includes(lq);

  // セクション（見出し）情報
  const matchedSection =
    item.type === "blog" && item.sections && !inTitle && !inDesc
      ? findMatchedSection(item.sections, query)
      : null;

  // スニペット
  const snippet = inBody && item.body
    ? (matchedSection
        ? extractSnippet(matchedSection.body, query)
        : extractSnippet(item.body, query))
    : null;

  return (
    <li data-idx={idx}>
      <Link
        href={href}
        onClick={onClose}
        onMouseEnter={() => onHover(idx)}
        className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${
          isActive ? "bg-accent text-foreground" : "text-foreground/80 hover:bg-accent/50"
        }`}
      >
        <div className="flex-1 min-w-0">
          {/* 記事タイトル */}
          <p className="text-sm font-medium leading-tight line-clamp-1">
            {highlight(item.title, query)}
          </p>

          {/* マッチしたセクションのバッジ */}
          {matchedSection?.heading && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono text-primary bg-primary/10 rounded px-1.5 py-0.5">
              <Hash className="w-2.5 h-2.5" />
              {matchedSection.heading}
            </span>
          )}

          {/* スニペット or description */}
          {snippet ? (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {highlight(snippet, query)}
            </p>
          ) : item.description ? (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {highlight(item.description, query)}
            </p>
          ) : null}

          {/* タグ */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono text-muted-foreground bg-muted rounded px-1"
                >
                  {highlight(t, query)}
                </span>
              ))}
            </div>
          )}
        </div>

        {isActive && (
          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
        )}
      </Link>
    </li>
  );
}

// ──────────────────────────────────────────
// Main component
// ──────────────────────────────────────────
export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  // fetch index once on first open
  const loadIndex = useCallback(async () => {
    if (index.length > 0) return;
    try {
      const res = await fetch("/api/search");
      const data: SearchItem[] = await res.json();
      setIndex(data);
    } catch { /* ignore */ }
  }, [index.length]);

  // Cmd+K / Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // focus & reset on open
  useEffect(() => {
    if (open) {
      loadIndex();
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIdx(0);
    }
  }, [open, loadIndex]);

  // filter & sort
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lq = query.toLowerCase();
    return index
      .map((item) => ({ item, s: scoreItem(item, lq) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ item }) => item)
      .slice(0, 12);
  }, [query, index]);

  const grouped = useMemo(() =>
    (["blog", "note", "project"] as const).reduce<Record<string, SearchItem[]>>(
      (acc, type) => {
        const f = results.filter((r) => r.type === type);
        if (f.length) acc[type] = f;
        return acc;
      },
      {},
    ),
    [results],
  );

  const flat = useMemo(() => Object.values(grouped).flat(), [grouped]);

  // Enter で navigate
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flat[activeIdx]) {
      router.push(resolveHref(flat[activeIdx], query));
      setOpen(false);
    }
  };

  // scroll active into view
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${activeIdx}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="検索"
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={close}
              className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="search-panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="サイト内検索"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed left-1/2 top-[10vh] z-[70] w-full max-w-lg -translate-x-1/2 px-4 sm:px-0"
            >
              <div className="rounded-xl border border-border bg-background shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border focus-within:border-primary transition-colors">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                    onKeyDown={handleKeyDown}
                    placeholder="記事・ノート・プロジェクトを検索..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} aria-label="クリア"
                      className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">
                    Esc
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {!query.trim() && (
                    <div className="px-5 py-10 text-center text-xs text-muted-foreground">
                      キーワードを入力してください
                      <div className="mt-2 flex items-center justify-center gap-1 opacity-50">
                        <kbd className="text-[10px] border border-border rounded px-1.5 py-0.5 font-mono">⌘</kbd>
                        <kbd className="text-[10px] border border-border rounded px-1.5 py-0.5 font-mono">K</kbd>
                        <span className="ml-1">で開閉</span>
                      </div>
                    </div>
                  )}

                  {query.trim() && flat.length === 0 && (
                    <div className="px-5 py-10 text-center text-xs text-muted-foreground">
                      「{query}」に一致する結果が見つかりませんでした
                    </div>
                  )}

                  {flat.length > 0 && (
                    <ul ref={listRef} className="py-2">
                      {(["blog", "note", "project"] as const).map((type) => {
                        const items = grouped[type];
                        if (!items) return null;
                        let runningIdx = flat.indexOf(items[0]);
                        return (
                          <li key={type}>
                            <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                              <span className="text-primary/50">{TYPE_ICON[type]}</span>
                              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                {TYPE_LABEL[type]}
                              </span>
                            </div>
                            <ul>
                              {items.map((item) => {
                                const idx = runningIdx++;
                                return (
                                  <ResultCard
                                    key={`${item.type}-${item.title}`}
                                    item={item}
                                    query={query}
                                    isActive={idx === activeIdx}
                                    idx={idx}
                                    onClose={close}
                                    onHover={setActiveIdx}
                                  />
                                );
                              })}
                            </ul>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                {flat.length > 0 && (
                  <div className="px-4 py-2 border-t border-border flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <kbd className="border border-border rounded px-1 py-0.5">↑↓</kbd> 移動
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="border border-border rounded px-1 py-0.5">Enter</kbd> 開く
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="border border-border rounded px-1 py-0.5">Esc</kbd> 閉じる
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
