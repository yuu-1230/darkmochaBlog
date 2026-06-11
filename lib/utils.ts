import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type React from "react"
import type { Category } from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DEFAULT_TAG_STYLE: React.CSSProperties = {
  background: "var(--tag-bg)",
  color: "var(--tag-fg)",
};

const CATEGORY_TAG_STYLES: Record<Category, React.CSSProperties> = {
  Tech: { background: "var(--tag-bg-tech)", color: "var(--tag-fg-tech)" },
  Life: { background: "var(--tag-bg-life)", color: "var(--tag-fg-life)" },
  Unity: DEFAULT_TAG_STYLE,
};

export function getTagStyle(category?: string): React.CSSProperties {
  return CATEGORY_TAG_STYLES[category as Category] ?? DEFAULT_TAG_STYLE;
}
