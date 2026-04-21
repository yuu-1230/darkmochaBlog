"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";

export const TocPortal = ({ toc }: { toc: TocItem[] }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされた後、要素を探す
    const target = document.getElementById("sidebar-toc-container");
    if (target) {
      setContainer(target);
    }
  }, []);

  // コンテナが見つからない場合は何も表示しない
  if (!container || toc.length === 0) return null;

  return createPortal(
    <TableOfContents toc={toc} isSidebar={true} />,
    container
  );
};