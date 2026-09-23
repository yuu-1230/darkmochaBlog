'use client';
import {useState} from 'react';
import {useCompositionSession} from './CompositionContext';
import {layoutRegistry,templateCandidates,templateComposition,densityPresets,type LayoutId} from '@/lib/layout-registry';
import {initialComposition,textSizes,type PhotoFrame} from '@/lib/page-composition';
import {pagePhotos,type BlockCatalog} from '@/lib/article-layout-options';
import Image from 'next/image';
import {backgrounds} from '@/lib/magazine';
import {resolveImageUrl} from '@/lib/image-url';
import type {PlannedPage} from '@/lib/remark-magazine-plan';

export function LayoutPresetControls({page,catalog,busy}:{page:PlannedPage;catalog:BlockCatalog;busy:boolean}){
 const context=useCompositionSession()!,{session:s,setSession}=context;
 const [candidate,setCandidate]=useState<LayoutId|''>('');
 if(!s)return null;
 const c=s.composition,photo=c.frames[s.selected],text=c.textGroups?.find(g=>g.id===s.selectedText);
 const choices=templateCandidates({...page,composition:c},catalog),photos=pagePhotos(page,catalog);
 const update=(patch:Partial<typeof c>)=>setSession(old=>old?{...old,composition:{...old.composition,...patch}}:old);
 const editPhoto=(patch:Partial<PhotoFrame>)=>setSession(old=>old?{...old,composition:{...old.composition,frames:old.composition.frames.map((f,i)=>i===old.selected?{...f,...patch}:f)}}:old);
 const editText=(patch:Partial<NonNullable<typeof text>>)=>update({textGroups:c.textGroups?.map(g=>g.id===text?.id?{...g,...patch}:g)});
 const asset=s.assets?.find(a=>a.src===(photo?.replacement??photo?.source));
 const originalRatio=asset?.width&&asset.height?asset.width/asset.height:1;
 const locked=!!c.fixed;
 return <fieldset disabled={busy||s.preview==='before'||s.preview==='mobile'}><legend>誌面の構成</legend>
  <label>テンプレート候補<select value={candidate} onChange={e=>setCandidate(e.target.value as LayoutId)}><option value="">候補を選択</option>{choices.map(id=><option key={id} value={id}>{layoutRegistry[id].name}</option>)}</select></label>
  {candidate&&choices.includes(candidate)&&<div className="layout-suggestion"><p>{layoutRegistry[candidate].preview}　{layoutRegistry[candidate].reason}</p><p>{layoutRegistry[candidate].desktop}。収まらない場合：{layoutRegistry[candidate].overflow}</p><button disabled={locked} onClick={()=>{update({...templateComposition(candidate,photos,s.textCount),textUnit:c.textUnit,textGroups:c.textGroups?.map(g=>({...g,width:100,inset:0,offset:0,bottomSpace:0,fontSize:undefined,position:undefined,x:undefined,y:undefined}))});setCandidate('');}}>候補をプレビューに適用</button></div>}
  <label className="live-layout-check"><input type="checkbox" checked={locked} onChange={e=>update({fixed:e.target.checked})}/>テンプレート・改ページを固定</label>
  <label className="live-layout-check"><input type="checkbox" checked={!!c.allowOverlap} onChange={e=>update({allowOverlap:e.target.checked})}/>写真と文章の重なりを許可（文章が上）</label>
  <label>密度<select value={c.density??'standard'} onChange={e=>update({density:e.target.value as typeof c.density})}>{Object.entries(densityPresets).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
  <label>見出しサイズ<select value={c.headingSize??'standard'} onChange={e=>update({headingSize:e.target.value as typeof c.headingSize})}><option value="small">小</option><option value="standard">標準</option><option value="large">大</option></select></label>
  <label>配色<select value={c.background??page.background??'paper'} onChange={e=>update({background:e.target.value as typeof c.background})}>{backgrounds.map((id,i)=><option key={id} value={id}>{['紙色','砂色','赤土','セージ','空色','墨色'][i]}</option>)}</select></label>
  <button onClick={()=>update({background:undefined,density:'standard',headingSize:'standard'})}>共通設定を標準へ</button>
  <fieldset><legend>選択中の要素</legend>
  <label>要素を選択<select value={photo?`photo:${s.selected}`:s.selectedText??''} onChange={e=>{const value=e.target.value;setSession(old=>old?{...old,selected:value.startsWith('photo:')?Number(value.slice(6)):-1,selectedText:value.startsWith('photo:')?undefined:value}:old);}}><option value="">選択してください</option>{c.frames.map((f,i)=><option key={f.source} value={`photo:${i}`}>写真 {i+1}</option>)}{(s.paragraphLabels??[]).map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
  {c.textUnit!=='paragraph'&&s.selectedText&&<button onClick={()=>update({textUnit:'paragraph',textGroups:s.paragraphLabels?.map(p=>({id:p.id,width:100,inset:0,offset:0}))})}>段落の設定を有効にする</button>}
  {text&&<>
   <p className="live-layout-help">文章枠の左上の✥をドラッグすると自由に移動できます。読む順序は変わりません。</p>
   <label>文章の配置方法<select value={text.position??'flow'} onChange={e=>editText({position:e.target.value==='free'?'free':undefined,x:text.x??0,y:text.y??0,inset:0,offset:0})}><option value="flow">本文に沿って配置</option><option value="free">紙面内に自由配置</option></select></label>
   {text.position==='free'&&<><Fine label="文章の左右位置" value={text.x??0} min={0} max={100-text.width} step={0.1} unit="%" onChange={x=>editText({x})}/><Fine label="文章の上下位置" value={text.y??0} min={0} max={100} step={0.1} unit="%" onChange={y=>editText({y})}/></>}

   <label>文字サイズ<select value={text.fontSize??''} onChange={e=>editText({fontSize:e.target.value?Number(e.target.value):undefined})}><option value="">テンプレートの標準</option>{textSizes.map(n=><option key={n} value={n}>{n}px</option>)}</select></label>
   <Fine label="文章幅（微調整）" value={text.width} min={30} max={100-text.inset} step={0.1} unit="%" onChange={width=>editText({width})}/>
   <Fine label="文章の下余白" value={text.bottomSpace??0} min={0} max={500} unit="px" onChange={bottomSpace=>editText({bottomSpace})}/>
   <label>文章幅<select value={text.width} onChange={e=>editText({width:Number(e.target.value),inset:0})}>{![100,75,60].includes(text.width)&&<option value={text.width}>保存済み {Math.round(text.width)}%</option>}<option value="100">標準（全幅）</option><option value="75">中（75%）</option><option value="60">細（60%）</option></select></label>
   <label>文章位置<select value={text.inset===0?'left':text.inset===100-text.width?'right':'center'} onChange={e=>editText({inset:e.target.value==='left'?0:e.target.value==='right'?100-text.width:(100-text.width)/2})}><option value="left">左</option><option value="center">中央</option><option value="right">右</option></select></label>
   <label>段落前の間隔<select value={text.offset} onChange={e=>editText({offset:Number(e.target.value)})}>{![0,12,24].includes(text.offset)&&<option value={text.offset}>保存済み</option>}<option value="0">標準</option><option value="12">小さな区切り</option><option value="24">大きな区切り</option></select></label>
   <button onClick={()=>editText({width:100,inset:0,offset:0,bottomSpace:0,fontSize:undefined,position:undefined,x:undefined,y:undefined})}>この段落を標準へ</button>
  </>}
  {photo&&<>
   <label>ドラッグ操作<select value={s.photoTool??'move'} onChange={e=>setSession(old=>old?{...old,photoTool:e.target.value as 'move'|'crop'}:old)}><option value="move">写真ブロックを移動</option><option value="crop">写真内の切り取り位置を調整</option></select></label>
   <label>配置方法<select value={photo.position??'flow'} onChange={e=>editPhoto({position:e.target.value==='free'?'free':undefined,x:photo.x??0,y:photo.y??0,inset:0,offset:0})}><option value="flow">本文に沿って配置</option><option value="free">紙面内に自由配置</option></select></label>
   {photo.position==='free'&&<><Fine label="写真の左右位置" value={photo.x??0} min={0} max={100-photo.width} step={0.1} unit="%" onChange={x=>editPhoto({x})}/><Fine label="写真の上下位置" value={photo.y??0} min={0} max={100} step={0.1} unit="%" onChange={y=>editPhoto({y})}/></>}

   <label>使用する写真<select value={photo.replacement??photo.source} onChange={e=>{const a=s.assets?.find(a=>a.src===e.target.value);editPhoto({replacement:e.target.value===photo.source?undefined:e.target.value,replacementId:e.target.value===photo.source?undefined:a?.assetId,ratio:a?.width&&a.height?a.width/a.height:1,fit:'contain',focalX:50,focalY:50,zoom:1});}}>{s.assets?.map(a=><option key={a.src} value={a.src}>{a.alt} · {a.src.split('/').at(-1)}</option>)}</select></label>
   <label>写真の役割<select value={photo.role??'main'} onChange={e=>editPhoto({role:e.target.value as 'main'|'support',width:e.target.value==='main'?52:32,inset:0})}><option value="main">主役写真</option><option value="support">補助写真</option></select></label>
   <label>写真の位置<select value={photo.side} onChange={e=>editPhoto({side:e.target.value as PhotoFrame['side'],inset:0,offset:0,width:e.target.value==='block'?100:photo.role==='support'?32:52})}><option value="left">左・本文は右</option><option value="right">右・本文は左</option><option value="block">本文の上下</option></select></label>
   <label>写真を置く本文位置<select value={photo.anchorId??s.paragraphLabels?.[0]?.id??'end'} onChange={e=>editPhoto({anchorId:e.target.value,anchor:undefined})}>{s.paragraphLabels?.map(p=><option key={p.id} value={p.id}>{p.label} の前</option>)}<option value="end">本文の後</option></select></label>
   <Fine label="写真枠の幅" value={photo.width} min={20} max={100-photo.inset} step={0.1} unit="%" onChange={width=>editPhoto({width})}/>
   <label className="live-layout-check"><input type="checkbox" checked={s.locked} onChange={e=>setSession(old=>old?{...old,locked:e.target.checked}:old)}/>リサイズ時に縦横比を固定</label>
   <label>写真の形<select value={photo.shape??'rect'} onChange={e=>editPhoto({shape:e.target.value as PhotoFrame['shape']})}><option value="rect">四角</option><option value="circle">円形</option><option value="rounded">角丸</option></select></label>
   {photo.shape==='rounded'&&<Fine label="角丸の大きさ" value={photo.cornerRadius??16} min={0} max={100} unit="px" onChange={cornerRadius=>editPhoto({cornerRadius})}/>}
   {photo.shape==='circle'&&<p className="live-layout-help">円形は1:1の枠で切り抜きます。焦点・ズームで見せる位置を調整できます。</p>}
   <fieldset disabled={photo.shape==='circle'}>
   <Fine label="写真枠の縦横比" value={photo.ratio} min={0.1} max={10} step={0.01} unit=":1" onChange={ratio=>editPhoto({ratio})}/>
   <label>写真の収め方<select value={photo.fit} onChange={e=>editPhoto({fit:e.target.value as PhotoFrame['fit'],zoom:1})}><option value="contain">全体を表示</option><option value="cover">枠に合わせて切り取る</option></select></label>
   </fieldset>
   <Fine label="写真のズーム" value={photo.zoom??1} min={1} max={4} step={0.01} unit="倍" onChange={zoom=>editPhoto({zoom,fit:'cover'})}/>
   <fieldset disabled={photo.shape==='circle'}><label>比率<select value="current" onChange={e=>editPhoto({ratio:e.target.value==='original'?originalRatio:Number(e.target.value),fit:e.target.value==='original'?'contain':'cover'})}><option value="current">現在 {photo.ratio.toFixed(2)} : 1</option><option value="original">元比率・全体表示</option><option value="0.8">4:5</option><option value="1.5">3:2</option><option value="1">1:1</option></select></label>
   </fieldset>
   <p className="live-layout-help">写真のドラッグは通常、ブロック全体を移動します。切り取りを調整する場合はドラッグ操作を切り替えてください。</p>
   {(['focalX','focalY'] as const).map((key,i)=><label key={key}>{i?'上下の焦点':'左右の焦点'} {Math.round(photo[key])}%<input type="range" aria-label={i?'上下の焦点':'左右の焦点'} min="0" max="100" value={photo[key]} onChange={e=>editPhoto({[key]:Number(e.target.value)})}/></label>)}
   <details><summary>元画像と切り取り範囲</summary><div className="layout-crop-source" style={{aspectRatio:originalRatio}}><Image src={resolveImageUrl(photo.replacement??photo.source)} alt={asset?.alt??'元画像'} fill sizes="270px" style={{objectFit:'contain'}}/>{(photo.fit==='cover'||photo.shape==='circle')&&<span style={{position:'absolute',border:'2px solid #fff',boxShadow:'0 0 0 1px #16392c',width:`${(Math.min(1,(photo.shape==='circle'?1:photo.ratio)/originalRatio)/(photo.zoom??1))*100}%`,height:`${(Math.min(1,originalRatio/(photo.shape==='circle'?1:photo.ratio))/(photo.zoom??1))*100}%`,left:`${(1-(Math.min(1,(photo.shape==='circle'?1:photo.ratio)/originalRatio)/(photo.zoom??1)))*photo.focalX}%`,top:`${(1-(Math.min(1,originalRatio/(photo.shape==='circle'?1:photo.ratio))/(photo.zoom??1)))*photo.focalY}%`}}/>}</div></details>
   <a href={resolveImageUrl(photo.replacement??photo.source)} target="_blank" rel="noreferrer">元画像を別タブで確認 ↗</a>
   <p className="live-layout-help">{asset?.width} × {asset?.height} px{asset?.credit&&` · ${asset.credit}`}</p>
   <button onClick={()=>editPhoto({...initialComposition([photos[s.selected]],s.textCount).frames[0],replacement:undefined,replacementId:undefined,anchorId:undefined,zoom:1,shape:undefined,cornerRadius:undefined,position:undefined,x:undefined,y:undefined})}>この写真を標準へ</button>
  </>}
  </fieldset>
 </fieldset>;
}

function Fine({label,value,min,max,step=1,unit,onChange}:{label:string;value:number;min:number;max:number;step?:number;unit:string;onChange:(value:number)=>void}){
 const change=(raw:string)=>{if(raw.trim()==='')return;const n=Number(raw);if(Number.isFinite(n))onChange(Math.min(max,Math.max(min,n)));};
 return <label>{label}（{unit}）<input type="range" aria-label={label} min={min} max={max} step={step} value={value} onChange={e=>change(e.target.value)}/><input type="number" aria-label={`${label}の数値`} min={min} max={max} step={step} value={Number(value.toFixed(2))} onChange={e=>change(e.target.value)}/></label>;
}
