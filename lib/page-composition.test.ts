/** @jest-environment node */
import fs from 'node:fs';
import matter from 'gray-matter';
import {initialComposition,validateComposition,parseComposition,moveTextGroup} from './page-composition';
import {articleBlockCatalog,patchArticleLayout} from './article-layout';
import {pagePhotos} from './article-layout-options';
import remarkMagazinePlan,{textUnits,type PlannedPage} from './remark-magazine-plan';

it('rejects nonfinite dimensions, unknown fields, invalid anchors, and missing photo frames',()=>{
  const composition=initialComposition([{src:'/photo.jpg',width:800,height:1200}],4);
  expect(parseComposition(JSON.stringify(composition))).toEqual(composition);
  for(const fields of [{ratio:0},{width:Infinity},{inset:80},{anchor:1.5},{offset:501},{html:'unsafe'}]){
    const invalid=structuredClone(composition);Object.assign(invalid.frames[0],fields);
    expect(()=>validateComposition(invalid,1)).toThrow();
  }
  expect(()=>validateComposition(composition,2)).toThrow();
  expect(()=>validateComposition(composition,1,['/changed.jpg'])).toThrow('参照');
  expect(()=>validateComposition(initialComposition([{src:'/photo.jpg',width:0,height:0}],0),1)).not.toThrow();
});
it('round trips composition while keeping all MDX prose, photo sources, and other metadata untouched',()=>{
  const source=fs.readFileSync('content/posts/ja/thai-travel.mdx','utf8');
  const original=matter(source),pages=structuredClone(original.data.reader.pages) as PlannedPage[];
  pages[4].composition=initialComposition(pagePhotos(pages[4],articleBlockCatalog(source)),9);
  pages[4].composition.frames[0].ratio=1.5;
  const result=matter(patchArticleLayout(source,pages));
  expect(result.content).toBe(original.content);
  expect({...result.data,reader:null}).toEqual({...original.data,reader:null});
  expect(result.data.reader.pages).toEqual(pages);
  pages[4].composition.frames=[];
  expect(()=>patchArticleLayout(source,pages)).toThrow();
});
it('serializes composition into an MDX string and fails compilation if photos would be omitted',()=>{
  const photo={type:'mdxJsxFlowElement',name:'Photo',attributes:[{type:'mdxJsxAttribute',name:'src',value:'/photo.jpg'}]};
  const paragraph={type:'paragraph',value:'original prose'};
  const block=(id:string,children:typeof paragraph[])=>({type:'mdxJsxFlowElement',name:'ArticleBlock',attributes:[{type:'mdxJsxAttribute',name:'id',value:id}],children});
  const tree={type:'root',children:[block('a',[paragraph]),{...block('b',[]),children:[photo]}]};
  const composition=initialComposition([{src:'/photo.jpg',width:800,height:1200}],0);
  const plan:PlannedPage[]=[{id:'a',blocks:['a']},{id:'b',template:'feature',blocks:['b'],composition}];
  const input=structuredClone(tree);
  remarkMagazinePlan(plan)(input);
  const output=input as Parameters<ReturnType<typeof remarkMagazinePlan>>[0];
  expect(output.children![0].children![1].attributes).toContainEqual({type:'mdxJsxAttribute',name:'composition',value:JSON.stringify(composition)});
  plan[1].composition={textWidth:100,frames:[]};
  expect(()=>remarkMagazinePlan(plan)(structuredClone(tree))).toThrow();
});

it('rejects reordered, lost or duplicated text groups and preserves the source order',()=>{
  const source=fs.readFileSync('content/posts/ja/thai-travel.mdx','utf8');
  const original=matter(source),pages=structuredClone(original.data.reader.pages) as PlannedPage[];
  const page=pages[4];
  const groups=page.blocks.map(id=>({id,width:80,inset:10,offset:12}));
  page.composition={...initialComposition(pagePhotos(page,articleBlockCatalog(source)),9),textGroups:moveTextGroup(groups,groups[0].id,groups[1].id)};
  expect(groups.map(g=>g.id)).toEqual(page.blocks);
  expect(()=>patchArticleLayout(source,pages)).toThrow();
  page.composition.textGroups=groups;
  const result=matter(patchArticleLayout(source,pages));
  expect(result.content).toBe(original.content);
  for(const invalid of [groups.slice(1),[groups[0],groups[0]],[groups[0],{...groups[1],id:'unknown'}]]){
    page.composition.textGroups=invalid;
    expect(()=>patchArticleLayout(source,pages)).toThrow();
  }
});

