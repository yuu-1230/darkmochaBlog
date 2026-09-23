import {randomUUID} from 'node:crypto';
import matter from 'gray-matter';
import {serialize} from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import {migrateLayoutSource,parsedBlocks} from './layout-source';
import {writeReader} from './layout-reader-data';
import {layoutMarker,textUnits,type Node,type PlannedPage} from './remark-magazine-plan';
import {articleBlockCatalog,patchArticleLayout} from './article-layout';
import {templateCandidates,templateComposition} from './layout-registry';
import {pagePhotos} from './article-layout-options';
import manifest from '../content/image-manifest.json';

const images=manifest as Record<string,{width:number;height:number}>;
const attr=(node:Node,key:string)=>node.attributes?.find(a=>a.name===key)?.value;
const literal=(node:Node,key:string)=>typeof attr(node,key)==='string'?String(attr(node,key)):undefined;
const escape=(text:string)=>text.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const id=()=>`b-${randomUUID()}`;
export async function editionTree(source:string){
 let tree:Node={type:'root'};
 await serialize(source,{mdxOptions:{remarkPlugins:[remarkGfm,()=> (root:Node)=>{tree=structuredClone(root);} ]}});
 return tree;
}
const raw=(node:Node,source:string)=>source.slice(node.position!.start.offset,node.position!.end.offset);
function imageMarkup(node:Node,title:string){
 if(node.name==='ImageSlider'){
  const paths=literal(node,'images');if(paths===undefined)throw new Error('動的なImageSliderは手動で移行してください');
  return paths.split(',').map(s=>s.trim()).filter(Boolean).map((src,i)=>`<Photo src="${escape(src)}" alt="${escape(literal(node,'alt')??`${title} — ${i+1}`)}" fit="contain" kind="${src.includes('/Unity/')?'screenshot':'photo'}" />`).join('\n\n');
 }
 if(node.name==='MagazineFigure')return `<Photo ${['src','alt','caption','credit','focal'].flatMap(k=>literal(node,k)!==undefined?[`${k}="${escape(literal(node,k)!)}"`]:[]).join(' ')} fit="${literal(node,'fit')??'contain'}" />`;
 return undefined;
}
async function convertMedia(source:string,title:string){
 const tree=await editionTree(source),edits:{start:number;end:number;text:string}[]=[];
 const walk=(n:Node)=>{const text=imageMarkup(n,title);if(text!==undefined){edits.push({start:n.position!.start.offset,end:n.position!.end.offset,text});return;}n.children?.forEach(walk);};walk(tree);
 for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.text+source.slice(e.end);
 return source;
}
type Chunk={id:string;body:string;nodes:Node[];weight:number};
function textWeight(n:Node):number{
 if(n.name==='Photo')return 175;
 if(n.type==='code')return String(n.value??'').split('\n').reduce((h,line)=>h+Math.max(1,Math.ceil(line.length/70))*19,32);
 const value=n.value??n.children?.map(c=>c.value??'').join(' ')??'';
 const weighted=[...value].reduce((v,c)=>v+(/[\u3000-\u9fff]/.test(c)?1:.5),0);
 if(n.type==='heading')return 52;
 if(n.type==='table')return (n.children?.length??1)*42+20;
 if(n.type==='list')return (n.children??[]).reduce((sum,c)=>sum+Math.max(42,textWeight(c)),24);
 if(n.children?.length&&weighted===0)return n.children.reduce((sum,c)=>sum+textWeight(c),n.name==='Tip'?48:0);
 return Math.max(28,Math.ceil(weighted/36)*29)+16;
}
async function chunks(source:string,firstId?:string):Promise<Chunk[]>{
 const nodes=(await editionTree(source)).children??[],out:Chunk[]=[];
 for(let i=0;i<nodes.length;i++){
  const group=[nodes[i]];
  // A heading travels with at least its first following content node.
  while(i+1<nodes.length&&(group.at(-1)?.type==='heading'||group.at(-1)?.name==='span'))group.push(nodes[++i]);
  out.push({id:out.length===0&&firstId?firstId:id(),body:source.slice(group[0].position!.start.offset,group.at(-1)!.position!.end.offset),nodes:group,weight:group.reduce((s,n)=>s+textWeight(n),0)});
 }
 return out;
}
function paginate(chunks:Chunk[]){
 const pages:PlannedPage[]=[];let current:Chunk[]=[],height=0,photos=0;
 const flush=()=>{if(current.length)pages.push({id:current[0].id,template:'text',blocks:current.map(c=>c.id)});current=[];height=0;photos=0;};
 for(const chunk of chunks){const count=chunk.nodes.filter(n=>n.name==='Photo').length;
  if(current.length&&(height+chunk.weight>570||photos+count>2))flush();
  current.push(chunk);height+=chunk.weight;photos+=count;
 }
 flush();return pages;
}
/** Explicit migration only: never rerun pagination when an article is viewed. */
export async function migrateEdition(original:string){
 const parsed=matter(original);if(parsed.data.reader?.pages)return original;
 // Old draft scaffolds used HTML comments, which MDX cannot parse. Keep their text as comments.
 let content=parsed.content.replace(/<!--[\s\S]*?-->/g,c=>`{/*${c.slice(4,-3)}*/}`);
 content=await convertMedia(content,String(parsed.data.title));
 const root=await editionTree(content),all:Chunk[]=[],pages:PlannedPage[]=[];
 const legacy=(root.children??[]).some(n=>n.name==='Spread');
 if(legacy){
  let pending:Chunk[]=[];
  const flush=()=>{pages.push(...paginate(pending));pending=[];};
  for(const spread of root.children??[]){
   if(spread.name!=='Spread')throw new Error('Spread以外の旧本文を確認してください');
   for(const [i,page] of (spread.children??[]).entries()){
    if(page.name!=='Page')throw new Error('未対応の旧誌面です');
    const pageId=literal(page,'id')??`${literal(spread,'id')}-${i?'right':'left'}`;
    const source=raw(page,content),inside=source.slice(source.indexOf('>')+1,source.lastIndexOf('</Page>'));
    const alias=i===0?`<span id="${literal(spread,'id')}" />\n\n`:'';
    const template=literal(page,'template')??'text';
    if(template==='opening'||template==='editorial'){
     flush();const c={id:pageId,body:alias+inside.trim(),nodes:page.children??[],weight:0};all.push(c);
     const props=Object.fromEntries((page.attributes??[]).map(a=>[a.name,a.value]));
     pages.push({...props,id:pageId,blocks:[pageId]} as PlannedPage);
    }else{
     const part=await chunks(alias+inside,pageId);all.push(...part);pending.push(...part);
    }
   }
  }
  flush();
 }else{
  const hero=typeof parsed.data.image==='string'&&images[parsed.data.image]?`\n\n<Photo src="${escape(parsed.data.image)}" alt="" fit="contain" kind="${parsed.data.category==='Unity'?'screenshot':parsed.data.category==='Tech'?'diagram':'photo'}" />`:'';
  const openingBody='<ArticleTitle />'+hero;
  const opener:Chunk={id:'edition-title',body:openingBody,nodes:(await editionTree(openingBody)).children??[],weight:hero?390:160};
  const body=await chunks(content);all.push(opener,...body);
  // A short introduction and one photograph fit together without synthetic blank pages.
  if(content.length<550&&hero)pages.push({id:'edition-title',template:'text',blocks:all.map(c=>c.id)});
  else pages.push(...paginate(all));
 }
 const body=all.map(c=>`<ArticleBlock id="${c.id}">\n\n${c.body}\n\n</ArticleBlock>`).join('\n\n')+'\n';
 let next=writeReader(original.slice(0,original.length-parsed.content.length)+body,{...parsed.data.reader,mode:'magazine',pages});
 next=await migrateLayoutSource(next);
 const converted=matter(next),plan=converted.data.reader.pages as PlannedPage[],catalog=articleBlockCatalog(next),blocks=await parsedBlocks(converted.content);
 for(const p of plan){
  if(p.template==='opening'||p.template==='editorial')continue;
  const candidates=templateCandidates(p,catalog),photos=pagePhotos(p,catalog);
  const hasTitle=p.blocks.includes('edition-title');
  const chosen=hasTitle?'text':candidates[0]??'text';
  p.template='text';p.composition=templateComposition(chosen,photos,0);
  const units=p.blocks.flatMap(b=>{const block=blocks.find(n=>attr(n,'id')===b)!;return textUnits(b,block.children??[]);});
  p.composition.textUnit='paragraph';p.composition.textGroups=units.map(u=>({id:u.id,width:100,inset:0,offset:0}));
  // Associate each image with its following paragraph. The source order stays canonical.
  const stream=p.blocks.flatMap(b=>{const n=blocks.find(n=>attr(n,'id')===b)!;let pending='';return (n.children??[]).flatMap(c=>{const marker=layoutMarker(c);if(marker){pending=marker;return [];}return [{node:c,unit:pending}];});});
  let imageIndex=0;
  for(let i=0;i<stream.length;i++)if(stream[i].node.name==='Photo'){
   const f=p.composition.frames[imageIndex++];
   f.sourceId=literal(stream[i].node,'assetId');
   f.anchorId=stream.slice(i+1).find(s=>s.node.name!=='Photo'&&s.unit)?.unit??'end';delete f.anchor;
   if(hasTitle){f.width=48;f.side='right';}
  }
 }
 next=writeReader(next,converted.data.reader);
 patchArticleLayout(next,plan);
 return next;
}

