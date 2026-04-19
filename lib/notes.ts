import fs from "fs";
import path from "path";

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  image?: string;
}

export function getAllNotes(): Note[] {
  const filePath = path.join(process.cwd(), "content/notes.json");
  if (!fs.existsSync(filePath)) return [];

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const notes = JSON.parse(fileContent) as Note[];
    return notes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
}
