"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const theme = resolvedTheme === "dark" ? "noborder_dark" : "noborder_light";

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span className="text-primary/60">{"//"}</span>
          discussion
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="rounded-xl border border-border bg-card/50 px-4 py-6 md:px-8">
        <Giscus
          repo={process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`}
          repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID!}
          category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY!}
          categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!}
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme}
          lang="ja"
          loading="lazy"
        />
      </div>
    </section>
  );
}