/** Semantic audit excludes layout wrappers but keeps every prose node and media occurrence. */
export async function editionFingerprint(source:string){
 const p=matter(source),content=p.content.replace(/<!--[\s\S]*?-->/g,c=>`{/*${c.slice(4,-3)}*/}`);
 const tree=await editionTree(await convertMedia(content,String(p.data.title)));
 const clean=(n:Node):unknown[]=>{
  if(layoutMarker(n)||n.name==='ArticleTitle'||n.name==='span'||n.type==='mdxFlowExpression'&&String(n.value).trim().startsWith('/*'))return [];
  if(n.name==='ArticleBlock'&&literal(n,'id')==='edition-title')return [];
  if(['root','Spread','Page','ArticleBlock'].includes(n.name??n.type))return (n.children??[]).flatMap(clean);
  const object=JSON.parse(JSON.stringify(n,(k,v)=>['position','data'].includes(k)?undefined:v)) as Node;
  if(object.name==='Photo')object.attributes=object.attributes?.filter(a=>a.name!=='assetId');
  return [object];
 };
 return JSON.stringify(clean(tree));
}

/** Rebalance a newly migrated edition using actual image ratios; preserve all IDs. */
export async function balanceEdition(source:string){
 const parsed=matter(source),blocks=await parsedBlocks(parsed.content),original=parsed.data.reader.pages as PlannedPage[];
 const catalog=articleBlockCatalog(source);
 const protectedPages=original.filter(p=>p.template==='opening'||p.template==='editorial');
 const protectedBlocks=new Set(protectedPages.flatMap(p=>p.blocks));
 const usable=blocks.filter(b=>!protectedBlocks.has(String(attr(b,'id'))));
 const estimate=(ids:string[])=>{
  const nodes=ids.flatMap(id=>blocks.find(b=>attr(b,'id')===id)?.children??[]).filter(n=>!layoutMarker(n)&&n.name!=='span');
  const photos=nodes.filter(n=>n.name==='Photo').map(n=>images[literal(n,'src')??'']??{width:4,height:3});
  const title=nodes.some(n=>n.name==='ArticleTitle');
  const text=nodes.filter(n=>n.name!=='Photo'&&n.name!=='ArticleTitle').reduce((sum,n)=>sum+textWeight(n),0);
  if(title)return 180+Math.max(photos.length?580*.48*photos[0].height/photos[0].width:0,text*(photos.length?1.35:1));
  if(photos.length===1&&photos[0].height>photos[0].width)return Math.max(580*.52*photos[0].height/photos[0].width,text*1.7);
  return text+(photos.length?Math.max(...photos.map(p=>580*(photos.length===1?1:.44)*p.height/p.width)):0);
 };
 const pages=[...protectedPages];let current:string[]=[];
 const flush=()=>{if(current.length)pages.push({id:current[0],template:'text',blocks:current});current=[];};
 for(const b of usable){const id=String(attr(b,'id')),candidate=[...current,id];const count=candidate.flatMap(x=>catalog[x]?.photos??[]).length;
  if(current.length&&(estimate(candidate)>620||count>(candidate.includes('edition-title')?1:2)))flush();current.push(id);
 }
 flush();
 const result=writeReader(source,{...parsed.data.reader,pages});
 return applyEditionCompositions(result);
}

