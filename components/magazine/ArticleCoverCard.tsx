import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl } from "@/lib/image-url";
import type { PostData } from "@/lib/mdx";

export function ArticleCoverCard({ post, priority = false }: { post: PostData; priority?: boolean }) {
  const { frontmatter: f, slug } = post;
  const cover = f.cover ?? {};
  const src = cover.image ?? f.image;
  const template = cover.template ?? (src ? "overlay" : "typographic");
  const tone = cover.tone ?? (["split", "typographic"].includes(template) ? "surface" : "light");
  const complete = cover.mode === "image";
  return (
    <article className="journal-card">
      <Link href={`/blog/${slug}`} className="journal-card-link" aria-label={f.title}>
        <div className={`journal-cover cover-${template} surface-${cover.background ?? "paper"} cover-${cover.placement ?? "top-left"} cover-tone-${tone} cover-size-${cover.titleSize ?? "medium"} cover-side-${cover.textSide ?? "bottom"} ${complete ? "cover-complete" : ""}`}>
          {src && (template !== "typographic" || complete) && (
            <div className="journal-cover-image">
              <Image src={resolveImageUrl(src)} alt="" fill
                sizes="(min-width: 1440px) 420px, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 90vw"
                style={{ objectFit: complete ? "contain" : template === "split" ? cover.imageFit ?? "cover" : "cover", objectPosition: cover.focal ?? "50% 50%", transform: `scale(${(cover.imageZoom ?? 100) / 100})`, transformOrigin: cover.focal ?? "50% 50%" }}
                preload={priority} />
            </div>
          )}
          {!complete && <>
            {cover.overlay === "local" && <div className="cover-local-shade" aria-hidden="true" />}
            <div className="journal-cover-copy" aria-hidden="true">
              {cover.label && <span className="cover-category" style={cover.labelFontSize ? {fontSize:`${cover.labelFontSize / 16}rem`} : undefined}>{cover.label}</span>}
              <p className="cover-title" style={cover.titleFontSize ? {fontSize:`${cover.titleFontSize / 16}rem`} : undefined}>{template === "split" ? (cover.title ?? f.displayTitle ?? f.title).replace(/\s*\n\s*/g, " ") : cover.title ?? f.displayTitle ?? f.title}</p>
              {cover.subtitle && <p className="cover-subtitle" style={cover.subtitleFontSize ? {fontSize:`${cover.subtitleFontSize / 16}rem`} : undefined}>{cover.subtitle}</p>}
            </div>
            <span className="cover-imprint" aria-hidden="true">Darkmocha<br /><span>Journal</span></span>
          </>}
        </div>
        <h2>{f.displayTitle ?? f.title}</h2>
      </Link>
      <p className="journal-summary">{f.cardSummary ?? f.description}</p>
      <div className="journal-meta"><time dateTime={f.date}>{f.date.replaceAll("-", ".")}</time><span>{f.category}</span></div>
    </article>
  );
}
