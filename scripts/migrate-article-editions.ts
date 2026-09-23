import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {editionFingerprint,migrateEdition} from '../lib/edition-migration';
import {validateLayoutSource} from '../lib/layout-source';
import {serialize} from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMagazinePlan from '../lib/remark-magazine-plan';
import remarkMagazine from '../lib/remark-magazine';

(async()=>{
 const report=[];
 for(const locale of ['ja','en'])for(const name of await fs.readdir(`content/posts/${locale}`)){
  if(!name.endsWith('.mdx'))continue;
  const file=path.join('content/posts',locale,name),source=await fs.readFile(file,'utf8'),before=matter(source);
  const next=await migrateEdition(source),after=matter(next);
  assert.equal(await editionFingerprint(next),await editionFingerprint(source),`${file}: prose, links or media changed`);
  const {reader:oldReader,...oldMeta}=before.data,{reader:newReader,...newMeta}=after.data;
  void oldReader;void newReader;assert.deepEqual(newMeta,oldMeta,`${file}: metadata changed`);
  await validateLayoutSource(next,after.data.reader.pages);
  await serialize(after.content,{mdxOptions:{remarkPlugins:[remarkGfm,[remarkMagazinePlan,after.data.reader.pages],remarkMagazine]}});
  if(next!==source){
   await fs.mkdir('.local-review/all-editions',{recursive:true});
   await fs.writeFile(`.local-review/all-editions/${locale}-${name}`,source,{flag:'wx'});
   const temp=file+'.edition-tmp';await fs.writeFile(temp,next);await fs.rename(temp,file);
  }
  const entry={locale,slug:name.slice(0,-4),draft:!!after.data.draft,pages:after.data.reader.pages.length,migrated:next!==source};report.push(entry);console.log(entry);
 }
 await fs.writeFile('.local-review/all-editions/report.json',JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
