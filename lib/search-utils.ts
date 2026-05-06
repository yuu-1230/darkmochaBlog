import GithubSlugger from "github-slugger";

export type Section = {
  heading: string; // 見出しテキスト（空文字 = 記事先頭）
  anchor: string;  // rehype-slug が生成するものと同じ ID
  body: string;    // その見出し配下のプレーンテキスト
};

/** MDX を見出し単位でセクションに分割し、アンカーつきで返す */
export function parseSections(raw: string): Section[] {
  const slugger = new GithubSlugger();
  const lines = raw.split("\n");
  const sections: Section[] = [];

  let currentHeading = "";
  let currentAnchor = "";
  let bodyLines: string[] = [];

  const flush = () => {
    const body = stripMdx(bodyLines.join("\n")).trim();
    if (body || currentHeading) {
      sections.push({ heading: currentHeading, anchor: currentAnchor, body });
    }
    bodyLines = [];
  };

  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (m) {
      flush();
      currentHeading = m[2].replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1").trim();
      currentAnchor = slugger.slug(currentHeading);
    } else {
      bodyLines.push(line);
    }
  }
  flush();

  return sections;
}

/** MDX・Markdown 記法をプレーンテキストに変換 */
export function stripMdx(raw: string): string {
  return raw
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, (m) =>
      m.replace(/<[^>]+>/g, ""),
    )
    .replace(/<[A-Z][^/]*(\/?)>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^\|[-|\s]+\|$/gm, "")
    .replace(/^[\s>|*\-]+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** クエリにマッチするセクションを返す（先頭優先） */
export function findMatchedSection(
  sections: Section[],
  query: string,
): Section | null {
  const lq = query.toLowerCase();
  return (
    sections.find((s) => s.body.toLowerCase().includes(lq)) ??
    sections.find((s) => s.heading.toLowerCase().includes(lq)) ??
    null
  );
}

/** クエリ周辺のスニペットを切り出す（前後 pad 文字） */
export function extractSnippet(body: string, query: string, pad = 60): string {
  const lq = query.toLowerCase();
  const idx = body.toLowerCase().indexOf(lq);
  if (idx === -1) return body.slice(0, 120);
  const start = Math.max(0, idx - pad);
  const end = Math.min(body.length, idx + query.length + pad);
  return (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
}
