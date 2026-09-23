'use client';
import {Fragment,isValidElement,useEffect,useLayoutEffect,useRef,useState,type CSSProperties,type ReactNode,type PointerEvent} from 'react';
import {clamp,parseComposition,type TextFrame,type PhotoFrame} from '@/lib/page-composition';
import {textWrapShapes} from '@/lib/text-wrap';
import {EditorialImage} from './EditorialImage';
import {useCompositionSession} from './CompositionContext';

export function PageComposer({id,initial,text:sourceText,photos,children}:{id:string;initial?:string;text:ReactNode[];photos:ReactNode[];children:ReactNode}){
  const context=useCompositionSession();
  const session=context?.session;
  const active=session?.pageId===id;
  const editing=active&&session.preview!=='before'&&session.preview!=='mobile';
  const composition=active&&session.preview!=='before'&&(initial||session.baseComposition!==JSON.stringify(session.composition))?session.composition:parseComposition(initial);
  const sections:{id:string;nodes:ReactNode[]}[]=[];
  const units:{id:string;kind:string;section:string;nodes:ReactNode[]}[]=[];
  let section:typeof sections[number]|undefined,unit:typeof units[number]|undefined;
  for(const node of sourceText){
    const props=isValidElement<{"data-text-section"?:string;"data-text-unit"?:string;"data-text-kind"?:string}>(node)?node.props:undefined;
    if(props?.['data-text-section']){section={id:props['data-text-section'],nodes:[]};sections.push(section);unit=undefined;continue;}
    if(props?.['data-text-unit']){unit={id:props['data-text-unit'],kind:props['data-text-kind']??'other',section:section?.id??id,nodes:[]};units.push(unit);continue;}
    if(!section){section={id,nodes:[]};sections.push(section);}
    section.nodes.push(node);unit?.nodes.push(node);
  }
  const text=sections.flatMap(g=>g.nodes);
  const groups=composition?.textUnit==='paragraph'?units:sections;
  const labels=groups.map(g=>({id:g.id,label:nodeText(g.nodes).trim().slice(0,45)||g.id}));
  const paragraphLabels=units.map(g=>({id:g.id,section:g.section,label:`${g.kind==='paragraph'?'段落':g.kind==='heading'?'見出し':'要素'}: ${nodeText(g.nodes).trim().slice(0,45)||'本文アンカー'}`}));
  const hasComposition=!!composition;
  const area=useRef<HTMLDivElement>(null);
  const [width,setWidth]=useState(460);
  const [pageWidth,setPageWidth]=useState(460);
  useLayoutEffect(()=>{
    const el=area.current;if(!el)return;
    // Retain the last visible size while a spread is hidden. Fractional CSS pixels
    // matter here: rounding changes photo heights and text wrapping.
    const measure=()=>{const measured=el.getBoundingClientRect().width;if(measured>0){setWidth(measured);const page=el.closest('.magazine-page-content');if(page)setPageWidth(page.getBoundingClientRect().width);}};
    const observer=new ResizeObserver(measure);observer.observe(el);measure();
    return()=>observer.disconnect();
  },[hasComposition]);
  useEffect(()=>{
    if(!editing||!context)return;
    const el=area.current??document.getElementById(`page-${id}`)?.querySelector<HTMLElement>('.magazine-page-content');if(!el)return;const page=el.closest('.magazine-page-content') as HTMLElement;
    const measure=()=>{const advice:string[]=[];
      for(const frame of session.composition.frames){const asset=session.assets?.find(a=>a.src===(frame.replacement??frame.source));const px=el.getBoundingClientRect().width*frame.width/100;if(asset&&asset.width>0&&asset.width<px*2)advice.push('写真の解像度が表示サイズに対して不足する可能性があります。元画像を確認してください。');if(px<140)advice.push('写真が小さめです。役割と伝えたい内容を確認してください。');}
      if(el.scrollHeight<page.clientHeight*.35)advice.push('余白が大きめです。章扉として意図したものか、関連内容との統合が適切か確認してください。');
      const unique=[...new Set(advice)];
      const paper=page.getBoundingClientRect();
      const free=Array.from(el.querySelectorAll<HTMLElement>('[data-free-photo],[data-free-text]')).map(e=>e.getBoundingClientRect());
      const outside=free.some(r=>r.bottom>paper.bottom+2||r.right>paper.right+2||r.left<paper.left-2||r.top<paper.top-2);
      if(outside)unique.push('写真または文章枠が紙面の外に出ています。位置またはサイズを調整してください。');
      const overflow=outside||el.scrollHeight>page.clientHeight+2||el.scrollWidth>page.clientWidth+2;context.setSession(s=>s?.pageId===id&&(s.overflow!==overflow||s.textCount!==text.length||JSON.stringify(s.textLabels)!==JSON.stringify(labels)||JSON.stringify(s.paragraphLabels)!==JSON.stringify(paragraphLabels)||JSON.stringify(s.advice)!==JSON.stringify(unique))?{...s,overflow,textCount:text.length,textLabels:labels,paragraphLabels,advice:unique}:s);};
    const observer=new ResizeObserver(measure);observer.observe(el);observer.observe(page);el.querySelectorAll('.composition-text-group,.composition-float').forEach(node=>observer.observe(node));document.fonts?.ready.then(measure);measure();
    return()=>observer.disconnect();
  },[editing,id,context,text.length,labels,paragraphLabels,session?.assets,session?.composition.frames,session?.composition.allowOverlap,session?.composition.textGroups]);
  useEffect(()=>{
    if(!editing||hasComposition||!context)return;
    const page=document.getElementById(`page-${id}`);if(!page)return;
    const select=(event:MouseEvent)=>{
      const target=event.target as Element,photo=target.closest('.magazine-photo');
      if(photo){const index=Array.from(page.querySelectorAll('.magazine-photo')).indexOf(photo);context.setSession(s=>s?{...s,selected:index,selectedText:undefined}:s);return;}
      let node=target.closest('.magazine-paragraph,h2,h3,.magazine-note');
      while(node&&node!==page){let previous=node.previousElementSibling;while(previous&&!previous.hasAttribute('data-text-unit'))previous=previous.previousElementSibling;
        if(previous){const unit=previous.getAttribute('data-text-unit')!;context.setSession(s=>s?{...s,selected:-1,selectedText:unit}:s);return;}
        node=node.parentElement;
      }
    };
    page.addEventListener('click',select);return()=>page.removeEventListener('click',select);
  },[editing,hasComposition,context,id]);
  if(!composition)return <><span hidden data-composition-source data-text-count={text.length}/>{children}</>;
  const update=(index:number,frame:PhotoFrame)=>context?.setSession(s=>s?.pageId===id?{...s,composition:{...s.composition,frames:s.composition.frames.map((f,i)=>i===index?frame:f)}}:s);
  const unitOffsets=new Map<string,number>();let unitOffset=0;for(const u of units){unitOffsets.set(u.id,unitOffset);unitOffset+=u.nodes.length;}
  const frameSlot=(f:PhotoFrame)=>f.anchorId==='end'?text.length:f.anchorId?unitOffsets.get(f.anchorId)??text.length:Math.min(f.anchor??0,text.length);
  const renderSlot=(slot:number,node?:ReactNode,frameWidth=width)=><Fragment key={slot}>
    {composition.frames.map((frame,index)=>frameSlot(frame)===slot&&<Frame key={index} frame={frame} width={frame.position==='free'?pageWidth:frameWidth} index={index} editing={!!editing} selected={editing&&session.selected===index} tool={session?.photoTool??'move'} locked={session?.locked??true} select={()=>context?.setSession(s=>s?{...s,selected:index,selectedText:undefined}:s)} update={f=>update(index,f)}>{active&&session.preview!=='before'&&frame.replacement&&session.assets?.find(a=>a.src===frame.replacement)?(()=>{const a=session.assets!.find(a=>a.src===frame.replacement)!;return <figure className="magazine-photo"><EditorialImage src={a.src} alt={a.alt??''}/>{a.caption&&<figcaption>{a.caption}</figcaption>}{a.credit&&<figcaption>{a.credit}</figcaption>}</figure>;})():photos[index]}</Frame>)}
    {node&&composition.frames.filter(f=>frameSlot(f)===slot).length>1&&<div className="composition-photo-row-end" aria-hidden="true" style={{clear:'both'}}/>}
    {node}
  </Fragment>;
  let slot=0;
  return <div ref={area} className="composed-flow" data-free-photos={composition.frames.some(f=>f.position==='free')||undefined} data-composed-page={id} data-density={composition.density??'standard'} data-heading-size={composition.headingSize??'standard'} data-text-count={text.length} data-composing={editing||undefined} style={{width:`${composition.textWidth}%`}}>
    {composition.textGroups?groups.map(g=>composition.textGroups!.find(f=>f.id===g.id)??{id:g.id,width:100,inset:0,offset:0}).map(group=>{
      const nodes=groups.find(g=>g.id===group.id)?.nodes??[];
      const start=slot;slot+=nodes.length;
      return <Fragment key={group.id}>{nodes.map((_,i)=>renderSlot(start+i))}<TextGroup allowOverlap={!!composition.allowOverlap} layoutKey={JSON.stringify(composition)} frame={group} areaWidth={width} editing={!!editing} selected={editing&&session.selectedText===group.id} label={labels.find(l=>l.id===group.id)?.label??group.id}
        select={()=>context?.setSession(s=>s?{...s,selectedText:group.id,selected:-1}:s)}
        update={frame=>context?.setSession(s=>s?{...s,composition:{...s.composition,textGroups:s.composition.textGroups?.map(g=>g.id===frame.id?frame:g)}}:s)}
>
        {nodes}
      </TextGroup></Fragment>;
    }):text.map((node,i)=>renderSlot(i,node))}
    {renderSlot(text.length)}
  </div>;

}
function Frame({frame:f,width,index,editing,selected,locked,tool,select,update,children}:{frame:PhotoFrame;width:number;index:number;editing:boolean;selected:boolean;locked:boolean;tool:'move'|'crop';select:()=>void;update:(frame:PhotoFrame)=>void;children:ReactNode}){
  const host=useRef<HTMLDivElement>(null),[captionHeight,setCaptionHeight]=useState(0);
  useLayoutEffect(()=>{const el=host.current;if(!el)return;const measure=()=>{const h=Array.from(el.querySelectorAll('figcaption')).reduce((n,c)=>n+c.getBoundingClientRect().height+parseFloat(getComputedStyle(c).marginTop||'0'),0);setCaptionHeight(old=>old===h?old:h);};const observer=new ResizeObserver(measure);el.querySelectorAll('figcaption').forEach(c=>observer.observe(c));document.fonts?.ready.then(measure);measure();return()=>observer.disconnect();},[children,width]);
  const drag=useRef<{x:number;y:number;frame:PhotoFrame;resize?:boolean;moving?:boolean;pageHeight?:number}|null>(null);
  const begin=(e:PointerEvent<HTMLElement>)=>{if(!editing)return;e.preventDefault();e.stopPropagation();select();e.currentTarget.setPointerCapture(e.pointerId);const paper=host.current?.closest<HTMLElement>('.magazine-page-content'),r=paper?.getBoundingClientRect(),b=host.current?.getBoundingClientRect();
    const moving=tool==='move';const frame=moving&&r&&b?{...f,position:'free' as const,x:f.position==='free'?f.x:clamp((b.left-r.left)/r.width*100,0,100),y:f.position==='free'?f.y:clamp((b.top-r.top)/r.height*100,0,100),inset:0,offset:0}: {...f};
    drag.current={x:e.clientX,y:e.clientY,frame,moving,pageHeight:r?.height};};
  const move=(e:PointerEvent<HTMLElement>)=>{const d=drag.current;if(d?.moving){const h=d.pageHeight??1;update({...d.frame,x:clamp((d.frame.x??0)+(e.clientX-d.x)/width*100,0,Math.max(0,100-d.frame.width)),y:clamp((d.frame.y??0)+(e.clientY-d.y)/h*100,0,Math.max(0,100-(width*d.frame.width/100/(d.frame.shape==='circle'?1:d.frame.ratio)+captionHeight)/h*100))});return;}if(d?.resize){const w=clamp(d.frame.width+(e.clientX-d.x)/width*100,20,100-d.frame.inset);const h=Math.max(30,width*d.frame.width/100/(d.frame.shape==='circle'?1:d.frame.ratio)+e.clientY-d.y);update({...d.frame,width:w,ratio:locked||d.frame.shape==='circle'?d.frame.ratio:clamp(width*w/100/h,.01,100)});return;}if(d)update({...d.frame,focalX:clamp(d.frame.focalX-(e.clientX-d.x)/2,0,100),focalY:clamp(d.frame.focalY-(e.clientY-d.y)/2,0,100)});};
  const stop=()=>{drag.current=null;};
  const height=width*f.width/100/(f.shape==='circle'?1:f.ratio);
  const style={width:`${f.width+f.inset}%`,height:height+captionHeight+f.offset,marginBottom:f.gap,shapeOutside:`inset(${f.offset}px 0 0 0)`,shapeMargin:`${f.gap}px`,float:f.side==='block'?'none':f.side,clear:f.side==='block'?'both':'none','--frame-image-height':`${height}px`,'--frame-gap':`${f.gap}px`,'--frame-radius':f.shape==='circle'?'50%':f.shape==='rounded'?`${f.cornerRadius??16}px`:'0px','--frame-fit':f.shape==='circle'?'cover':f.fit,'--frame-zoom':f.zoom??1,'--frame-focal':`${f.focalX}% ${f.focalY}%`} as CSSProperties;
  const imageStyle={position:'relative',width:`${f.width/(f.width+f.inset)*100}%`,height:height+captionHeight,top:f.offset,left:f.side==='right'?0:`${f.inset/(f.width+f.inset)*100}%`} as CSSProperties;
  if(f.position==='free'){Object.assign(style,{position:'absolute',left:`${f.x??0}%`,top:`${f.y??0}%`,width:`${f.width}%`,height:height+captionHeight,margin:0,float:'none',clear:'none'});Object.assign(imageStyle,{width:'100%',left:0,top:0});}
  return <div className={`composition-float frame-${f.side}`} data-free-photo={f.position==='free'||undefined} style={style}>
    <div ref={host} className="composition-frame" style={imageStyle} data-selected={selected||undefined} data-photo-index={index} data-photo-shape={f.shape??'rect'} onClick={e=>{if(editing){e.stopPropagation();select();}}} onPointerDown={begin} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>
      {children}
      {editing&&<><button className="frame-select" aria-label={`写真${index+1}を選択`} aria-pressed={selected} onClick={select} onPointerDown={e=>e.stopPropagation()}>写真 {index+1}</button>{selected&&<button className="frame-resize" aria-label={`写真${index+1}の枠をリサイズ`} onPointerDown={e=>{e.preventDefault();e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,frame:{...f},resize:true};}} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop}>↘</button>}</>}
    </div>
  </div>;
}

