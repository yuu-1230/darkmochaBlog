"use client";

import { useEffect } from "react";

interface CategoryThemeApplierProps {
  category?: string;
}

/**
 * 記事のカテゴリを html[data-category] に付与することで、
 * ヘッダー含む全ページにカテゴリテーマを伝播させる。
 * アンマウント時に属性を削除してデフォルトに戻す。
 */
export function CategoryThemeApplier({ category }: CategoryThemeApplierProps) {
  useEffect(() => {
    const html = document.documentElement;
    if (category) {
      html.setAttribute("data-category", category.toLowerCase());
    }
    return () => {
      html.removeAttribute("data-category");
    };
  }, [category]);

  return null;
}
