import {OpeningBody,MagazinePageShell} from "./OpeningBody";
import {PageComposer} from "./PageComposer";
import { Children, isValidElement, type ReactNode } from "react";
import type { Frontmatter } from "@/lib/mdx";
import type { PageSettings, PhotoSettings } from "@/lib/magazine";
import { EditorialImage } from "./EditorialImage";
import manifest from "@/content/image-manifest.json";

export function Spread({ id, children }: { id: string; children: ReactNode }) {
  return <div id={id} className="magazine-spread" data-magazine-spread={id}>{children}</div>;
}
export function Photo({src,alt,caption,credit,shape="rect",size="medium",fit="contain",ratio="original",focal,placement="inline",wrap="none"}: PhotoSettings) {
  return <figure className={`magazine-photo photo-${shape} photo-size-${size} photo-ratio-${ratio} photo-place-${placement} photo-wrap-${wrap}`}>
    <EditorialImage src={src} alt={alt} focal={focal} fit={shape === "circle" ? "cover" : fit} />
    {(caption||credit) && <figcaption>{caption}{credit&&<span className="photo-credit">{credit}</span>}</figcaption>}
  </figure>;
}
const photoProps = (child: ReactNode): PhotoSettings | undefined => isValidElement<PhotoSettings>(child) && child.type === Photo ? child.props : undefined;

export function Page({frontmatter: f, id,template="text",background="paper",layout,composition,balance="photo",columns=1,image,title,subtitle,focal,placement="top-left",tone="light",overlay="none",children}: PageSettings & {frontmatter: Frontmatter; children?: ReactNode}) {
  const nodes = Children.toArray(children);
  const opening = template === "opening";
  let body: ReactNode = children;
  if (template === "editorial") {
    const lead = nodes.find(n => photoProps(n)?.placement === "lead");
    const support = nodes.find(n => photoProps(n)?.placement === "support");
    const leadIndex = lead ? nodes.indexOf(lead) : -1;
    const intro = leadIndex >= 0 ? nodes.slice(0,leadIndex) : [];
    const rest = nodes.slice(leadIndex + 1).filter(n => n !== support);
    body = <>{intro}<div className={`page-lead layout-${layout ?? "photo-left"}`}>{lead}</div><div className="page-editorial-body">{rest}{support}</div></>;
  }
  if (template === "feature") {
    const photos = nodes.filter(n=>photoProps(n));
    const allPortrait = photos.every(n=>{const size=(manifest as Record<string,{width:number;height:number}>)[photoProps(n)!.src];return size&&size.height>size.width;});
    const text = nodes.filter(n=>!photoProps(n));
    const boundary = ["portrait","data"].includes(layout ?? "") ? text.findIndex(n=>isValidElement<{id?:string}>(n) && n.type === "span" && n.props.id?.startsWith("page-")) : -1;
    const main = boundary < 0 ? text : text.slice(0,boundary);
    const continuation = boundary < 0 ? [] : text.slice(boundary);
    body = <><div className="feature-copy">{main}</div>{layout === "data" && continuation.length>0 && <div className="feature-followup">{continuation}</div>}<div className={`feature-photos ${allPortrait ? "photos-portrait" : ""}`}>{photos}</div>{layout !== "data" && continuation.length>0 && <div className="feature-followup">{continuation}</div>}</>;
  }
  if (["feature","editorial","text"].includes(template)) body = <PageComposer id={id!} initial={composition} text={nodes.filter(n=>!photoProps(n)&&!(typeof n==="string"&&!n.trim()))} photos={nodes.filter(n=>photoProps(n))}>{body}</PageComposer>;
  if (opening) body = <OpeningBody id={id!} settings={{image,title,subtitle,focal,placement,tone,overlay}} formalTitle={f.title} category={f.category} date={f.date}>{children}</OpeningBody>;
  return <MagazinePageShell pageId={id!} id={`page-${id}`} data-magazine-page={id} className={`magazine-page authored-page page-${template} ${opening ? "page-cover" : ""} surface-${composition?JSON.parse(composition).background??background:background} page-layout-${layout ?? (template === "gallery" ? "pair" : "inset")} page-columns-${columns} page-balance-${balance} page-placement-${placement} page-tone-${tone}`}>
    <div className="magazine-page-content">{body}</div>
  </MagazinePageShell>;
}