it('validates every paragraph reference and keeps IDs stable across neighbouring insertions',()=>{
  const block=(children:Parameters<typeof textUnits>[1])=>({type:'mdxJsxFlowElement',name:'ArticleBlock',attributes:[{type:'mdxJsxAttribute',name:'id',value:'body'}],children});
  const heading={type:'heading',depth:2,children:[{type:'text',value:'Title'}]};
  const first={type:'paragraph',children:[{type:'text',value:'First'}]},second={type:'paragraph',children:[{type:'text',value:'Second'}]};
  const ids=textUnits('body',[heading,first,second]);
  expect(textUnits('body',[{type:'paragraph',children:[{type:'text',value:'New'}]},heading,first,second]).slice(1)).toEqual(ids);
  expect(new Set(textUnits('body',[first,first]).map(u=>u.id)).size).toBe(2);
  const composition={textWidth:100,frames:[],textUnit:'paragraph' as const,textGroups:ids.map(u=>({id:u.id,width:100,inset:0,offset:0}))};
  const plan:PlannedPage[]=[{id:'body',template:'text',blocks:['body'],composition},{id:'end',template:'text',blocks:['end']}];
  const tree=()=>({type:'root',children:[block([heading,first,second]),{...block([]),attributes:[{type:'mdxJsxAttribute',name:'id',value:'end'}]}]});
  expect(()=>remarkMagazinePlan(plan)(tree())).not.toThrow();
  composition.textGroups.pop();
  expect(()=>remarkMagazinePlan(plan)(tree())).toThrow('一度ずつ');
});

it('round trips optional text sizing, lower whitespace and image crop zoom with strict bounds',()=>{
  const c=initialComposition([{src:'/photo.jpg',width:800,height:1200}],1);
  c.frames[0].zoom=2.35;
  c.textUnit='paragraph';c.textGroups=[{id:'paragraph-a',width:74.5,inset:0,offset:0,bottomSpace:63,fontSize:22}];
  expect(parseComposition(JSON.stringify(c))).toEqual(c);
  for(const fontSize of [12,14,16,18,22,28,36,48])expect(()=>validateComposition({...c,textGroups:[{...c.textGroups![0],fontSize}]})).not.toThrow();
  for(const patch of [{fontSize:15},{fontSize:NaN},{bottomSpace:-1},{bottomSpace:501}])expect(()=>validateComposition({...c,textGroups:[{...c.textGroups![0],...patch}]})).toThrow();
  for(const zoom of [0,4.01,Infinity])expect(()=>validateComposition({...c,frames:[{...c.frames[0],zoom}]})).toThrow();
});

it('preserves independent free photo placement and explicit overlap permission',()=>{
 const c=initialComposition([{src:'/photo.jpg',width:800,height:1200}],1);
 c.allowOverlap=true;Object.assign(c.frames[0],{position:'free',x:23.4,y:12.5});
 expect(parseComposition(JSON.stringify(c))).toEqual(c);
 for(const patch of [{position:'fixed'},{x:-1},{y:101},{x:NaN}])expect(()=>validateComposition({...c,frames:[{...c.frames[0],...patch}]})).toThrow();
 expect(()=>validateComposition({...c,allowOverlap:'yes'})).toThrow();
});

it('round trips independent text coordinates without changing its typography or spacing',()=>{
 const c=initialComposition([],1);c.textUnit='paragraph';
 c.textGroups=[{id:'text-a',width:60,inset:0,offset:0,fontSize:18,bottomSpace:30,position:'free',x:12.5,y:42}];
 expect(parseComposition(JSON.stringify(c))).toEqual(c);
 for(const patch of [{x:-1},{y:101},{position:'fixed'},{y:Infinity}])expect(()=>validateComposition({...c,textGroups:[{...c.textGroups![0],...patch}]})).toThrow();
});

it('round trips photo masks and rejects invalid radius values',()=>{
 const c=initialComposition([{src:'/photo.jpg',width:800,height:1200}],1);
 for(const shape of ['rect','circle','rounded'] as const){
  Object.assign(c.frames[0],{shape,cornerRadius:24});
  expect(parseComposition(JSON.stringify(c))).toEqual(c);
 }
 for(const patch of [{shape:'oval'},{cornerRadius:-1},{cornerRadius:101},{cornerRadius:Infinity}])expect(()=>validateComposition({...c,frames:[{...c.frames[0],...patch}]})).toThrow();
});

it('saves masks in MDX layout data without rewriting article content',()=>{
 const source=fs.readFileSync('content/posts/ja/thai-travel.mdx','utf8');
 const original=matter(source),pages=structuredClone(original.data.reader.pages) as PlannedPage[];
 const page=pages.find(p=>p.composition?.frames.length)!;
 Object.assign(page.composition!.frames[0],{shape:'rounded',cornerRadius:32});
 const saved=matter(patchArticleLayout(source,pages));
 expect(saved.content).toBe(original.content);
 expect(saved.data.reader.pages.find((p:PlannedPage)=>p.id===page.id).composition.frames[0]).toMatchObject({shape:'rounded',cornerRadius:32});
});
