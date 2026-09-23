'use client';
import {useEffect,useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {LayoutPresetControls} from './LayoutPresetControls';
import Image from 'next/image';
import {resolveImageUrl} from '@/lib/image-url';
import {useCompositionSession} from './CompositionContext';
import {templateComposition,type LayoutId} from '@/lib/layout-registry';
import {pagePhotos,type BlockCatalog} from '@/lib/article-layout-options';
import {placements,type PageSettings} from '@/lib/magazine';
import type {PlannedPage} from '@/lib/remark-magazine-plan';

export function LiveLayoutEditor({locale,slug}:{locale:string;slug:string}){
  const context=useCompositionSession()!;
  const {session,setSession}=context;
  const router=useRouter();
  const [working,setWorking]=useState<PlannedPage[]>([]),[saved,setSaved]=useState<PlannedPage[]>([]);
  const [catalog,setCatalog]=useState<BlockCatalog>({}),[revision,setRevision]=useState('');
  const [saving,setBusy]=useState(false),[message,setMessage]=useState('');
  const [refreshing,startRefresh]=useTransition();
  const busy=saving||refreshing;
  useEffect(()=>{
    if(!session)return;
    const key=(event:KeyboardEvent)=>{
      if(!(event.metaKey||event.ctrlKey)||event.altKey||event.isComposing)return;
      const target=event.target as HTMLElement;
      if(target.closest('textarea,[contenteditable="true"],input:not([type="range"]):not([type="checkbox"])'))return;
      const key=event.key.toLowerCase();
      if(key!=='z'&&key!=='y')return;
      event.preventDefault();
      if(busy)return;
      if(key==='y'||event.shiftKey)context.redo();else context.undo();
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  },[session,busy,context]);
  const [invalid,setInvalid]=useState<Record<string,boolean>>({});
  const effective=working.map(page=>session&&page.id===session.pageId?session.opening?{...page,...session.opening}:!page.composition&&session.baseComposition===JSON.stringify(session.composition)?page:{...page,composition:session.composition}:page);
  const dirty=JSON.stringify(effective)!==JSON.stringify(saved);
  useEffect(()=>{
    if(!session)return;
    document.documentElement.dataset.compositionEditor='true';
    const leave=(event:BeforeUnloadEvent)=>{if(dirty)event.preventDefault();};
    const link=(event:MouseEvent)=>{const a=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(a&&dirty&&a.target!=='_blank'){event.preventDefault();event.stopImmediatePropagation();setMessage('移動する前に変更を保存するか、取り消してください。');}};
    window.addEventListener('beforeunload',leave);document.addEventListener('click',link,true);
    return()=>{delete document.documentElement.dataset.compositionEditor;window.removeEventListener('beforeunload',leave);document.removeEventListener('click',link,true);};
  },[session,dirty]);
  const textCount=(id:string)=>Number(document.getElementById(`page-${id}`)?.querySelector('[data-text-count]')?.getAttribute('data-text-count')??0);
  function choose(page:PlannedPage,blocks:BlockCatalog=catalog){
    if(session){setWorking(effective);setInvalid({...invalid,[session.pageId]:session.overflow});}
    const composition=page.composition??templateComposition((['portrait','landscape','pair','data','mosaic'].includes(page.layout??'')?page.layout:'text') as LayoutId,pagePhotos(page,blocks),textCount(page.id));
    setSession({pageId:page.id,baseComposition:JSON.stringify(composition),preview:'desktop',assets:Array.from(new Map(Object.values(blocks).flatMap(b=>b.photos).map(a=>[a.src,a])).values()),opening:page.template==='opening'?{image:page.image,title:page.title,subtitle:page.subtitle,focal:page.focal,placement:page.placement,tone:page.tone,overlay:page.overlay,background:page.background}:undefined,composition,selected:0,locked:true,overflow:false,textCount:textCount(page.id)});
    history.replaceState({...history.state},'',`#page-${page.id}`);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    setMessage('');document.querySelector('.magazine-header')?.scrollIntoView({block:'start',behavior:'instant'});
  }
  async function start(){
    setBusy(true);setMessage('');
    try{
      const response=await fetch(`/api/local/layout?locale=${locale}&slug=${slug}`,{cache:'no-store'}),data=await response.json();
      if(!response.ok)throw new Error(data.error);
      const pages=data.plan as PlannedPage[];
      const visible=Array.from(document.querySelectorAll<HTMLElement>('[data-magazine-page]')).filter(p=>!p.hidden).map(p=>p.dataset.magazinePage);
      const first=pages.find(p=>['opening','editorial','feature','text'].includes(p.template??'')&&visible.includes(p.id))??pages.find(p=>['opening','editorial','feature','text'].includes(p.template??''));
      if(!first)throw new Error('直接編集できる本文ページがありません');
      setWorking(pages);setSaved(pages);setRevision(data.revision);setCatalog(data.catalog);setInvalid({});choose(first,data.catalog);
    }catch(error){setMessage(String(error));}finally{setBusy(false);}
  }
  async function save(){
    setBusy(true);setMessage('保存しています…');
    try{
      const response=await fetch('/api/local/layout',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale,slug,revision,plan:effective})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error==='CONFLICT'?'別の編集が保存されています。変更を控えてから読み込み直してください。':data.error);
      setRevision(data.revision);setWorking(data.plan);setSaved(data.plan);setSession(s=>s?{...s,composition:data.plan.find((p:PlannedPage)=>p.id===s.pageId)?.composition??s.composition}:s);setMessage('保存しました。編集を終了しても配置は残ります。');startRefresh(()=>router.refresh());
    }catch(error){setMessage(String(error));}finally{setBusy(false);}
  }
  if(!session)return <div className="live-layout-launch"><button disabled={busy||!!context.planPreview} onClick={start}>誌面を直接編集</button>{message&&<p role="status">{message}</p>}</div>;
  const index=working.findIndex(p=>p.id===session.pageId);
  const editOpening=(values:NonNullable<typeof session.opening>)=>setSession(s=>s?{...s,opening:{...s.opening,...values}}:s);
  const overflowPages=working.filter(p=>p.id===session.pageId?session.overflow:invalid[p.id]);
  const overflow=overflowPages.length>0;
  return <aside className="live-layout-panel" aria-label="誌面の直接編集">
    <div className="live-layout-heading"><strong>誌面を整える</strong><button disabled={busy||dirty} onClick={()=>setSession(null)}>編集を終了</button></div>
    <div className="live-layout-history"><button disabled={busy||!context.canUndo} onClick={context.undo}>元に戻す ⌘Z</button><button disabled={busy||!context.canRedo} onClick={context.redo}>やり直す ⌘Y</button></div>
    <label>編集するページ<select value={session.pageId} disabled={busy} onChange={e=>choose(effective.find(p=>p.id===e.target.value)!)}>{working.map((p,i)=>['opening','editorial','feature','text'].includes(p.template??'')&&<option key={p.id} value={p.id}>{i+1}ページ · {p.id}</option>)}</select></label>
    <div className="layout-preview-modes" aria-label="プレビュー切替">{(['desktop','mobile','before'] as const).map((mode,i)=><button key={mode} aria-pressed={(session.preview??'desktop')===mode} onClick={()=>setSession(s=>s?{...s,preview:mode}:s)}>{['PC','スマホ','保存前と比較'][i]}</button>)}</div>
    <details><summary>ページ一覧・サムネイル</summary><div className="layout-thumbnails">{working.map((p,i)=><button key={p.id} disabled={p.template==='spotlight'} onClick={()=>choose(effective[i])}>{(p.image??pagePhotos(p,catalog)[0]?.src)&&<Image src={resolveImageUrl(p.image??pagePhotos(p,catalog)[0].src)} alt="" width={72} height={54}/>}<span>{i+1} · {p.template}</span></button>)}</div></details>
    <p role="status">{dirty?'未保存の変更があります':'保存済みの配置です'}</p>
    {session.opening?<fieldset disabled={busy||session.preview!=='desktop'}><legend>導入の全面写真と題名</legend>
      <p className="live-layout-help">1ページ目は全面写真を保ち、写真の焦点と題名の位置を調整します。</p>
      <label>誌面の題名<textarea value={session.opening.title??''} onChange={e=>editOpening({title:e.target.value})}/></label>
      <label>副題<textarea value={session.opening.subtitle??''} onChange={e=>editOpening({subtitle:e.target.value})}/></label>
      <label>文字の位置<select value={session.opening.placement??'top-left'} onChange={e=>editOpening({placement:e.target.value as PageSettings['placement']})}>{placements.map((v,i)=><option key={v} value={v}>{['左上','右上','中央','左下','右下'][i]}</option>)}</select></label>
      <label>文字色<select value={session.opening.tone??'light'} onChange={e=>editOpening({tone:e.target.value as 'light'|'dark'})}><option value="light">明るい文字</option><option value="dark">暗い文字</option></select></label>
      <label>文字の背後<select value={session.opening.overlay??'none'} onChange={e=>editOpening({overlay:e.target.value as 'none'|'local'})}><option value="none">補助なし</option><option value="local">局所グラデーション</option></select></label>
      {[0,1].map(axis=>{const focal=(session.opening!.focal??'50% 50%').split(' ').map(parseFloat);return <Range key={axis} label={axis===0?'写真内の左右位置':'写真内の上下位置'} value={focal[axis]} min={0} max={100} unit="%" onChange={value=>{focal[axis]=value;editOpening({focal:focal.map(n=>`${n}%`).join(' ')});}}/>;})}
      <button onClick={()=>editOpening({placement:working[index].placement??'top-left',tone:working[index].tone??'light',overlay:working[index].overlay??'none',focal:working[index].focal??'50% 50%'})}>写真と文字位置を保存前へ</button>
    </fieldset>:<LayoutPresetControls key={session.pageId} page={working[index]} catalog={catalog} busy={busy}/>}
    <p className={overflow?'live-layout-warning':'live-layout-status'} role="status">{overflow?`はみ出しがあります（${overflowPages.map(p=>`${working.indexOf(p)+1}ページ`).join('・')}）。配置は保存して、後から修正できます。`:'誌面内に収まっています。'}</p>
    {overflow&&<p className="live-layout-help">別テンプレート、コンパクト密度、関連ブロックの次ページへの移動を検討してください。読者画面では、収まらない内容を続きのページへ分割します。</p>}
    {session.advice?.length? <div className="layout-advice"><strong>確認事項</strong><ul>{session.advice.map(a=><li key={a}>{a}</li>)}</ul></div>:null}
    <div className="live-layout-actions"><button disabled={busy||!dirty||session.preview!=='desktop'} onClick={save}>変更を保存</button><button disabled={busy} onClick={()=>{setWorking(saved);setSession(null);setMessage('変更を取り消しました。');}}>変更を取り消して閉じる</button></div>
    <p role="status">{refreshing?'保存した配置を記事に反映しています…':message}</p>
  </aside>;
}
function Range({label,value,min,max,unit,onChange}:{label:string;value:number;min:number;max:number;unit:string;onChange:(n:number)=>void}){
  return <label className="live-layout-range"><span>{label}<output>{Math.round(value)}{unit}</output></span><input type="range" aria-label={label} min={min} max={max} step={1} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}
