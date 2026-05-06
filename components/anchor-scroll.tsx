"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * URL の #hash に対応する見出しを画面中央にスクロールする。
 * ブラウザのデフォルト（先頭寄り）スクロールをスムーズに上書きする。
 */
export function AnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;

    // ブラウザの初期スクロール完了後に中央へ上書き
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
