'use client';
import {useEffect,useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import type {PostData} from '@/lib/mdx';
import {backgrounds,placements,type CoverSettings} from '@/lib/magazine';
import type {CoverEdit} from '@/lib/cover-editor';
import {ArticleCoverCard} from './ArticleCoverCard';
import {validCoverImage} from '@/lib/cover-editor-image';
import {CoverReview} from './CoverReview';

type Draft = {cover:CoverSettings;displayTitle:string;cardSummary:string};
export function CoverEditor({posts:initial,locale}:{posts:PostData[];locale:string}) {
  const router=useRouter();
  const [refreshing,startRefresh]=useTransition();
  // Saved local edits bridge the API response until fresh server props arrive.
  const [local,setLocal]=useState<{source:PostData[];edits:Record<string,Draft>}>({source:initial,edits:{}});
  const posts=initial.map(p=>local.source===initial && local.edits[p.slug]?{...p,frontmatter:{...p.frontmatter,...local.edits[p.slug]}}:p);
  function applySaved(slug:string,edit:Draft) {
    setLocal(old=>({source:initial,edits:{...(old.source===initial?old.edits:{}),[slug]:edit}}));
  }
  const [enabled,setEnabled]=useState(false);
  const [review,setReview]=useState(false);
  const [selected,setSelected]=useState('');
  const [draft,setDraft]=useState<Draft|null>(null);
  const [baseline,setBaseline]=useState<Draft|null>(null);
  const [revision,setRevision]=useState('');
  const [saving,setBusy]=useState(false);
  const busy=saving||refreshing;
  const [message,setMessage]=useState('');
  const [diff,setDiff]=useState(false);
  const [mobile,setMobile]=useState(false);
  const dirty=JSON.stringify(draft)!==JSON.stringify(baseline);
  useEffect(()=>{
    const prevent=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};
    const preventNavigation=(e:MouseEvent)=>{if(dirty && e.target instanceof Element && e.target.closest('a[href]')){e.preventDefault();e.stopPropagation();setMessage('移動する前に、変更を保存するか取り消してください。');}};
    window.addEventListener('beforeunload',prevent);
    document.addEventListener('click',preventNavigation,true);
    return()=>{window.removeEventListener('beforeunload',prevent);document.removeEventListener('click',preventNavigation,true);};
  },[dirty]);
  const post=posts.find(p=>p.slug===selected);
  async function select(slug:string) {
    if(dirty || busy) return;
    setBusy(true);setMessage('');setDiff(false);
    try {
      const response=await fetch(`/api/local/cover?locale=${locale}&slug=${encodeURIComponent(slug)}`,{cache:'no-store'});
      const result=await response.json();if(!response.ok)throw new Error(result.error);
      setSelected(slug);setDraft(result.edit);setBaseline(result.edit);setRevision(result.revision);
      applySaved(slug,result.edit);
    } catch(e){setMessage(e instanceof Error?e.message:'読み込めませんでした');}
    finally{setBusy(false);}
  }
  function cover(key:keyof CoverSettings,value:string|number) {
    setDiff(false);
    setDraft(old=>{
      if(!old)return old;
      const next={...old.cover,[key]:value||undefined};
      if(key==='template'&&value!=='split'){delete next.textSide;delete next.imageFit;}
      return {...old,cover:JSON.parse(JSON.stringify(next))};
    });
  }
  async function save() {
    if(!draft)return;
    setBusy(true);setMessage('');
    try {
      const response=await fetch('/api/local/cover',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale,slug:selected,revision,edit:draft satisfies CoverEdit})});
      const result=await response.json();if(!response.ok)throw new Error(result.error);
      setBaseline(result.edit);setDraft(result.edit);setRevision(result.revision);setDiff(false);
      applySaved(selected,result.edit);
      startRefresh(()=>router.refresh());
      setMessage('MDXに保存しました。');
    }catch(e){setMessage(e instanceof Error?e.message:'保存できませんでした');}
    finally{setBusy(false);}
  }
  const numeric=(name:string,key:'imageZoom'|'titleFontSize'|'subtitleFontSize'|'labelFontSize',min:number,max:number,fallback:number,unit:string)=> <label>{name} {draft?.cover[key]===undefined?'自動':`${draft.cover[key]}${unit}`}<input aria-label={name} type="range" min={min} max={max} step="1" value={draft?.cover[key]??fallback} onChange={e=>cover(key,Number(e.target.value))}/><button type="button" onClick={()=>cover(key,'')}>自動に戻す</button></label>;
  const field=(name:string,key:keyof CoverSettings,options:readonly string[]) => <label>{name}<select value={draft?.cover[key]??''} onChange={e=>cover(key,e.target.value)}><option value="">初期値</option>{options.map(v=><option key={v}>{v}</option>)}</select></label>;
  const images=Array.from(new Set([post?.frontmatter.image, draft?.cover.image,...(post?.content.match(/\/images\/[^\s"'<>)}]+\.(?:jpg|jpeg|png|webp|gif|JPG|PNG)/g)??[])].filter((v):v is string=>!!v)));
  const imageValid=validCoverImage(draft?.cover.image??'');
  const preview=(p:PostData)=>enabled&&p.slug===selected&&draft?{...p,frontmatter:{...p.frontmatter,...draft,cover:{...draft.cover,image:imageValid?draft.cover.image:p.frontmatter.cover?.image}}}:p;
  return <>
    <div className="local-cover-toolbar">
      <label><input type="checkbox" checked={enabled} disabled={dirty||busy} onChange={e=>{setEnabled(e.target.checked);setReview(false);}}/> 表紙の編集モード</label>
      <button disabled={dirty||busy} onClick={()=>setReview(!review)}>{review?'記事一覧へ戻る':'全テンプレートを比較'}</button>
      <span>localhost限定 · {locale.toUpperCase()}の記事</span>
    </div>
    <p role="status" className="local-cover-message">{message}</p>
    {review?<CoverReview posts={posts}/>:<>
      {enabled&&<section className="local-cover-editor" aria-label="表紙設定">
        <div className="local-cover-picker"><label>編集する記事<select disabled={dirty||busy} value={selected} onChange={e=>select(e.target.value)}><option value="">記事を選んでください</option>{posts.map(p=><option key={p.slug} value={p.slug}>{p.frontmatter.displayTitle??p.frontmatter.title}</option>)}</select></label><span>{dirty?'未保存の変更あり':'設定は保存ボタンを押すまでファイルに反映されません。'}</span></div>
        {draft&&post&&<>
          <div className="local-cover-workspace">
            <div className="local-cover-preview"><ArticleCoverCard post={preview(post)}/></div>
            <fieldset disabled={busy} className="local-cover-fields"><legend>表紙と一覧の設定</legend>
              {field('表紙の種類','mode',['composed','image'])}
              {draft.cover.mode!=='image'&&field('テンプレート','template',['overlay','vertical','split','typographic'])}
              <label className="editor-wide">写真・完成画像<input list="article-cover-images" value={draft.cover.image??post.frontmatter.image??''} onChange={e=>cover('image',e.target.value)} placeholder="/images/…"/><datalist id="article-cover-images">{images.map(src=><option key={src} value={src}/>)}</datalist>{!imageValid&&<span role="alert">/images/ のパス、または設定済み画像配信元のURLを入力してください。</span>}</label>
              {numeric('写真の拡大率','imageZoom',100,250,100,'%')}
              {['横','縦'].map((name,i)=>{const xy=(draft.cover.focal??'50% 50%').split(' ').map(parseFloat);return <label key={name}>写真の{name}位置 {xy[i]}%<input type="range" min="0" max="100" value={xy[i]} onChange={e=>{xy[i]=Number(e.target.value);cover('focal',`${xy[0]}% ${xy[1]}%`);}}/></label>;})}
              {draft.cover.mode!=='image'&&<>
                <label>表紙の題名<textarea value={draft.cover.title??''} placeholder={post.frontmatter.displayTitle??post.frontmatter.title} onChange={e=>cover('title',e.target.value)}/></label>
                <label>表紙の副題<textarea value={draft.cover.subtitle??''} onChange={e=>cover('subtitle',e.target.value)}/></label>
                <label>小さなカテゴリー<input value={draft.cover.label??''} onChange={e=>cover('label',e.target.value)}/></label>
                {field('文字の配置','placement',placements)}{field('題名サイズの基本','titleSize',['small','medium','large'])}
                {numeric('題名の文字サイズ','titleFontSize',16,64,32,'px')}
                {numeric('副題の文字サイズ','subtitleFontSize',10,28,12,'px')}
                {numeric('カテゴリーの文字サイズ','labelFontSize',10,24,11,'px')}
                {field('文字色','tone',['light','dark'])}{field('背景色','background',backgrounds)}{field('局所グラデーション','overlay',['none','local'])}
                {draft.cover.template==='split'&&<>{field('文字帯の位置','textSide',['top','bottom'])}{field('画像の収め方','imageFit',['cover','contain'])}</>}
              </>}
              <label>一覧用タイトル<textarea value={draft.displayTitle} onChange={e=>{setDiff(false);setDraft({...draft,displayTitle:e.target.value});}}/></label>
              <label>一覧の短い概要<textarea value={draft.cardSummary} onChange={e=>{setDiff(false);setDraft({...draft,cardSummary:e.target.value});}}/></label>
            </fieldset>
          </div>
          <div className="local-cover-actions"><button disabled={!dirty||busy} onClick={()=>{setDraft(baseline);setDiff(false);setMessage('変更を取り消しました');}}>変更を取り消す</button><button disabled={!dirty||busy} onClick={()=>setDiff(true)}>保存前の差分を確認</button></div>
          {diff&&<div className="local-cover-diff"><h3>変更する項目</h3>{(['cover','displayTitle','cardSummary'] as const).filter(key=>JSON.stringify(baseline?.[key])!==JSON.stringify(draft[key])).map(key=><div key={key}><h4>{key}</h4><div><pre aria-label={`${key} 保存前`}>{JSON.stringify(baseline?.[key],null,2)}</pre><pre aria-label={`${key} 保存後`}>{JSON.stringify(draft[key],null,2)}</pre></div></div>)}<button disabled={busy||!dirty||!imageValid} onClick={save}>{busy?'保存中…':'この内容をMDXに保存'}</button></div>}
        </>}
      </section>}
      <div className="local-cover-layout"><h1 className="sr-only">Darkmocha Journal</h1>{enabled&&<label><input type="checkbox" checked={mobile} onChange={e=>setMobile(e.target.checked)}/> 1列で比較</label>}</div>
      <div className={`journal-grid ${enabled&&mobile?'local-cover-one-column':''}`}>{posts.map((p,i)=><div key={p.slug} className="local-cover-item">{enabled&&<button disabled={dirty||busy} aria-pressed={selected===p.slug} onClick={()=>select(p.slug)}>この表紙を編集</button>}<ArticleCoverCard post={preview(p)} priority={i===0}/></div>)}</div>
    </>}
  </>;
}
