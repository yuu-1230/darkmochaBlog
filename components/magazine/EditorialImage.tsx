"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { resolveImageUrl } from "@/lib/image-url";
import manifest from "@/content/image-manifest.json";

import type { CSSProperties } from "react";

type Props = { src: string; alt: string; focal?: string; fit?: "cover" | "contain"; priority?: boolean; className?: string };

/** Keep inactive spreads out of the image request queue, while retaining their text in SSR. */
export function EditorialImage({ src, alt, focal = "50% 50%", fit = "cover", priority = false, className = "" }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(priority);
  const dimensions = (manifest as Record<string, { width: number; height: number }>)[src];
  useEffect(() => {
    if (visible || !host.current) return;
    if (!window.IntersectionObserver) {
      // Older clients can still opt into the regular, complete article.
      const el = host.current;
      const reveal = () => { if (el.getBoundingClientRect().height > 0) setVisible(true); };
      reveal();
      window.addEventListener("scroll", reveal, { passive: true });
      return () => window.removeEventListener("scroll", reveal);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: "120px" });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [visible]);
  return <div ref={host} className={`editorial-image ${className}`} style={{ aspectRatio: dimensions ? `${dimensions.width}/${dimensions.height}` : "4/3", "--image-ratio": dimensions ? dimensions.width / dimensions.height : 4/3 } as CSSProperties}>
    {visible && <Image src={resolveImageUrl(src)} alt={alt} fill sizes="(min-width: 1280px) 46vw, (min-width: 768px) 80vw, 100vw" style={{ objectFit: fit, objectPosition: focal }} preload={priority} />}
    <noscript>
      {/* Raw img is the no-JavaScript fallback for the deferred component. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolveImageUrl(src)} alt={alt} loading="lazy" width={dimensions?.width ?? 1200} height={dimensions?.height ?? 900} /></noscript>
  </div>;
}
