import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {serialize} from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMagazinePlan from '../lib/remark-magazine-plan';
import remarkMagazine from '../lib/remark-magazine';
import {editionFingerprint} from '../lib/edition-migration';
import {migrateLayoutSource,validateLayoutSource} from '../lib/layout-source';

/** Read-only content audit against the local, pre-migration snapshots. */
(async()=>{
 const report=JSON.parse(await fs.readFile('.local-review/all-editions/report.json','utf8'));
 for(const row of report){
  const path=`content/posts/${row.locale}/${row.slug}.mdx`,source=await fs.readFile(path,'utf8'),parsed=matter(source);
  assert.equal(await migrateLayoutSource(source),source,`${path}: stable ID migration changed saved layout`);
  await validateLayoutSource(source,parsed.data.reader.pages);
  await serialize(parsed.content,{mdxOptions:{remarkPlugins:[remarkGfm,[remarkMagazinePlan,parsed.data.reader.pages],remarkMagazine]}});
  if(row.migrated){
   const old=await fs.readFile(`.local-review/all-editions/${row.locale}-${row.slug}.mdx`,'utf8');
   assert.equal(await editionFingerprint(source),await editionFingerprint(old),`${path}: content changed`);
   const before={...matter(old).data},after={...parsed.data};delete before.reader;delete after.reader;
   assert.deepEqual(after,before,`${path}: metadata changed`);
  }
  assert.equal(parsed.data.reader.pages.length,row.pages,`${path}: report page count changed`);
  console.log(`PASS ${row.locale}/${row.slug}: ${row.pages} pages${row.draft?' (draft)':''}`);
 }
 console.log(`${report.length} editions: compiled, stable references, preserved content and metadata`);
})().catch(e=>{console.error(e);process.exitCode=1;});
