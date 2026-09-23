import fs from 'node:fs/promises';
import matter from 'gray-matter';
import assert from 'node:assert/strict';
import {balanceEdition,editionFingerprint} from '../lib/edition-migration';
import {validateLayoutSource} from '../lib/layout-source';

(async()=>{
 const report=JSON.parse(await fs.readFile('.local-review/all-editions/report.json','utf8'));
 for(const entry of report.filter((e:{migrated:boolean})=>e.migrated)){
  const path=`content/posts/${entry.locale}/${entry.slug}.mdx`,source=await fs.readFile(path,'utf8'),next=await balanceEdition(source);
  assert.equal(matter(next).content,matter(source).content);
  assert.equal(await editionFingerprint(next),await editionFingerprint(source));
  await validateLayoutSource(next,matter(next).data.reader.pages);
  if(next!==source){await fs.writeFile(path+'.edition-tmp',next);await fs.rename(path+'.edition-tmp',path);}
  entry.pages=matter(next).data.reader.pages.length;console.log(`${entry.locale}/${entry.slug}: ${entry.pages}`);
 }
 await fs.writeFile('.local-review/all-editions/report.json',JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1});
