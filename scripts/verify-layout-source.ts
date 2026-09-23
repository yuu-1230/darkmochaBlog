import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {serialize} from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMagazine from '../lib/remark-magazine';
import remarkMagazinePlan,{textUnits} from '../lib/remark-magazine-plan';
import {migrateLayoutSource,parsedBlocks} from '../lib/layout-source';
(async()=>{
 const path='content/posts/ja/thai-travel.mdx',source=await fs.readFile(path,'utf8');
 assert.equal(await migrateLayoutSource(source),source,'Migration must be idempotent');
 const units=async(s:string)=>(await parsedBlocks(matter(s).content)).flatMap(b=>textUnits(String(b.attributes?.find(a=>a.name==='id')?.value),b.children??[]).map(u=>u.id));
 const revised=source.replace('旅費は合計146,000円。','旅費は合計146,000円でした。');
 assert.deepEqual(await units(revised),await units(source),'Prose edits must preserve IDs');
 const inserted=source.replace('旅費は合計146,000円。','新しい段落。\n\n旅費は合計146,000円。');
 const upgraded=await migrateLayoutSource(inserted);assert.equal((await units(upgraded)).length,(await units(source)).length+1);
 const before=await fs.readFile('.local-review/id-migration/ja-thai-travel.mdx','utf8');
 const prose=(s:string)=>matter(s).content.replace(/\{\/\*\s*@layout-id\s+t-[a-f0-9-]+\s*\*\/\}\s*/g,'').replace(/ assetId="[^"]+"/g,'');
 assert.equal(prose(source),prose(before),'Migration may add identity metadata only');
 for(const locale of ['ja','en'])for(const slug of ['thai-travel','2026-07-25-unity-reflection','2026-06-11-ml-study','graduation-bucket-list','my-first-article']){
  const file=`content/posts/${locale}/${slug}.mdx`;if(locale==='en'&&slug==='my-first-article')continue;const p=matter(await fs.readFile(file,'utf8'));
  await serialize(p.content,{mdxOptions:{remarkPlugins:[remarkGfm,[remarkMagazinePlan,p.data.reader?.pages],remarkMagazine]}});
  console.log(`compiled ${locale}/${slug}`);
 }
 console.log('Stable IDs, preserved prose, new paragraphs and JA/EN compilation: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
