'use server';
import {headers} from 'next/headers';
import {compileMDX} from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import {allowCoverEditor,readCoverFile} from '@/lib/cover-editor';
import {patchArticleLayout} from '@/lib/article-layout';
import {migrateLayoutSource,validateLayoutSource} from '@/lib/layout-source';
import type {PlannedPage} from '@/lib/remark-magazine-plan';
import {documentMdxOptions} from '@/components/mdx-document';
import {mdxComponents} from '@/components/mdx';
import {magazineMdxComponents} from '@/components/magazine/parts';
import type {Frontmatter} from '@/lib/mdx';
/** Read-only preview: same parser/components as the article; no draft file or body copy. */
export async function previewLayout(locale:string,slug:string,revision:string,plan:PlannedPage[]){
 const h=await headers(),host=h.get('host')??'';
 if(!allowCoverEditor(new Request(`http://${host||'invalid'}/`,{method:'POST',headers:{host,origin:h.get('origin')??'','content-type':'application/json'}})))throw new Error('編集プレビューは無効です');
 if(JSON.stringify(plan).length>50000)throw new Error('設定が大きすぎます');
 const file=await readCoverFile(locale,slug);if(file.revision!==revision)throw new Error('別の編集が保存されています。再読込してください');
 const patched=patchArticleLayout(file.source,plan);await validateLayoutSource(patched,matter(patched).data.reader.pages);
 const next=matter(await migrateLayoutSource(patched));
 const result=await compileMDX({source:next.content,components:{...mdxComponents,...magazineMdxComponents(next.data as Frontmatter,locale)},options:{mdxOptions:documentMdxOptions(next.data.reader.pages)}});
 return result.content;
}
