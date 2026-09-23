"use client";

import { useState } from "react";
import { backgrounds, placements, type Background, type CoverSettings } from "@/lib/magazine";
import type { PostData } from "@/lib/mdx";
import { ArticleCoverCard } from "./ArticleCoverCard";

const positionNames = {"top-left":"左上", "top-right":"右上", center:"中央", "bottom-left":"左下", "bottom-right":"右下"};
const groups: {name:string; variants:{id:string;name:string;cover:CoverSettings}[]}[] = [
  {name:"写真＋横書き / overlay",variants:placements.map((placement,i)=>({id:`O${i+1}`,name:positionNames[placement],cover:{template:"overlay",placement}}))},
  {name:"写真＋縦書き / vertical",variants:placements.map((placement,i)=>({id:`V${i+1}`,name:positionNames[placement],cover:{template:"vertical",placement}}))},
  {name:"写真と文字を分割 / split",variants:(["bottom","top"] as const).map((textSide,i)=>({id:`S${i+1}`,name:textSide==="bottom"?"写真が上・文字が下":"文字が上・写真が下",cover:{template:"split",textSide}}))},
  {name:"文字主体 / typographic",variants:placements.map((placement,i)=>({id:`T${i+1}`,name:positionNames[placement],cover:{template:"typographic",placement}}))},
  {name:"画像のみ / image",variants:[{id:"I1",name:"HTMLの題字を重ねない",cover:{mode:"image"}}]},
];

/** Local home review: uses the actual card component, without changing article metadata. */
export function CoverReview({posts}: {posts:PostData[]}) {
  const [normal,setNormal] = useState(false);
  const [slug,setSlug] = useState(posts[0]?.slug ?? "");
  const [background,setBackground] = useState<Background>("paper");
  const [titleSize,setTitleSize] = useState<NonNullable<CoverSettings["titleSize"]>>("medium");
  const [tone,setTone] = useState<"auto"|"light"|"dark">("auto");
  const [overlay,setOverlay] = useState<"none"|"local">("local");
  const [focal,setFocal] = useState("50% 50%");
  const [subtitle,setSubtitle] = useState(true);
  const [label,setLabel] = useState(true);
  const post = posts.find(p=>p.slug===slug) ?? posts[0];
  if (!post) return null;
  if (normal) return <><button className="cover-review-return" onClick={()=>setNormal(false)}>表紙レビューに戻る</button><div className="journal-grid">{posts.map((p,i)=><ArticleCoverCard key={p.slug} post={p} priority={i===0}/>)}</div></>;
  return <div className="cover-review">
    <header className="cover-review-intro">
      <h1>表紙レイアウトのレビュー</h1>
      <p>配置17種類＋画像のみ1種類を、現在の実装のまま並べています。「O2の題名を小さく」など、番号で指示できます。</p>
      <button onClick={()=>setNormal(true)}>通常の記事一覧を見る</button>
    </header>
    <form className="cover-review-settings" onSubmit={event=>event.preventDefault()}>
      <label>共通の記事・写真<select value={slug} onChange={e=>setSlug(e.target.value)}>{posts.map(p=><option key={p.slug} value={p.slug}>{p.frontmatter.displayTitle??p.frontmatter.title}</option>)}</select></label>
      <label>背景色<select value={background} onChange={e=>setBackground(e.target.value as Background)}>{backgrounds.map(v=><option key={v}>{v}</option>)}</select></label>
      <label>題名サイズ<select value={titleSize} onChange={e=>setTitleSize(e.target.value as typeof titleSize)}>{["small","medium","large"].map(v=><option key={v}>{v}</option>)}</select></label>
      <label>文字色<select value={tone} onChange={e=>setTone(e.target.value as typeof tone)}><option value="auto">初期値</option><option value="light">白系</option><option value="dark">濃色</option></select></label>
      <label>局所グラデーション<select value={overlay} onChange={e=>setOverlay(e.target.value as typeof overlay)}><option value="local">あり</option><option value="none">なし</option></select></label>
      <label>写真の位置<select value={focal} onChange={e=>setFocal(e.target.value)}>{["50% 50%","0% 50%","100% 50%","50% 0%","50% 100%"].map(v=><option key={v}>{v}</option>)}</select></label>
      <label className="cover-review-check"><input type="checkbox" checked={subtitle} onChange={e=>setSubtitle(e.target.checked)}/>副題あり</label>
      <label className="cover-review-check"><input type="checkbox" checked={label} onChange={e=>setLabel(e.target.checked)}/>小さなカテゴリーあり</label>
    </form>
    <p className="cover-review-note">設定は下の全表紙に反映します。色・サイズの全組み合わせはこの切替で確認できます。写真なしの記事では写真系の見本も写真なしになります。画像のみの見本は既存の代表画像を使用しており、完成済みの表紙画像ではありません。</p>
    <nav className="cover-review-index" aria-label="表紙の種類">{groups.map((g,i)=><a key={g.name} href={`#cover-group-${i}`}>{g.name.split(" / ")[0]}</a>)}</nav>
    {groups.map((group,index)=><section className="cover-review-group" id={`cover-group-${index}`} key={group.name}>
      <h2>{group.name}</h2>
      <div className="journal-grid">{group.variants.map(variant=>{
        const photo = ["overlay","vertical"].includes(variant.cover.template ?? "");
        const cover:CoverSettings = {
          mode:"composed",title:post.frontmatter.cover?.title??post.frontmatter.displayTitle??post.frontmatter.title,
          subtitle:subtitle ? post.frontmatter.cover?.subtitle??post.frontmatter.cardSummary : undefined,
          label:label ? post.frontmatter.category : undefined,
          image:post.frontmatter.cover?.image??post.frontmatter.image,
          imageFit:variant.cover.template === "split" ? post.frontmatter.cover?.imageFit : undefined,
          background,titleSize,tone:tone==="auto"?undefined:tone,overlay:photo?overlay:"none",focal,...variant.cover,
        };
        return <div key={variant.id} id={`cover-${variant.id}`} className="cover-review-item" data-cover-pattern={variant.id}>
          <h3><a href={`#cover-${variant.id}`}>{variant.id}</a> {variant.name}</h3>
          <p className="cover-review-config">{variant.cover.template??"image"} · {variant.cover.placement??variant.cover.textSide??"画像のみ"}</p>
          <ArticleCoverCard post={{...post,frontmatter:{...post.frontmatter,cover}}} priority={variant.id==="O1"}/>
        </div>;
      })}</div>
    </section>)}
  </div>;
}
