"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {useCompositionSession} from "./CompositionContext";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {readerSheets,columnCount,continuationHash} from "@/lib/reader-pagination";
import {layoutSettled} from "@/lib/layout-settling";
import type { TOCEntry } from "@/lib/toc";


export function MagazineReader({ children, toc, initialMode = "magazine" }: { children: ReactNode; toc: TOCEntry[]; initialMode?: "magazine" | "flow" }) {
  const compositionContext=useCompositionSession();
  const compositionSession=compositionContext?.session,planPreview=compositionContext?.planPreview;
  const editingPage=compositionSession?.pageId;
  const preview=compositionSession?.preview;
  const [perView,setPerView]=useState(2);
  const perViewRef=useRef(2);
  const group=(index:number)=>Math.floor(Math.max(0,index)/perViewRef.current);
  const ja = useLocale() === "ja";
  const root = useRef<HTMLDivElement>(null);
  const [spread, setSpread] = useState(0);
  const [total, setTotal] = useState(0);
  const [navigation, setNavigation] = useState(0);
  const [mode, setMode] = useState<"spread" | "flow">("flow");
  const [pagination, setPagination] = useState(0);
  const [layoutEpoch,setLayoutEpoch]=useState(0);
  const [measuring,setMeasuring]=useState(false);
  const pendingPart=useRef(0);
  const pendingAnchor=useRef<string|null>(null);
  const counts=useRef(new Map<HTMLElement,number>());

  const [wide, setWide] = useState(false);
  const [ready, setReady] = useState(false);
  const preference = useRef<"auto" | "flow">(initialMode === "flow" ? "flow" : "auto");
  const targetId = useRef<string | null>(null);
  const alignSpread = useRef(false);
  const spreadRef = useRef(0);
  const pages = useCallback(() => Array.from(root.current?.querySelectorAll<HTMLElement>("[data-magazine-page]") ?? []),[]);
  const sheets=useCallback(()=>readerSheets(pages(),p=>counts.current.get(p)??1),[pages]);

  useLayoutEffect(() => {
    const book = root.current;
    if (!book) return;
    const sheets = Array.from(book.querySelectorAll<HTMLElement>("[data-magazine-page]"));
    // The complete server-rendered article remains the only source of body content.
    setTotal(sheets.length);
    const fitScreen = () => {
      const fits = !book.querySelector('[data-reader-fallback]') && window.innerWidth >= 768;
      perViewRef.current=window.innerWidth>=1200?2:1;setPerView(perViewRef.current);
      setWide(fits);

      setMode(fits && preference.current === "auto" ? "spread" : "flow");
    };
    const resize = () => {
      const visible = book.dataset.readerMode === "flow" ? sheets.findIndex(page => page.getBoundingClientRect().bottom > 80) : -1;
      const active=readerSheets(sheets,p=>counts.current.get(p)??1)[spreadRef.current*perViewRef.current];
      const index = visible >= 0 ? visible : active?sheets.indexOf(active.source):0;
      pendingPart.current=active?.part??0;
      pendingAnchor.current=sheets[index]?.id??null;
      counts.current.clear();
      sheets.forEach(p=>{p.removeAttribute("data-continuation");p.style.removeProperty("grid-column");p.style.removeProperty("--column-offset");});
      setLayoutEpoch(v=>v+1);
      targetId.current = sheets[index]?.id ?? null;
      fitScreen();
      setSpread(group(index));
    };
    const resolveHash = () => {
      let id = "";
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { /* invalid fragment: start at the beginning */ }
      const match=id.match(/^(.*)--continuation-(\d+)$/);
      const target = id ? document.getElementById(match?.[1]??id) : sheets[0];
      const page = target?.closest<HTMLElement>("[data-magazine-page]") ?? target?.querySelector<HTMLElement>("[data-magazine-page]");
      if (page) {
        pendingPart.current=match?Number(match[2])-1:0;
        pendingAnchor.current=target?.id??page.id;
        const index = readerSheets(sheets,p=>counts.current.get(p)??1).findIndex(s=>s.source===page);
        const c=page.querySelector<HTMLElement>('.magazine-page-content');
        let part=match?Number(match[2])-1:0;
        if(!match&&target&&target!==page&&page.hasAttribute('data-continuation')&&c){
          const hidden=page.hidden;page.hidden=false;
          part=Math.max(0,Math.floor((target.getBoundingClientRect().left-c.getBoundingClientRect().left)/(parseFloat(page.style.getPropertyValue('--column-width'))+parseFloat(page.style.getPropertyValue('--column-gap')))));
          page.hidden=hidden;
        }
        setSpread(group(index+part));
        targetId.current = target?.matches("[data-magazine-spread]") ? page.id : (match?.[1]??id) || null;
      } else if (target && id) {
        preference.current = "flow";
        setMode("flow");
        targetId.current = id;
      } else { setSpread(0); targetId.current = null; }
      setNavigation(value => value + 1);
    };
    const onAnchor = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let target: HTMLElement | null = null;
      try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      history.pushState({ ...history.state }, "", url.hash);
      resolveHash();
      root.current?.querySelector<HTMLDetailsElement>("details")?.removeAttribute("open");
    };
    const find = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        preference.current = "flow";
        setMode("flow");
      }
    };
    alignSpread.current = true;
    fitScreen(); resolveHash(); setReady(true);
    window.addEventListener("resize", resize);
    window.addEventListener("popstate", resolveHash);
    window.addEventListener("hashchange", resolveHash);
    document.addEventListener("click", onAnchor);
    document.addEventListener("keydown", find);
    return () => {
      sheets.forEach(page => { page.hidden = false; page.inert = false; });
      window.removeEventListener("resize", resize);
      window.removeEventListener("popstate", resolveHash);
      window.removeEventListener("hashchange", resolveHash);
      document.removeEventListener("click", onAnchor);
      document.removeEventListener("keydown", find);
    };
  }, [planPreview,children,pages]);

  useLayoutEffect(()=>{
    if(mode==='flow'||editingPage){
      counts.current.clear();pages().forEach(p=>{p.removeAttribute('data-continuation');p.style.gridColumn='';});
      // DOM pagination is being removed before paint; synchronize the pager with it.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotal(pages().length);setPagination(v=>v+1);setMeasuring(false);
    }
  },[mode,editingPage,pages]);

  useLayoutEffect(() => {
    if (!ready||measuring) return;
    spreadRef.current = spread;
    const physical=sheets();
    const selected=physical.slice(spread*perView,spread*perView+perView);
    pages().forEach((page) => {
      const index=physical.findIndex(p=>p.source===page);
      const shown=selected.filter(s=>s.source===page);
      const content = page.querySelector<HTMLElement>(".magazine-page-content");
      if (content) content.removeAttribute("tabindex");
      const inactive = editingPage ? page.dataset.magazinePage !== editingPage : mode === "spread" && !shown.length;
      page.hidden = inactive;
      page.inert = inactive;
      page.dataset.pageNumber = String(index + 1+(shown[0]?.part??0)).padStart(2, "0");
      page.style.gridColumn=shown.length===2?"span 2":"";
      if(!inactive&&page.hasAttribute("data-continuation"))page.scrollLeft=0;
      page.style.setProperty("--column-offset",String(shown[0]?.part??0));
    });
    if (targetId.current) {
      const target = document.getElementById(targetId.current);
      if (target) {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
        if (mode === "flow") target.scrollIntoView({ block: "start", behavior: "instant" });
        else if (target.closest("[data-magazine-page]")) {
          if(!target.closest("[data-continuation]"))target.scrollIntoView({block:"nearest",behavior:"instant"});
          alignSpread.current = true;
        }
      }
      targetId.current = null;
    }
  }, [spread, mode, navigation, ready, editingPage,perView,pagination,measuring,pages,sheets]);

  useEffect(() => {
    if (mode !== "spread" || !alignSpread.current) return;
    // Next's route-level fragment scrolling runs after the page's layout effects.
    // Align the finished spread after it, retaining the header and the controls.
    const frame = requestAnimationFrame(() => {
      document.querySelector(".magazine-header")?.scrollIntoView({ block: "start", behavior: "instant" });
      alignSpread.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [spread, mode, navigation, ready]);

  useLayoutEffect(()=>{
    if(!ready||mode!=='spread'||editingPage)return;
    const sources=pages(),book=root.current?.querySelector<HTMLElement>('.reader-book');
    if(!book)return;
    const active=sheets()[spreadRef.current*perViewRef.current];
    const anchor=pendingAnchor.current??targetId.current??active?.source.id;
    const part=pendingPart.current||active?.part||0;
    const width=perViewRef.current===1?Math.min(book.clientWidth,680):book.clientWidth/perViewRef.current;
    const saved=sources.map(p=>({p,style:p.getAttribute('style'),hidden:p.hidden}));
    // Hide the measuring sheets before paint while their real layout is evaluated.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeasuring(true);
    sources.forEach(p=>{
      p.hidden=false;p.inert=true;p.removeAttribute('data-continuation');
      p.style.cssText+=`;position:absolute;visibility:hidden;left:-100000px;width:${width}px;grid-column:auto;--column-offset:0`;
    });
    counts.current.clear();
    let cancelled=false,frame=0;
    const restore=()=>saved.forEach(({p,style,hidden})=>{
      const columnWidth=p.style.getPropertyValue('--column-width'),gap=p.style.getPropertyValue('--column-gap');
      if(style===null)p.removeAttribute('style');else p.setAttribute('style',style);
      p.style.setProperty('--column-width',columnWidth);p.style.setProperty('--column-gap',gap);p.hidden=hidden;
    });
    const measure=()=>{
      for(const page of sources){
        const content=page.querySelector<HTMLElement>('.magazine-page-content');if(!content)continue;
        if(content.scrollHeight>content.clientHeight+2||content.scrollWidth>content.clientWidth+2){
          const pad=56;
          page.style.setProperty('--column-width',`${page.clientWidth-pad}px`);page.style.setProperty('--column-gap',`${pad}px`);page.setAttribute('data-continuation','');
        }
      }
      // React's image frames also observe their width; give those updates one frame.
      frame=requestAnimationFrame(()=>{
        if(cancelled)return;
        for(const page of sources){
          const content=page.querySelector<HTMLElement>('.magazine-page-content');if(!content||!page.hasAttribute('data-continuation'))continue;
          const count=columnCount(content.scrollWidth,parseFloat(page.style.getPropertyValue('--column-width')),parseFloat(page.style.getPropertyValue('--column-gap')));
          page.dataset.continuationCount=String(count);counts.current.set(page,count);
        }
        const physical=sheets();
        const target=anchor?document.getElementById(anchor):null;
        const source=target?.closest<HTMLElement>('[data-magazine-page]')??active?.source;
        let targetPart=part;
        if(source?.hasAttribute('data-continuation')&&target&&target!==source){
          const c=source.querySelector<HTMLElement>('.magazine-page-content')!;
          targetPart=Math.max(0,Math.floor((target.getBoundingClientRect().left-c.getBoundingClientRect().left)/(parseFloat(source.style.getPropertyValue('--column-width'))+parseFloat(source.style.getPropertyValue('--column-gap')))));
        }
        const index=physical.findIndex(s=>s.source===source&&s.part===Math.min(targetPart,(counts.current.get(source!)??1)-1));
        restore();setTotal(physical.length);setSpread(group(Math.max(0,index)));setPagination(v=>v+1);setMeasuring(false);pendingPart.current=0;pendingAnchor.current=null;
      });
    };
    // Width observers update photo heights, then text exclusion updates wrapping.
    // Measuring on the first frame can mistake that intermediate layout for
    // overflow and permanently replace the authored page with continuation columns.
    const settled = layoutSettled();
    const settle = () => {
      if (cancelled) return;
      const signature = sources.map(page => Array.from(page.querySelectorAll<HTMLElement>(
        '.magazine-page-content,.composition-float,.composition-text-group,.text-block-content'
      )).map(el => {
        const r = el.getBoundingClientRect();
        return [r.x,r.y,r.width,r.height,el.scrollWidth,el.scrollHeight].join(',');
      }).join(';')).join('|');
      if (settled(signature)) measure();
      else frame = requestAnimationFrame(settle);
    };
    Promise.resolve(document.fonts?.ready).then(()=>{if(!cancelled)frame=requestAnimationFrame(settle);});
    return()=>{cancelled=true;cancelAnimationFrame(frame);restore();};
  },[ready,mode,editingPage,layoutEpoch,perView,planPreview,children,pages,sheets]);

  const go = (next: number) => {
    const physical = sheets();
    const index = Math.max(0, Math.min(Math.ceil(physical.length / perView) - 1, next));
    const sheet = physical[index * perView];
    const page=sheet?.source;
    if (!page) return;
    history.pushState({ ...history.state }, "", `#${continuationHash(page.id,sheet.part)}`);
    setSpread(index);
    alignSpread.current = true;
    setNavigation(value => value + 1);
  };
  const toggle = () => {
    const next = mode === "spread" ? "flow" : "spread";
    const sheets = pages();
    let pageIndex = sheets.indexOf(readerSheets(sheets,p=>counts.current.get(p)??1)[spread*perView]?.source);
    if (next === "spread") {
      const index = sheets.findIndex(page => page.getBoundingClientRect().bottom > 80);
      if (index >= 0) { pageIndex = index; setSpread(group(index)); }
    }
    preference.current = next === "flow" ? "flow" : "auto";
    targetId.current = sheets[pageIndex]?.id ?? null;
    setMode(next);
  };
  return <div ref={root} onFocusCapture={event=>{
    if(mode!=='spread'||measuring||editingPage)return;
    const target=event.target as HTMLElement,page=target.closest<HTMLElement>('[data-continuation]');
    if(!page||target===page)return;
    const content=page.querySelector<HTMLElement>('.magazine-page-content')!;
    const part=Math.max(0,Math.floor((target.getBoundingClientRect().left-content.getBoundingClientRect().left)/(parseFloat(page.style.getPropertyValue('--column-width'))+parseFloat(page.style.getPropertyValue('--column-gap')))));
    const index=sheets().findIndex(s=>s.source===page&&s.part===part);
    page.scrollLeft=0;
    if(index>=0&&group(index)!==spread){setSpread(group(index));alignSpread.current=true;}
  }} className="magazine-reader" data-reader-mode={editingPage?(preview==='mobile'?"flow":"spread"):mode} data-single={!editingPage&&(perView===1||total-spread*perView===1)||undefined} data-editor-preview={editingPage?preview:undefined} data-composition-editing={editingPage?true:undefined}>
    <div className="reader-book">{planPreview??children}</div>
    <nav className="reader-controls" aria-label={ja ? "記事のページ送り" : "Article pages"} onKeyDown={e => {
      if (mode !== "spread" || (e.target as HTMLElement).tagName !== "BUTTON") return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(spread + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(spread - 1); }
    }}>
      <Link href="/">← {ja ? "記事一覧へ" : "Journal"}</Link>
      {mode === "spread" && <div className="reader-pager">
        <button onClick={() => go(spread - 1)} disabled={measuring||spread === 0}>{ja ? "前のページ" : "Previous"}</button>
        <span role="status" aria-live="polite">{String(spread * perView + 1).padStart(2, "0")} — {String(Math.min(total, spread * perView + perView)).padStart(2, "0")} / {total}</span>
        <button onClick={() => go(spread + 1)} disabled={measuring||spread >= Math.ceil(total / perView) - 1}>{ja ? "次のページ" : "Next"} →</button>
      </div>}
      <div className="reader-options">
        <details><summary>{ja ? "目次" : "Contents"}</summary><nav aria-label={ja ? "記事の目次" : "Table of contents"}>{toc.map(item => <a key={item.id} href={`#${item.id}`}>{item.text}</a>)}<a href="#article-end">{ja ? "いいね・コメント" : "Likes & comments"}</a></nav></details>
        {wide && <button onClick={toggle}>{mode === "spread" ? (ja ? "全文表示" : "Read in one page") : (ja ? "見開き表示" : "Read spreads")}</button>}
      </div>
    </nav>
    {mode === "spread" && spread >= Math.ceil(total / perView) - 1 && <a className="reader-end-link" href="#article-end">{ja ? "読み終えて — いいね・コメントへ" : "Continue to likes & comments"}</a>}
  </div>;
}
