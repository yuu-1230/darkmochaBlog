import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const LIFE_KEYWORDS = ["life", "travel", "diary"];
const TECH_KEYWORDS = ["tech", "ai", "programming"];

export function getTagStyle(category?: string, tags?: string[]): React.CSSProperties {
  const targets = [
    category?.toLowerCase() ?? "",
    ...(tags ?? []).map((t) => t.toLowerCase()),
  ];

  if (targets.some((t) => LIFE_KEYWORDS.some((k) => t.includes(k)))) {
    return { background: "var(--tag-bg-life)", color: "var(--tag-fg-life)" };
  }
  if (targets.some((t) => TECH_KEYWORDS.some((k) => t.includes(k)))) {
    return { background: "var(--tag-bg-tech)", color: "var(--tag-fg-tech)" };
  }
  return { background: "var(--tag-bg)", color: "var(--tag-fg)" };
}
