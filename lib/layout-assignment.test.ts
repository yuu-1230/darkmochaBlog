/** @jest-environment node */
import fs from 'node:fs';
import matter from 'gray-matter';
import {assignPages} from './layout-assignment';
import {patchArticleLayout,articleBlockCatalog} from './article-layout';
import {templateCandidates} from './layout-registry';
import type {PlannedPage} from './remark-magazine-plan';
const source=fs.readFileSync('content/posts/ja/thai-travel.mdx','utf8'),catalog=articleBlockCatalog(source);
const plan=()=>structuredClone(matter(source).data.reader.pages) as PlannedPage[];
it('merges and splits boundaries without changing content, sequence or source anchors',()=>{
 const before=plan(),merged=assignPages(before,3,{type:'merge'},catalog);
 expect(merged.length).toBe(before.length-1);expect(merged.flatMap(p=>p.blocks)).toEqual(before.flatMap(p=>p.blocks));
 expect(matter(patchArticleLayout(source,merged)).content).toBe(matter(source).content);
 const split=assignPages(merged,3,{type:'split',at:before[3].blocks.length,newId:'sheet-example'},catalog);
 expect(split.length).toBe(before.length);expect(split.flatMap(p=>p.blocks)).toEqual(before.flatMap(p=>p.blocks));
 expect(()=>patchArticleLayout(source,split)).not.toThrow();
});
it('preserves fixed page assignments, rejecting silent changes',()=>{
 const p=plan();p[3].composition={...p[3].composition!,fixed:true};
 expect(()=>assignPages(p,3,{type:'merge'},catalog)).toThrow('固定');
 const locked=patchArticleLayout(source,p);const altered=structuredClone(p);altered[3].blocks.push(altered[4].blocks.shift()!);
 expect(()=>patchArticleLayout(locked,altered)).toThrow('固定');
});
it('suggests candidates for portrait, landscape, short photo, no photo and technical content',()=>{
 const p:PlannedPage={id:'page',blocks:['body']};
 expect(templateCandidates(p,{body:{table:false,photos:[]}})).toEqual(['text']);
 expect(templateCandidates(p,{body:{table:false,photos:[{src:'/a',width:800,height:1200}]}})).toContain('portrait');
 expect(templateCandidates(p,{body:{table:false,photos:[{src:'/a',width:1800,height:1200}]}})).toContain('landscape');
 expect(templateCandidates(p,{body:{table:false,code:true,photos:[]}})[0]).toBe('data');
});
it('edits short articles without requiring artificial opening or closing pages',()=>{
 const source='---\ntitle: Short\nreader: {mode: magazine, pages: [{id: story, template: text, blocks: [a, b]}]}\n---\n\n<ArticleBlock id="a">\n\nShort paragraph.\n\n</ArticleBlock>\n\n<ArticleBlock id="b">\n\nAnother paragraph.\n\n</ArticleBlock>\n';
 const p=matter(source).data.reader.pages;
 const split=assignPages(p,0,{type:'split',at:1,newId:'continuation'},articleBlockCatalog(source));
 expect(split).toHaveLength(2);expect(()=>patchArticleLayout(source,split)).not.toThrow();
 const merged=assignPages(split,0,{type:'merge'},articleBlockCatalog(source));
 expect(merged).toHaveLength(1);expect(()=>patchArticleLayout(source,merged)).not.toThrow();
});
