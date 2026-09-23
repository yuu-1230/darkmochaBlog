import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import {migrateLayoutSource} from '../lib/layout-source';
(async()=>{
 for(const locale of ['ja','en'])for(const name of await fs.readdir(`content/posts/${locale}`)){
  if(!name.endsWith('.mdx'))continue;
  const file=path.join('content/posts',locale,name),source=await fs.readFile(file,'utf8');
  if(!matter(source).data.reader?.pages)continue;
  const next=await migrateLayoutSource(source);
  if(next!==source){await fs.mkdir('.local-review/id-migration',{recursive:true});await fs.writeFile(`.local-review/id-migration/${locale}-${name}`,source,{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});await fs.writeFile(file,next);console.log(file);}
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
