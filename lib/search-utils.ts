/** クエリ周辺のスニペットを切り出す（前後 pad 文字） */
export function extractSnippet(body: string, query: string, pad = 60): string {
  const lq = query.toLowerCase();
  const idx = body.toLowerCase().indexOf(lq);
  if (idx === -1) return body.slice(0, 120);
  const start = Math.max(0, idx - pad);
  const end = Math.min(body.length, idx + query.length + pad);
  return (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
}
