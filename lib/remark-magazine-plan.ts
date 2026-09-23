import {createHash} from 'node:crypto';
import {validateTextReferences,validateComposition,type PageComposition} from './page-composition';
import type { PageSettings, PhotoSettings } from './magazine';
export type PlannedPage = Omit<PageSettings,"composition"> & {id:string;composition?:PageComposition;blocks:string[];photos?:Record<string,Pick<PhotoSettings,"focal"|"fit"|"ratio">>};
export type Node = {type:string;name?:string;value?:string;attributes?:{type:string;name:string;value:unknown}[];children?:Node[];position?:{start:{offset:number};end:{offset:number}}};
const element=(name:string,values:Record<string,unknown>,children:Node[]=[]):Node=>({type:'mdxJsxFlowElement',name,attributes:Object.entries(values).filter(([,value])=>value!==undefined).map(([name,value])=>({type:'mdxJsxAttribute',name,value:typeof value==='number'?{type:'mdxJsxAttributeValueExpression',value:String(value),data:{estree:{type:'Program',sourceType:'module',body:[{type:'ExpressionStatement',expression:{type:'Literal',value}}]}}}:value})),children});
/** Compose the single MDX source without copying content into layout data. */
export default function remarkMagazinePlan(plan?:PlannedPage[], options?:{skipParagraphValidation?:boolean}) {
  return (tree:Node)=>{
    if(!plan)return;
    const blocks=(tree.children??[]).filter(n=>n.name==='ArticleBlock');
    if(blocks.length!==(tree.children??[]).length)throw new Error('配置付きの記事はArticleBlockだけで構成してください');
    const ids=blocks.map(n=>String(n.attributes?.find(a=>a.name==='id')?.value??''));
    if(new Set(ids).size!==ids.length || ids.some(id=>! /^[a-z][a-z0-9-]*$/.test(id)))throw new Error('本文ブロックIDが不正・重複しています');
    for(const page of plan){if(page.id && ids.includes(page.id)&&page.id!==page.blocks[0])throw new Error('ページIDと本文アンカーが衝突します');}
    const unitIds=blocks.flatMap((b,i)=>textUnits(ids[i],b.children??[]).map(u=>u.id));
    if(new Set(unitIds).size!==unitIds.length)throw new Error('本文要素IDが重複しています');
    const refs=plan.flatMap(p=>p.blocks);
    if(JSON.stringify(refs)!==JSON.stringify(ids))throw new Error('全ブロックを本文順に一度ずつ配置してください');
    const imageNodes=blocks.flatMap(b=>(b.children??[]).filter(n=>n.name==='Photo'));
    const assetPaths=new Map(imageNodes.map(n=>[n.attributes?.find(a=>a.name==='assetId')?.value,n.attributes?.find(a=>a.name==='src')?.value]));
    plan=structuredClone(plan);for(const p of plan)for(const f of p.composition?.frames??[]){if(f.sourceId&&assetPaths.has(f.sourceId))f.source=String(assetPaths.get(f.sourceId));if(f.replacementId&&assetPaths.has(f.replacementId))f.replacement=String(assetPaths.get(f.replacementId));}
    // A final single page is allowed; never synthesize a blank content page.
    for(const page of plan){
      if(page.composition){
        if(!['feature','editorial','text'].includes(page.template??''))throw new Error('直接組版はfeature・editorial・textページで使用してください');
        const nodes=page.blocks.flatMap(id=>blocks[ids.indexOf(id)].children??[]);
        const sources=nodes.filter(n=>n.name==='Photo').map(n=>String(n.attributes?.find(a=>a.name==='src')?.value??''));
        validateComposition(page.composition,sources.length,sources);
        if(!options?.skipParagraphValidation){const unitIds=page.blocks.flatMap(id=>textUnits(id,blocks[ids.indexOf(id)].children??[]).map(u=>u.id));if(page.composition.frames.some(f=>f.anchorId&&f.anchorId!=='end'&&!unitIds.includes(f.anchorId)))throw new Error('写真の配置先の段落が見つかりません');}
        if(page.composition.textUnit==='paragraph'){
          if(!options?.skipParagraphValidation)validateTextReferences(page.composition,page.blocks.flatMap(id=>textUnits(id,blocks[ids.indexOf(id)].children??[]).map(u=>u.id)));
        }else validateTextReferences(page.composition,page.blocks);
      }
    }
    const assets=new Map(blocks.flatMap(b=>(b.children??[]).filter(n=>n.name==='Photo')).map(n=>[String(n.attributes?.find(a=>a.name==='src')?.value),n]));
    const pages=plan.map(({blocks:refs,photos,composition,...settings})=>element('Page',{...settings,...(composition?{composition:JSON.stringify(composition)}:{})},refs.flatMap(id=>{
      const source=blocks[ids.indexOf(id)];
      if(!['feature','editorial','text'].includes(settings.template??'text'))return [...(settings.id===id?[]:[element('span',{id:`page-${id}`})]),...(source.children??[]).map(node=>applyPhotos(node,photos,composition,assets))];
      const units=textUnits(id,source.children??[]);let index=0;
      const result:Node[]=[element('span',{'data-text-section':id})];
      for(const node of (source.children??[]).filter(n=>!layoutMarker(n))){
        if(node.name!=='Photo'){
          const unit=units[index++];
          result.push(element('span',{'data-text-unit':unit.id,'data-text-kind':unit.kind}));
          if(index===1&&settings.id!==id)result.push(element('span',{id:`page-${id}`}));
        }
        result.push(applyPhotos(node,photos,composition,assets));
      }
      if(!index){result.push(element('span',{'data-text-unit':units[0].id,'data-text-kind':'other'}));if(settings.id!==id)result.push(element('span',{id:`page-${id}`}));}
      return result;
    })));
    tree.children=[];
    for(let i=0;i<pages.length;i+=2)tree.children.push(element('Spread',{id:`edition-${i/2+1}`},pages.slice(i,i+2)));
  };
}

