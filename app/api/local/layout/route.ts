import {migrateLayoutSource,validateLayoutSource} from '@/lib/layout-source';
import matter from 'gray-matter';
import {revalidatePath} from 'next/cache';
import {allowCoverEditor,readCoverFile,updatePostFile} from '@/lib/cover-editor';
import {patchArticleLayout,articleBlockCatalog} from '@/lib/article-layout';
const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex, noarchive'};
export const runtime='nodejs';
export async function GET(request:Request){
  if(!allowCoverEditor(request))return new Response('Not Found',{status:404});
  try {const url=new URL(request.url);const file=await readCoverFile(url.searchParams.get('locale')??'',url.searchParams.get('slug')??'');return Response.json({revision:file.revision,plan:matter(file.source).data.reader?.pages,catalog:articleBlockCatalog(file.source)},{headers});}
  catch{return Response.json({error:'配置を読み込めませんでした'},{status:400,headers});}
}
export async function PUT(request:Request){
  if(!allowCoverEditor(request))return new Response('Not Found',{status:404});
  try{const body=await request.text();if(body.length>50000)throw new Error('設定が大きすぎます');const {locale,slug,revision,plan}=JSON.parse(body);let savedPlan=plan;const result=await updatePostFile(locale,slug,revision,async source=>{const patched=patchArticleLayout(source,plan);await validateLayoutSource(patched,matter(patched).data.reader.pages);const next=await migrateLayoutSource(patched);savedPlan=matter(next).data.reader.pages;return next;});revalidatePath('/','layout');return Response.json({...result,plan:savedPlan},{headers});}
  catch(e){return Response.json({error:e instanceof Error?e.message:'保存できませんでした'},{status:e instanceof Error&&e.message==='CONFLICT'?409:400,headers});}
}
