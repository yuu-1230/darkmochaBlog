'use client';
import {previewLayout} from '@/app/actions/preview-layout';
import {useCompositionSession} from './CompositionContext';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {initialComposition} from '@/lib/page-composition';
import {layoutOptions,pagePhotos,type BlockCatalog} from '@/lib/article-layout-options';
import {assignPages,isProtectedPage,type AssignmentAction} from '@/lib/layout-assignment';
import {layoutRegistry,type LayoutId} from '@/lib/layout-registry';
import type {PlannedPage} from '@/lib/remark-magazine-plan';
export function ArticleLayoutEditor({locale,slug}:{locale:string;slug:string}){
  const context=useCompositionSession()!;
  const router=useRouter();
  const [plan,setPlan]=useState<PlannedPage[]>([]),[before,setBefore]=useState<PlannedPage[]>([]);
  const [revision,setRevision]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [past,setPast]=useState<PlannedPage[][]>([]),[future,setFuture]=useState<PlannedPage[][]>([]);
  const [breakAt,setBreakAt]=useState<Record<string,number>>({});
  function edit(next:PlannedPage[]){context.setPlanPreview(null);setPast(v=>[...v.slice(-99),plan]);setFuture([]);setPlan(next);setConfirm(false);}
  function undo(){if(!past.length)return;context.setPlanPreview(null);setFuture(v=>[plan,...v]);setPlan(past.at(-1)!);setPast(v=>v.slice(0,-1));setConfirm(false);}
  function redo(){if(!future.length)return;context.setPlanPreview(null);setPast(v=>[...v,plan]);setPlan(future[0]);setFuture(v=>v.slice(1));setConfirm(false);}
  const [catalog,setCatalog]=useState<BlockCatalog>({});
  const dirty=JSON.stringify(plan)!==JSON.stringify(before);
  useEffect(()=>{if(!dirty)return;const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();};const link=(event:MouseEvent)=>{const a=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(a&&a.target!=='_blank'&&new URL(a.href).pathname!==location.pathname){event.preventDefault();event.stopImmediatePropagation();setMessage('移動する前に配置案を保存するか、取り消してください。');}};window.addEventListener('beforeunload',warn);document.addEventListener('click',link,true);return()=>{window.removeEventListener('beforeunload',warn);document.removeEventListener('click',link,true);};},[dirty]);
  function editPhoto(index:number,src:string,values:NonNullable<PlannedPage['photos']>[string]){edit(plan.map((p,i)=>i===index?{...p,photos:{...p.photos,[src]:{...p.photos?.[src],...values}}}:p));setConfirm(false);}
  async function load(){setBusy(true);try{const r=await fetch(`/api/local/layout?locale=${locale}&slug=${slug}`,{cache:'no-store'});const data=await r.json();if(!r.ok)throw new Error(data.error);setCatalog(data.catalog);setPlan(data.plan);setBefore(data.plan);setRevision(data.revision);setPast([]);setFuture([]);setMessage('');}catch(e){setMessage(String(e));}finally{setBusy(false);}}
  function assign(index:number,action:AssignmentAction){try{edit(assignPages(plan,index,action,catalog));setMessage('配置案を変更しました。差分を確認して保存できます。');}catch(e){setMessage(String(e));}}
  async function preview(){setBusy(true);try{context.setSession(null);context.setPlanPreview(await previewLayout(locale,slug,revision,plan));setMessage('未保存の配置案を誌面に表示中です。');document.querySelector('.magazine-header')?.scrollIntoView({block:'start'});}catch(e){setMessage(String(e));}finally{setBusy(false);}}
  async function save(){setBusy(true);setMessage("保存しています…");try{const r=await fetch('/api/local/layout',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale,slug,revision,plan})});const data=await r.json();if(!r.ok)throw new Error(data.error==='CONFLICT'?'別の場所で更新されています。設定を控えて再読込してください。':data.error);context.setPlanPreview(null);setRevision(data.revision);setPlan(data.plan);setBefore(data.plan);setConfirm(false);setMessage('配置を保存しました。誌面を再確認してください。');router.refresh();}catch(e){setMessage(String(e));}finally{setBusy(false);}}
  if(context.session)return null;
  return <details className="article-layout-editor"><summary>誌面の配置を編集（localhost限定）</summary><p>本文は変更せず、型とブロックの割り当てを保存します。本文順を保つため、移動できるのは隣のページとの境界だけです。型の変更・ブロック移動をしたページの直接編集設定はリセットされます。</p><button disabled={busy||dirty} onClick={load}>現在の配置を読み込む</button><p role="status">{message}</p><button disabled={busy||!past.length} onClick={undo}>配置を元に戻す</button><button disabled={busy||!future.length} onClick={redo}>配置をやり直す</button>
    <div className="layout-editor-pages">{plan.map((page,i)=><fieldset key={page.id} disabled={busy}><legend>{i+1}ページ · {page.id}</legend><p>{page.blocks.join(' → ')}</p><a href={`#page-${page.id}`}>この誌面を見る</a>{page.template==='feature'&&<label>誌面の型<select value={page.layout} onChange={e=>{edit(plan.map((p,j)=>j===i?{...p,composition:undefined,layout:e.target.value as PlannedPage['layout']}:p));setConfirm(false);}}>{layoutOptions(page,catalog).map(v=><option key={v} value={v}>{layoutRegistry[v as LayoutId].name}</option>)}</select></label>}
    {page.template==='feature'&&page.layout==='pair'&&<label>配分<select value={page.balance??'photo'} onChange={e=>{edit(plan.map((p,j)=>j===i?{...p,balance:e.target.value as 'photo'|'text'}:p));setConfirm(false);}}><option value="photo">写真重視</option><option value="text">文章重視</option></select></label>}
    {page.template==='feature'&&pagePhotos(page,catalog).map((photo,n)=><details key={photo.src}><summary>写真 {n+1} · {photo.width} × {photo.height}</summary><label>写真の見せ方<select value={page.photos?.[photo.src]?.ratio??'original'} onChange={e=>editPhoto(i,photo.src,{ratio:e.target.value as 'original'|'portrait'|'landscape'|'square',fit:e.target.value==='original'?'contain':'cover'})}><option value="original">全体を表示</option><option value="portrait">縦長にトリミング</option><option value="landscape">横長にトリミング</option><option value="square">正方形にトリミング</option></select></label>{[0,1].map(axis=>{const point=(page.photos?.[photo.src]?.focal??'50% 50%').split(' ').map(parseFloat);return <label key={axis}>{axis===0?'左右':'上下'}の焦点 {point[axis]}%<input type="range" min="0" max="100" value={point[axis]} disabled={!page.photos?.[photo.src]?.ratio||page.photos[photo.src].ratio==='original'} onChange={e=>{point[axis]=Number(e.target.value);editPhoto(i,photo.src,{focal:point.map(v=>v+'%').join(' ')});}} /></label>;})}</details>)}
    {!isProtectedPage(plan,i)&&<>
    <label><input type="checkbox" checked={!!page.composition?.fixed} onChange={e=>edit(plan.map((p,j)=>j===i?{...p,composition:{...(p.composition??initialComposition(pagePhotos(p,catalog),0)),fixed:e.target.checked}}:p))}/>改ページの固定（解除後に割り当てを変更）</label>
    <button disabled={!!page.composition?.fixed||page.blocks.length<2||isProtectedPage(plan,i-1)||!!plan[i-1]?.composition?.fixed} onClick={()=>assign(i,{type:'move',direction:-1})}>先頭のまとまりを前へ</button>
    <button disabled={!!page.composition?.fixed||page.blocks.length<2||isProtectedPage(plan,i+1)||!!plan[i+1]?.composition?.fixed} onClick={()=>assign(i,{type:'move',direction:1})}>末尾のまとまりを次へ</button>
    <button disabled={!!page.composition?.fixed||isProtectedPage(plan,i+1)||!!plan[i+1]?.composition?.fixed} onClick={()=>assign(i,{type:'merge'})}>次のページと結合</button>
    {page.blocks.length>1&&<><label>ページの区切り<select value={breakAt[page.id]??1} onChange={e=>setBreakAt({...breakAt,[page.id]:Number(e.target.value)})}>{page.blocks.slice(1).map((id,n)=><option key={id} value={n+1}>{id} の前</option>)}</select></label><button disabled={!!page.composition?.fixed} onClick={()=>assign(i,{type:'split',at:breakAt[page.id]??1,newId:`sheet-${crypto.randomUUID()}`})}>ここで次ページへ分割</button></>}
    </>}
    </fieldset>)}</div>
    {dirty&&<><button disabled={busy} onClick={preview}>配置案を誌面でプレビュー</button><button disabled={busy||!context.planPreview} onClick={()=>context.setPlanPreview(null)}>保存前の誌面へ戻す</button><button disabled={busy} onClick={()=>{context.setPlanPreview(null);setMessage('配置案を破棄しました。');setPlan(before);setPast([]);setFuture([]);setConfirm(false);}}>取り消す</button><button disabled={busy} onClick={()=>setConfirm(true)}>差分を確認</button></>}{confirm&&<><pre>{JSON.stringify({before,after:plan},null,2)}</pre><button disabled={busy} onClick={save}>配置を保存して誌面へ反映</button></>}
  </details>;
}
