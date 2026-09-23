import {isProtectedPage} from './layout-assignment';
import {templateCandidates} from './layout-registry';
import {validateComposition} from './page-composition';
import matter from 'gray-matter';
import {writeReader} from './layout-reader-data';
import remarkMagazinePlan,{type PlannedPage} from './remark-magazine-plan';
import manifest from '../content/image-manifest.json';
import {layoutOptions,pagePhotos,type BlockCatalog} from './article-layout-options';
import {validatePhoto,validatePage} from './magazine-validation';
export function patchArticleLayout(source:string,plan:PlannedPage[]) {
  if(!Array.isArray(plan)||plan.length>100)throw new Error('ページ設定が不正です');
  const parsed=matter(source);
  const catalog=articleBlockCatalog(source);
  plan=structuredClone(plan);const assets=Object.values(catalog).flatMap(b=>b.photos);for(const page of plan)for(const f of page.composition?.frames??[]){if(f.sourceId){const a=assets.find(a=>a.assetId===f.sourceId);if(!a)throw new Error('元画像IDが見つかりません');f.source=a.src;}if(f.replacementId){const a=assets.find(a=>a.assetId===f.replacementId);if(!a)throw new Error('差し替え画像IDが見つかりません');f.replacement=a.src;}}
  const blocks=[...parsed.content.matchAll(/<ArticleBlock id="([^"]+)">/g)].map(m=>({type:'mdxJsxFlowElement',name:'ArticleBlock',attributes:[{type:'mdxJsxAttribute',name:'id',value:m[1]}],children:(catalog[m[1]]?.photos??[]).map(photo=>({type:'mdxJsxFlowElement',name:'Photo',attributes:[{type:'mdxJsxAttribute',name:'src',value:photo.src}]}))}));
  if(!blocks.length)throw new Error('ブロック形式の記事だけ編集できます');
  const original=parsed.data.reader?.pages as PlannedPage[] | undefined;
  if(!original || !plan.length)throw new Error('少なくとも1ページを配置してください');
  for(const [i,before] of original.entries())if(isProtectedPage(original,i)){const after=plan.find(p=>p.id===before.id);if(!after||before.template!==after.template||JSON.stringify(before.blocks)!==JSON.stringify(after.blocks)||before.image!==after.image)throw new Error('導入・終幕の本文・画像・型は保持してください');if(before.template==='spotlight'&&JSON.stringify(before)!==JSON.stringify(after))throw new Error('終幕はこのエディターの編集対象外です');}
  for(const page of original.filter(p=>p.composition?.fixed)){const after=plan.find(p=>p.id===page.id);if(!after||after.composition?.fixed&&(JSON.stringify(after.blocks)!==JSON.stringify(page.blocks)||after.composition?.templateId!==page.composition?.templateId))throw new Error('固定を解除してからページ構成を変更してください');}
  const ids=new Set<string>();
  for(const [pageIndex,{blocks:refs,photos,composition,...page}] of plan.entries()){
    if(!Array.isArray(refs)||!refs.length)throw new Error('空のページは保存できません');
    validatePage(page);
    if(!isProtectedPage(plan,pageIndex)&&!['feature','text'].includes(page.template??'text'))throw new Error('後続ページはfeatureまたはtextで指定してください');
    if(!page.id||! /^[a-z][a-z0-9-]*$/.test(page.id)||ids.has(page.id))throw new Error('ページIDが不正・重複しています');
    ids.add(page.id);
    const full={...page,blocks:refs,composition};
    if(composition){if(composition.templateId&&!templateCandidates(full,catalog).includes(composition.templateId))throw new Error('記事の内容に適合しないテンプレートです');
      const allowedSources=Object.values(catalog).flatMap(b=>b.photos.map(p=>p.src));
      if(composition.frames.some(f=>f.replacement&&!allowedSources.includes(f.replacement)))throw new Error('この記事にない画像は選択できません');
      if(!['feature','editorial','text'].includes(page.template??''))throw new Error('直接組版はfeature・editorial・textページで使用してください');validateComposition(composition,pagePhotos(full,catalog).length,pagePhotos(full,catalog).map(p=>p.src));}
    if(page.template==='feature'&&!composition&&!layoutOptions(full,catalog).includes(page.layout??''))throw new Error(`${page.id}: 写真の枚数・向きに適合しない型です`);
    if(photos){
      if(typeof photos!=='object'||Array.isArray(photos))throw new Error('写真設定が不正です');
      const sources=pagePhotos(full,catalog).map(p=>p.src);
      for(const [src,settings] of Object.entries(photos)){
        if(!sources.includes(src)||!settings||Object.keys(settings).some(k=>!['focal','fit','ratio'].includes(k)))throw new Error('ページにない写真は編集できません');
        validatePhoto({src,alt:'写真',...settings},page);
        if(settings.ratio&&settings.ratio!=='original'&&settings.fit!=='cover')throw new Error('比率変更にはトリミングを指定してください');
      }
    }
  }
  // The API also validates paragraph references against the parsed MDX before writing.
  remarkMagazinePlan(plan,{skipParagraphValidation:true})({type:'root',children:blocks});
  if(parsed.data.reader?.schemaVersion!==undefined&&parsed.data.reader.schemaVersion!==2)throw new Error('未対応のレイアウトスキーマです');
  const reader={...parsed.data.reader,pages:plan};
  const next=writeReader(source,reader);
  const after=matter(next);
  if(after.content!==parsed.content)throw new Error('本文の変更は許可されません');
  const beforeMeta={...parsed.data,reader:null},afterMeta={...after.data,reader:null};
  if(JSON.stringify(beforeMeta)!==JSON.stringify(afterMeta)||JSON.stringify(after.data.reader)!==JSON.stringify(reader))throw new Error('安全に設定を更新できません');
  return next;
}

export function articleBlockCatalog(source:string):BlockCatalog {
  const images=manifest as Record<string,{width:number;height:number}>;
  return Object.fromEntries([...matter(source).content.matchAll(/<ArticleBlock id="([^"]+)">([\s\S]*?)<\/ArticleBlock>/g)].map(([,id,body])=>[id,{table:/^\s*\|/m.test(body),code:/^\s*```/m.test(body),characters:body.replace(/<[^>]*>/g,'').length,photos:[...body.matchAll(/<Photo\s[^>]*?src="([^"]+)"[^>]*>/g)].map(([tag,src])=>({src,...(images[src]??{width:0,height:0}),...Object.fromEntries(['assetId','alt','caption','credit','kind'].flatMap(key=>{const m=tag.match(new RegExp(key+'="([^"]*)"'));return m?[[key,m[1]]]:[];}))}))}]));
}
