import type { PostData } from "@/lib/mdx";

export const placements = ["top-left", "top-right", "center", "bottom-left", "bottom-right"] as const;
export const backgrounds = ["paper", "sand", "rust", "sage", "sky", "ink"] as const;
export type Placement = typeof placements[number];
export type Background = typeof backgrounds[number];
export type CoverSettings = {
  mode?: "composed" | "image";
  template?: "overlay" | "vertical" | "split" | "typographic";
  image?: string;
  title?: string;
  subtitle?: string;
  label?: string;
  placement?: Placement;
  titleSize?: "small" | "medium" | "large";
  imageZoom?: number;
  titleFontSize?: number;
  subtitleFontSize?: number;
  labelFontSize?: number;
  focal?: string;
  tone?: "light" | "dark";
  overlay?: "none" | "local";
  background?: Background;
  textSide?: "top" | "bottom";
  imageFit?: "cover" | "contain";
};
export type ReaderSettings = {
  schemaVersion?: 2;
  articleId?: string;
  pages?: import("./remark-magazine-plan").PlannedPage[];
  mode?: "magazine" | "flow";
  /** Compatibility with the first prototype; new articles use Page props. */
  title?: string;
  subtitle?: string;
  image?: string;
  focal?: string;
};
export type PageSettings = {
  composition?: string;
  balance?: "text" | "photo";
  id?: string;
  template?: "opening" | "photo" | "editorial" | "text" | "gallery" | "spotlight" | "feature";
  background?: Background;
  image?: string;
  focal?: string;
  title?: string;
  subtitle?: string;
  placement?: Placement;
  tone?: "light" | "dark";
  overlay?: "none" | "local";
  columns?: 1 | 2;
  layout?: "bleed" | "inset" | "photo-left" | "photo-right" | "pair" | "stack" | "one-plus-two" | "portrait" | "landscape" | "mosaic" | "data";
};
export type PhotoSettings = {
  assetId?: string;
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  kind?: 'photo'|'diagram'|'screenshot';
  shape?: "rect" | "circle";
  size?: "small" | "medium" | "large";
  fit?: "contain" | "cover";
  ratio?: "original" | "square" | "portrait" | "landscape";
  focal?: string;
  placement?: "lead" | "support" | "inline" | "left" | "right" | Placement;
  wrap?: "none" | "around";
};

/** Newest publication first, independent of cover settings and pinned status. */
export function homePosts(posts: PostData[], limit = 6) {
  return posts.filter(p => !p.frontmatter.draft)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date) || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}

export function isMagazineRoute(pathname: string) {
  return pathname === "/" || pathname === "/docs/magazine-layouts" || /^\/blog\/[^/]+$/.test(pathname);
}

export function spreadForPage(index: number) {
  return Math.floor(Math.max(0, index) / 2);
}

/** Ignore fenced examples when choosing the article reader. */
export function hasMagazinePages(source: string) {
  let fence: {char:string;length:number} | null = null;
  for (const line of source.split("\n")) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = {char:marker[1][0],length:marker[1].length};
      else if (marker[1][0] === fence.char && marker[1].length >= fence.length) fence = null;
      continue;
    }
    if (!fence && /^<Spread(?:\s|>)/.test(line)) return true;
  }
  return false;
}
