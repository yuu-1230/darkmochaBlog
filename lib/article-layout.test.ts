/** @jest-environment node */
import fs from 'node:fs';
import matter from 'gray-matter';
import {patchArticleLayout,articleBlockCatalog} from './article-layout';
import remarkMagazinePlan,{type PlannedPage} from './remark-magazine-plan';
import {initialComposition} from './page-composition';
import {pagePhotos} from './article-layout-options';
const source=fs.readFileSync('content/posts/ja/thai-travel.mdx','utf8');
const plan=()=>structuredClone(matter(source).data.reader.pages) as PlannedPage[];
it('allows both introduction pages to be edited while retaining their content and SEO title',()=>{
  const pages=plan();pages[0].placement='top-right';pages[0].focal='20% 60%';pages[0].title='初めての、タイ。';
  pages[1].composition=initialComposition(pagePhotos(pages[1],articleBlockCatalog(source)),3);
  const result=matter(patchArticleLayout(source,pages));
  expect(result.content).toBe(matter(source).content);
  expect(result.data.title).toBe(matter(source).data.title);
  expect(result.data.reader.pages.slice(0,2)).toEqual(pages.slice(0,2));
  pages[0].image='/images/unrelated.jpg';
  expect(()=>patchArticleLayout(source,pages)).toThrow('保持');
});
it('saves only layout while preserving body, metadata, and all block references',()=>{
  const pages=plan();pages[5].background='sand';
  const updated=matter(patchArticleLayout(source,pages)),original=matter(source);
  expect(updated.content).toBe(original.content);
  expect({...updated.data,reader:null}).toEqual({...original.data,reader:null});
  expect(updated.data.reader.pages).toEqual(pages);
  expect(pages.flatMap(p=>p.blocks)).toEqual(Object.keys(articleBlockCatalog(source)));
});
it('rejects omissions, duplicates, reordered content, and missing final content',()=>{
  for(const change of [(p:PlannedPage[])=>p[3].blocks.pop(),(p:PlannedPage[])=>p[3].blocks.push(p[3].blocks[0]),(p:PlannedPage[])=>p[3].blocks.reverse(),(p:PlannedPage[])=>p.pop()]){
    const pages=plan();change(pages);expect(()=>patchArticleLayout(source,pages)).toThrow();
  }
});
it('rejects incompatible templates and photos from outside the page',()=>{
  const pages=plan();delete pages[3].composition;pages[3].layout='pair';expect(()=>patchArticleLayout(source,pages)).toThrow('適合');
  const other=plan();other[3].photos={'/images/missing.jpg':{focal:'50% 50%'}};expect(()=>patchArticleLayout(source,other)).toThrow('写真');
});
it('keeps merged page anchors and reuses original AST content nodes',()=>{
  const a={type:'paragraph',value:'one'},b={type:'paragraph',value:'two'},c={type:'paragraph',value:'three'};
  const block=(id:string,node:typeof a)=>({type:'mdxJsxFlowElement',name:'ArticleBlock',attributes:[{type:'mdxJsxAttribute',name:'id',value:id}],children:[node]});
  const tree:Parameters<ReturnType<typeof remarkMagazinePlan>>[0]={type:'root',children:[block('a',a),block('b',b),block('c',c)]};
  remarkMagazinePlan([{id:'a',blocks:['a','b']},{id:'c',blocks:['c']}])(tree);
  const children=tree.children![0].children![0].children!.filter(n=>!n.attributes?.some(a=>['data-text-section','data-text-unit'].includes(a.name)));
  expect(children[0]).toBe(a);expect(children[2]).toBe(b);
  expect(children[1].attributes).toContainEqual({type:'mdxJsxAttribute',name:'id',value:'page-b'});
});
it('saves photo crop settings without rewriting the source photo or prose',()=>{
  const pages=plan(),src=articleBlockCatalog(source)[pages[3].blocks[0]].photos[0].src;
  pages[3].photos={[src]:{ratio:'portrait',fit:'cover',focal:'40% 70%'}};
  expect(matter(patchArticleLayout(source,pages)).content).toBe(matter(source).content);
});
