import GithubSlugger from "github-slugger";

export interface TOCEntry {
  level: number;
  text: string;
  id: string;
  numberLabel: string;
}

/** 目次（TOC）を自動生成＆番号付けする */
export function generateTOC(content: string): TOCEntry[] {
  const slugger = new GithubSlugger();
  let h2Count = 0;
  let h3Count = 0;

  return Array.from(content.matchAll(/^(##|###)\s+(.*)$/gm)).map((match) => {
    const level = match[1].length;
    const rawText = match[2].trim();
    const id = slugger.slug(rawText);

    let numberLabel = "";
    if (level === 2) {
      h2Count++;
      h3Count = 0;
      numberLabel = `${h2Count}`;
    } else if (level === 3) {
      h3Count++;
      numberLabel = `${h2Count}-${h3Count}`;
    }

    return { level, text: rawText, id, numberLabel };
  });
}
