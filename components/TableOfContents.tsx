"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocItem = {
  level: number;
  text: string;
  id: string;
  numberLabel: string;
};

type TableOfContentsProps = {
  toc: TocItem[];
  className?: string;
};

export const TableOfContents = ({ toc, className }: TableOfContentsProps) => {
  const t = useTranslations("toc");
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -60% 0px" },
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-foreground font-semibold mb-4 pb-3" style={{ borderBottom: "1px solid var(--toc-line)" }}>
        <List className="w-4 h-4 text-primary" />
        {t("title")}
      </div>

      <div className="flex gap-3">
        {/* 縦ライン */}
        <div className="w-px shrink-0 rounded-full" style={{ background: "var(--toc-line)" }} />

        <ul className="space-y-2 flex-1">
          {toc.map((heading, index) => {
            const isActive = activeId === heading.id;

            return (
              <li
                key={index}
                className={cn("flex items-start gap-2.5 transition-all", heading.level === 3 && "ml-3")}
              >
                {/* ドット */}
                <span
                  className="shrink-0 rounded-full mt-1.5 transition-all duration-200"
                  style={{
                    width:  isActive ? "9px" : "7px",
                    height: isActive ? "9px" : "7px",
                    background: isActive ? "var(--primary)" : "var(--toc-line)",
                    marginLeft: isActive ? "-1px" : "0",
                  }}
                />
                <a
                  href={`#${heading.id}`}
                  className="text-sm leading-snug line-clamp-2 transition-colors duration-200 py-0.5"
                  style={{
                    color:      isActive ? "var(--foreground)" : "var(--muted-foreground)",
                    fontWeight: isActive ? "700" : "400",
                  }}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};