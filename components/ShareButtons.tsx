"use client";

import { useState } from "react";
import { SiX, SiBluesky } from "react-icons/si";
import { Check, Link as LinkIcon } from "lucide-react";

const buttonClass =
  "p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent hover:border-primary/40 transition-colors";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Xでシェア"
        className={buttonClass}
      >
        <SiX className="w-4 h-4" />
      </a>
      <a
        href={`https://bsky.app/intent/compose?text=${shareText}%20${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Blueskyでシェア"
        className={buttonClass}
      >
        <SiBluesky className="w-4 h-4" />
      </a>
      <button
        onClick={copyUrl}
        aria-label="リンクをコピー"
        className={`${buttonClass} cursor-pointer`}
      >
        {copied ? (
          <Check className="w-4 h-4 text-primary" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