function applyPhotos(node:Node,photos:PlannedPage['photos'],composition?:PageComposition,assets?:Map<string,Node>):Node {
  const source=node.attributes?.find(a=>a.name==='src')?.value;
  const replacement=composition?.frames.find(f=>f.source===source)?.replacement;
  if(node.name==='Photo'&&replacement){const asset=assets?.get(replacement);if(!asset)throw new Error('画像の参照が見つかりません');node={...node,attributes:[...(node.attributes??[]).filter(a=>!['assetId','src','alt','caption','credit','kind'].includes(a.name)),...(asset.attributes??[]).filter(a=>['assetId','src','alt','caption','credit','kind'].includes(a.name))]};}
  if(!photos)return node;
  const src=node.attributes?.find(a=>a.name==='src')?.value;
  const override=node.name==='Photo'&&typeof src==='string'?photos[src]:undefined;
  return {...node,attributes:override?[...(node.attributes??[]).filter(a=>!(a.name in override)),...(element('Photo',override).attributes??[])]:node.attributes,children:node.children?.map(child=>applyPhotos(child,photos,composition,assets))};
}

// Content-derived references survive neighbouring paragraph insertions. Identical
// paragraphs receive occurrence suffixes; changing prose requires reviewing its layout.
export function textUnits(blockId:string,nodes:Node[]){
  const counts=new Map<string,number>();
  let pending:string|undefined;
  const references=new Map<Node,string>();
  for(const n of nodes){const marker=layoutMarker(n);if(marker)pending=marker;else if(n.name!=='Photo'&&pending){references.set(n,pending);pending=undefined;}}
  const copy=nodes.filter(n=>n.name!=='Photo'&&!layoutMarker(n));
  return (copy.length?copy:[{type:'empty'}]).map(node=>{
    const hash=createHash('sha256').update(JSON.stringify(node,(key,value)=>['position','data'].includes(key)?undefined:value)).digest('hex').slice(0,16);
    const occurrence=(counts.get(hash)??0)+1;counts.set(hash,occurrence);
    return {id:references.get(node)??`${blockId}:${hash}:${occurrence}`,kind:node.type==='paragraph'||node.name==='p'?'paragraph':node.type==='heading'?'heading':'other'};
  });
}

export function layoutMarker(node:Node){return node.type==='mdxFlowExpression'?node.value?.match(/^\s*\/\*\s*@layout-id\s+(t-[a-f0-9-]+)\s*\*\/\s*$/)?.[1]:undefined;}
