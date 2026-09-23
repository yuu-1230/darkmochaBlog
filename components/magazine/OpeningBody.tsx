'use client';
import {useEffect,useRef,type ReactNode,type ComponentProps} from 'react';
import {useCompositionSession} from './CompositionContext';
import {EditorialImage} from './EditorialImage';
import type {PageSettings} from '@/lib/magazine';
import {AUTHOR_NAME} from '@/lib/constants';

export function MagazinePageShell({pageId,className,...props}:ComponentProps<'section'>&{pageId:string}){
  const session=useCompositionSession()?.session;
  const draft=session?.pageId===pageId&&session.preview!=='before'?session.opening:undefined;
  let classes=className??'';
  if(draft)for(const [key,value] of Object.entries({placement:draft.placement??'top-left',tone:draft.tone??'light',background:draft.background??'paper'})){
    const prefix=key==='background'?'surface':`page-${key}`;
    classes=classes.replace(new RegExp(`${prefix}-[a-z-]+`),`${prefix}-${value}`);
  }
  if(session?.pageId===pageId&&session.preview!=='before'&&session.composition.background)classes=classes.replace(/surface-[a-z-]+/,`surface-${session.composition.background}`);
  return <section {...props} className={classes}/>;
}
export function OpeningBody({id,settings,formalTitle,category,date,children}:{id:string;settings:PageSettings;formalTitle:string;category?:string;date:string;children:ReactNode}){
  const context=useCompositionSession(),session=context?.session;
  const editing=session?.pageId===id&&session.preview!=='before';
  const p=editing?session.opening??settings:settings;
  const marker=useRef<HTMLSpanElement>(null);
  useEffect(()=>{
    if(!editing||!context)return;
    const content=marker.current?.closest<HTMLElement>('.magazine-page-content');if(!content)return;
    const measure=()=>{const overflow=content.scrollHeight>content.clientHeight+2||content.scrollWidth>content.clientWidth+2;context.setSession(s=>s?.pageId===id&&s.overflow!==overflow?{...s,overflow}:s);};
    const observer=new ResizeObserver(measure);observer.observe(content);content.querySelectorAll('.opening-copy,.opening-lead').forEach(el=>observer.observe(el));document.fonts.ready.then(measure);measure();
    return()=>observer.disconnect();
  },[editing,context,id]);
  return <><span hidden ref={marker}/><div className="opening-visual">
    {p.image&&<EditorialImage src={p.image} alt="" className="opening-photograph" focal={p.focal} priority/>}
    {p.overlay==='local'&&<div className="opening-shade" aria-hidden="true"/>}
    <div className="opening-copy">{category&&<span className="opening-category">{category}</span>}
      <h1 className="opening-title"><span className="sr-only">{formalTitle}</span><span aria-hidden="true">{p.title}</span></h1>
      {p.subtitle&&<p className="opening-subtitle">{p.subtitle}</p>}
    </div><div className="opening-credit">{AUTHOR_NAME}<br/><time dateTime={date}>{date.replaceAll('-','.')}</time></div>
  </div><div className="opening-lead">{children}</div></>;
}
