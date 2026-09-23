import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { EditorialImage } from "./EditorialImage";
import type { Frontmatter } from "@/lib/mdx";
import { Spread, Page, Photo } from "./layout-parts";
import type { PageSettings } from "@/lib/magazine";
import { AUTHOR_NAME } from "@/lib/constants";

export function MagazinePage({ id, template = "text", children }: { id: string; template?: "cover" | "editorial" | "text" | "mixed" | "photo"; children: ReactNode }) {
  return <section id={`page-${id}`} data-magazine-page={id} className={`magazine-page page-${template}`}>
    <div className="magazine-page-content">{children}</div>
  </section>;
}

export function MagazineFigure({ src, alt, caption, focal, fit = "contain", small = false }: {
  src: string; alt: string; caption?: string; focal?: string; fit?: "cover" | "contain"; small?: boolean;
}) {
  return <figure className={`magazine-figure ${small ? "figure-small" : ""}`}>
    <EditorialImage src={src} alt={alt} focal={focal} fit={fit} />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>;
}

export function EditorialPhoto({ src, alt, focal, children }: { src: string; alt: string; focal?: string; children: ReactNode }) {
  return <figure className="editorial-photo-row"><EditorialImage src={src} alt={alt} focal={focal} /><figcaption>{children}</figcaption></figure>;
}
export function EditorialColumns({ children }: { children: ReactNode }) { return <div className="editorial-columns">{children}</div>; }
export function EditorialColumn({ children }: { children: ReactNode }) { return <div className="editorial-column">{children}</div>; }
export function EditorialHeading({ children }: { children: ReactNode }) { return <p className="editorial-heading">{children}</p>; }

/** A compact opening for essays, learning notes and game development articles. */
export function ArticleTitle({frontmatter:f}:{frontmatter:Frontmatter}) {
  return <header className="edition-masthead">
    <p className="journal-meta">{f.category} / <time dateTime={f.date}>{f.date.replaceAll('-','.')}</time></p>
    <h1>{f.displayTitle?<><span className="sr-only">{f.title}</span><span aria-hidden="true">{f.displayTitle}</span></>:f.title}</h1>
    <p className="edition-description">{f.description}</p>
  </header>;
}

export function CoverTitle({ frontmatter: f }: { frontmatter: Frontmatter }) {
  const r = f.reader;
  return <div className="opening-visual">
    {(r?.image ?? f.image) && <EditorialImage className="opening-photograph" src={(r?.image ?? f.image)!} alt="" focal={r?.focal} priority />}
    <div className="opening-shade" aria-hidden="true" />
    <span className="opening-category">{f.category} / {f.tags?.includes("Travel") ? "Travel" : "Journal"}</span>
    <h1 className="opening-title"><span className="sr-only">{f.title}</span><span aria-hidden="true">{r?.title ?? f.title}</span></h1>
    {r?.subtitle && <p className="opening-subtitle">{r.subtitle}</p>}
    <div className="opening-credit">{AUTHOR_NAME}<br /><time dateTime={f.date}>{f.date.replaceAll("-", ".")}</time></div>
  </div>;
}

export function magazineMdxComponents(frontmatter: Frontmatter, locale: string) {
  return {
    MagazinePage, MagazineFigure, EditorialPhoto, EditorialColumns, EditorialColumn, EditorialHeading,
    ArticleTitle: () => <ArticleTitle frontmatter={frontmatter}/>,
    Spread, Photo, Page: (props: PageSettings & {children?: ReactNode}) => <Page {...props} frontmatter={frontmatter} />,
    table: (props: ComponentPropsWithoutRef<"table">) => <table {...props} />,
    thead: (props: ComponentPropsWithoutRef<"thead">) => <thead {...props} />,
    th: (props: ComponentPropsWithoutRef<"th">) => <th {...props} />,
    td: (props: ComponentPropsWithoutRef<"td">) => <td {...props} />,
    Tip: ({ title, children }: { title?: string; children: ReactNode }) => <aside className="magazine-note"><p className="magazine-note-title">{title}</p>{children}</aside>,
    InstagramLink: ({href,title}:{href:string;title?:string}) => <a className="magazine-source-link" href={href} target="_blank" rel="noopener noreferrer">{title ?? "Instagram"} ↗</a>,
    CoverTitle: () => <CoverTitle frontmatter={frontmatter} />,
    p: (props: ComponentPropsWithoutRef<"div">) => <div className="magazine-paragraph" {...props} />,
    ImageSlider: ({ images, alt }: { images: string | string[]; alt?: string }) => {
      const list = Array.isArray(images) ? images : images.split(",").map(s => s.trim()).filter(Boolean);
      return <div className="magazine-gallery">{list.map((src,i) => <MagazineFigure key={src} src={src} alt={alt ?? `${frontmatter.title} — ${locale === "ja" ? "画像" : "Image"} ${i+1}`} />)}</div>;
    },
  };
}
