/** Keep visible MDX attribute text searchable before the existing tag stripper runs. */
export function expandMagazineText(raw: string): string {
  return raw.replace(/<(Photo|Page)\b(?:"[^"]*"|'[^']*'|\{[^}]*\}|[^'">])*\/?>/g, (tag, name: string) => {
    const fields = name === "Photo" ? ["caption"] : ["title", "subtitle"];
    const text = [...tag.matchAll(/\b(title|subtitle|caption)\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/g)]
      .filter(match => fields.includes(match[1]))
      .map(match => {
        const value = match[2];
        if (value.startsWith("{")) {
          try { const parsed = JSON.parse(value.slice(1,-1)); return typeof parsed === "string" ? parsed : ""; } catch { return ""; }
        }
        return value.slice(1,-1).replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
      });
    return `${text.join("\n")}\n<${name}${tag.endsWith("/>") ? " /" : ""}>`;
  });
}