function nodeText(node:ReactNode):string{
  if(typeof node==='string'||typeof node==='number')return String(node);
  if(Array.isArray(node))return node.map(nodeText).join(' ');
  return isValidElement<{children?:ReactNode}>(node)?nodeText(node.props.children):'';
}
function TextGroup({allowOverlap,layoutKey,frame,areaWidth,editing,selected,label,select,update,children}:{allowOverlap:boolean;layoutKey:string;frame:TextFrame;areaWidth:number;editing:boolean;selected:boolean;label:string;select:()=>void;update:(frame:TextFrame)=>void;children:ReactNode}){
  const host=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    const el=host.current,content=el?.querySelector<HTMLElement>(':scope > .text-block-content'),page=el?.closest('.magazine-page-content');if(!el||!content||!page)return;
    let raf=0,disposed=false;
    const measure=()=>{
      if(disposed||!el.getBoundingClientRect().width)return;
      const placed=!!el.closest('[data-reader-mode=spread]')&&!el.closest('[data-continuation]');
      // Isolate each paragraph's floats from neighbouring paragraphs. Its wrapper
      // still reserves the measured prose height, so the article remains in order.
      content.style.position=placed?'absolute':'';content.style.width=placed?'100%':'';content.style.left=placed?'0':'';content.style.top=placed?getComputedStyle(el).paddingTop:'';
      const enabled=!allowOverlap&&!!el.closest('[data-reader-mode=spread]')&&!el.closest('[data-continuation]');
      const groups=Array.from(page.querySelectorAll<HTMLElement>('.composition-text-group'));
      const obstacles=enabled?[
        ...Array.from(page.querySelectorAll<HTMLElement>('.composition-float')).filter(p=>p.hasAttribute('data-free-photo')||!!(p.compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING)),
        ...groups.slice(0,groups.indexOf(el)).filter(p=>p.hasAttribute('data-free-text')||el.hasAttribute('data-free-text')).map(p=>p.querySelector<HTMLElement>(':scope > .text-block-content')??p)
      ].map(p=>p.getBoundingClientRect()):[];
      const r=el.getBoundingClientRect();
      const shape=textWrapShapes({left:r.left,right:r.right,bottom:r.bottom,top:r.top+parseFloat(getComputedStyle(el).paddingTop||'0')},obstacles);
      for(const side of ['left','right'] as const){
        const exclusion=content.querySelector<HTMLElement>(`:scope > .text-exclusion-${side}`);
        if(!exclusion)continue;
        exclusion.style.height=`${shape[side==='left'?'leftWidth':'rightWidth']?shape.height:0}px`;
        exclusion.style.width=`${shape[side==='left'?'leftWidth':'rightWidth']}px`;
        exclusion.style.shapeOutside=shape[side];
      }
      if(placed){
        const origin=content.getBoundingClientRect().top;
        const bottom=Math.max(origin,...Array.from(content.children).filter(n=>!n.classList.contains('text-exclusion')).map(n=>n.getBoundingClientRect().bottom+parseFloat(getComputedStyle(n).marginBottom||'0')));
        const css=getComputedStyle(el);
        const h=bottom-origin;
        content.style.height=`${h}px`;
        el.style.minHeight=`${h+parseFloat(css.paddingTop)+parseFloat(css.paddingBottom)}px`;
      }else {el.style.removeProperty('min-height');content.style.removeProperty('height');}
    };
    const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(measure);};
    const observer=new ResizeObserver(schedule);observer.observe(page);page.querySelectorAll('.composition-float,.composition-text-group').forEach(p=>observer.observe(p));
    measure();document.fonts?.ready.then(schedule);window.addEventListener('resize',schedule);
    return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(raf);window.removeEventListener('resize',schedule);};
  },[allowOverlap,layoutKey]);
  const drag=useRef<{x:number;y:number;frame:TextFrame;moving?:boolean;pageWidth?:number;pageHeight?:number;height?:number}|null>(null);
  const beginMove=(e:PointerEvent<HTMLElement>)=>{
    e.preventDefault();e.stopPropagation();select();
    const box=host.current?.getBoundingClientRect(),paper=host.current?.closest('.magazine-page-content')?.getBoundingClientRect();if(!box||!paper)return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current={x:e.clientX,y:e.clientY,moving:true,pageWidth:paper.width,pageHeight:paper.height,height:box.height,
      frame:{...frame,position:'free',width:box.width/paper.width*100,inset:0,offset:0,x:(box.left-paper.left)/paper.width*100,y:(box.top-paper.top)/paper.height*100}};
  };
  const move=(e:PointerEvent<HTMLElement>)=>{const d=drag.current;if(!d)return;
    if(d.moving){update({...d.frame,x:clamp((d.frame.x??0)+(e.clientX-d.x)/d.pageWidth!*100,0,Math.max(0,100-d.frame.width)),y:clamp((d.frame.y??0)+(e.clientY-d.y)/d.pageHeight!*100,0,Math.max(0,100-d.height!/d.pageHeight!*100))});}
    else {const width=frame.position==='free'?(host.current?.closest('.magazine-page-content')?.getBoundingClientRect().width??areaWidth):areaWidth;update({...d.frame,width:clamp(d.frame.width+(e.clientX-d.x)/width*100,30,100-(d.frame.position==='free'?(d.frame.x??0):d.frame.inset)),bottomSpace:clamp((d.frame.bottomSpace??0)+e.clientY-d.y,0,500)});}
  };
  const stop=()=>{drag.current=null;};
  return <div ref={host} className="composition-text-group" data-free-text={frame.position==='free'||undefined} data-text-group={frame.id} data-selected={selected||undefined} data-custom-type={frame.fontSize!==undefined||undefined}
    onClick={editing?select:undefined}
    style={{width:`${frame.width}%`,marginLeft:`${frame.inset}%`,paddingTop:frame.offset,paddingBottom:frame.bottomSpace??0,...(frame.position==='free'?{position:'absolute',left:`${frame.x??0}%`,top:`${frame.y??0}%`,marginLeft:0,paddingTop:0}:{}),'--text-element-size':frame.fontSize?`${frame.fontSize/16}rem`:undefined} as CSSProperties}>
    {editing&&<button className="text-group-handle" aria-label={`文章を選択: ${label}`} aria-pressed={selected} onClick={select} onPointerDown={beginMove} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>✥</button>}
    <div className="text-block-content"><span aria-hidden="true" className="text-exclusion text-exclusion-left"/><span aria-hidden="true" className="text-exclusion text-exclusion-right"/>{children}</div>
    {editing&&selected&&<button className="text-frame-resize" aria-label="文章枠の幅と下余白を調整"
      onPointerDown={e=>{e.preventDefault();e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId);drag.current={x:e.clientX,y:e.clientY,frame:{...frame}};}}
      onPointerMove={move}
      onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>↘</button>}
  </div>;
}
