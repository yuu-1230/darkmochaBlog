"use client";

import React, { useEffect, useState } from "react";
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
      <div className="flex items-center gap-2 text-foreground font-semibold mb-4 border-b pb-3">
        <List className="w-4 h-4 text-primary" />
        目次
      </div>

      <ul className="space-y-2">
        {toc.map((heading, index) => {
          const isActive = activeId === heading.id;

          return (
            <li
              key={index}
              className={cn(
                "transition-all",
                heading.level === 3 ? "ml-4" : "font-medium",
              )}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  "flex items-start gap-2 text-sm transition-colors duration-200 py-0.5",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono shrink-0 text-xs pt-0.5 text-muted-foreground">
                  {heading.numberLabel} |
                </span>
                <span className="line-clamp-2 leading-snug">
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};