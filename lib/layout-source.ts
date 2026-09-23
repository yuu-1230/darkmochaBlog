import {randomUUID} from 'node:crypto';
import matter from 'gray-matter';
import {serialize} from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMagazinePlan,{layoutMarker,textUnits,type Node,type PlannedPage} from './remark-magazine-plan';

export {writeReader} from './layout-reader-data';
import {writeReader} from './layout-reader-data';
export async function validateLayoutSource(source:string,plan:PlannedPage[]){await serialize(matter(source).content,{mdxOptions:{remarkPlugins:[remarkGfm,[remarkMagazinePlan,plan]]}});}
export async function parsedBlocks(content:string){
  let tree:Node={type:'root'};
  await serialize(content,{mdxOptions:{remarkPlugins:[remarkGfm,()=> (root:Node)=>{tree=structuredClone(root);}]}});
  return tree.children?.filter(n=>n.name==='ArticleBlock')??[];
}
/** One-time migration adds stable metadata comments, never rewrites article prose. */
export async function migrateLayoutSource(source:string){
  const parsed=matter(source),reader=parsed.data.reader;
  if(!reader?.pages)return source;
  if(reader.schemaVersion!==undefined&&reader.schemaVersion!==2)throw new Error('未対応のレイアウトスキーマです');
  const blocks=await parsedBlocks(parsed.content),edits:{offset:number;text:string}[]=[],mapping=new Map<string,string>(),assetIds=new Map<string,string>();
  for(const block of blocks){
    const id=String(block.attributes?.find(a=>a.name==='id')?.value),nodes=block.children??[];
    const old=textUnits(id,nodes);let index=0,pending=false;
    for(const node of nodes){
      if(layoutMarker(node)){pending=true;continue;}
      if(node.name==='Photo'){const src=String(node.attributes?.find(a=>a.name==='src')?.value);const existing=node.attributes?.find(a=>a.name==='assetId')?.value as string|undefined;const assetId=existing??assetIds.get(src)??`asset-${randomUUID()}`;assetIds.set(src,assetId);if(!existing)edits.push({offset:node.position!.start.offset+6,text:` assetId="${assetId}"`});continue;}
      const oldId=old[index++].id;
      if(pending){mapping.set(oldId,oldId);pending=false;continue;}
      if(node.position?.start.offset===undefined)throw new Error('本文位置を特定できません');
      const stable=`t-${randomUUID()}`;mapping.set(oldId,stable);
      edits.push({offset:node.position.start.offset,text:`{/* @layout-id ${stable} */}\n\n`});
    }
  }
  let content=parsed.content;
  for(const edit of edits.sort((a,b)=>b.offset-a.offset))content=content.slice(0,edit.offset)+edit.text+content.slice(edit.offset);
  const pages=structuredClone(reader.pages) as PlannedPage[];
  for(const page of pages){
    const c=page.composition;if(!c)continue;
    const units=page.blocks.flatMap(id=>{const b=blocks.find(b=>b.attributes?.find(a=>a.name==='id')?.value===id)!;return textUnits(id,b.children??[]).map((u,i)=>({...u,id:mapping.get(u.id)??u.id,size:1+(i===0&&id!==page.id?1:0)}));});
    if(c.textUnit==='paragraph'){
      const groups=c.textGroups?.map(g=>({...g,id:mapping.get(g.id)??g.id}));
      c.textGroups=units.map(u=>groups?.find(g=>g.id===u.id)??{id:u.id,width:100,inset:0,offset:0});
    }else if(c.textGroups)c.textGroups=page.blocks.map(id=>c.textGroups!.find(g=>g.id===id)!);
    for(const f of c.frames){
      f.sourceId=assetIds.get(f.source);if(f.replacement)f.replacementId=assetIds.get(f.replacement);else delete f.replacementId;
      if(!f.anchorId){let offset=0;f.anchorId='end';for(const u of units){if((f.anchor??0)<offset+u.size){f.anchorId=u.id;break;}offset+=u.size;}}
      else f.anchorId=mapping.get(f.anchorId)??f.anchorId;
      delete f.anchor;
    }
  }
  const nextReader={...reader,schemaVersion:2,articleId:reader.articleId??`article-${randomUUID()}`,pages};
  const bodyStart=source.length-parsed.content.length;
  const next=writeReader(source.slice(0,bodyStart)+content,nextReader);
  // Check reference coverage against the actual parser, before touching disk.
  await serialize(content,{mdxOptions:{remarkPlugins:[remarkGfm,[remarkMagazinePlan,pages]]}});
  return next;
}