export async function applyEditionCompositions(source:string,onlyIds?:Set<string>){
 const parsed=matter(source),plan=parsed.data.reader.pages as PlannedPage[],catalog=articleBlockCatalog(source),blocks=await parsedBlocks(parsed.content);
 for(const p of plan){
  if(p.template==='opening'||p.template==='editorial'||onlyIds&&!onlyIds.has(p.id))continue;
  const photos=pagePhotos(p,catalog),hasTitle=p.blocks.includes('edition-title');
  const chosen=hasTitle?'text':templateCandidates(p,catalog)[0]??'text';
  p.composition=templateComposition(chosen,photos,0);
  const units=p.blocks.flatMap(id=>textUnits(id,blocks.find(n=>attr(n,'id')===id)?.children??[]));
  p.composition.textUnit='paragraph';p.composition.textGroups=units.map(u=>({id:u.id,width:100,inset:0,offset:0}));
  const stream=p.blocks.flatMap(id=>{let pending='';return (blocks.find(n=>attr(n,'id')===id)?.children??[]).flatMap(node=>{const marker=layoutMarker(node);if(marker){pending=marker;return [];}return [{node,unit:pending}];});});
  let imageIndex=0;
  for(let i=0;i<stream.length;i++)if(stream[i].node.name==='Photo'){
   const f=p.composition.frames[imageIndex++];f.sourceId=literal(stream[i].node,'assetId');
   f.anchorId=stream.slice(i+1).find(s=>s.node.name!=='Photo'&&s.unit)?.unit??'end';delete f.anchor;
   if(hasTitle){f.width=48;f.side='right';}
  }
 }
 const next=writeReader(source,parsed.data.reader);patchArticleLayout(next,plan);return next;
}
