import fs from "fs";
import path from "path";

export interface Note {
  id: string;
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

type RawNote = Omit<Note, "tags">;

export function getAllNotes(): Note[] {
  const filePath = path.join(process.cwd(), "content/notes.json");
  if (!fs.existsSync(filePath)) return [];

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const raw = JSON.parse(fileContent) as RawNote[];
    const notes: Note[] = raw.map((n) => ({
      ...n,
      createdAt: normalizeDate(n.createdAt),
      tags: extractTags(n.content),
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
