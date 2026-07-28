import fs from "fs";
import path from "path";
import { routing, type Locale } from "@/i18n/routing";

/** ロケールごとの本文。ノートは1件が短いので1ファイル内に日英を並べて持つ */
export type LocalizedText = Record<Locale, string>;

export interface Note {
  id: string;
  /** 表示ロケールに解決済みの本文 */
  content: string;
  createdAt: string;
  image?: string;
  tags: string[];
}

// タイムゾーン未指定の日時はJSTとして扱う
function normalizeDate(dateStr: string): string {
  if (!/Z|[+-]\d{2}:?\d{2}$/.test(dateStr)) {
    return dateStr + "+09:00";
  }
  return dateStr;
}

function extractTags(content: string): string[] {
  const matches = content.match(/#[\wぁ-鿿゠-ヿ一-鿿]+/g);
  return matches ? [...new Set(matches.map((t) => t.slice(1)))] : [];
}

type RawNote = {
  id: string;
  content: LocalizedText;
  createdAt: string;
  image?: string;
};

export function getAllNotes(locale: Locale): Note[] {
  const filePath = path.join(process.cwd(), "content/notes.json");
  if (!fs.existsSync(filePath)) return [];

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const raw = JSON.parse(fileContent) as RawNote[];
    const notes: Note[] = raw.map((n) => ({
      id: n.id,
      image: n.image,
      content: n.content[locale] ?? n.content[routing.defaultLocale],
      createdAt: normalizeDate(n.createdAt),
      // タグはURLのキーになるため、翻訳側でハッシュタグが抜けても揺れないよう
      // 常に既定ロケールの本文から抽出する
      tags: extractTags(n.content[routing.defaultLocale]),
    }));
    return notes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
}

export function getAllTags(notes: Note[]): string[] {
  const tagSet = new Set<string>();
  notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
  return [...tagSet].sort();
}
