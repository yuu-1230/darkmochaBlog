import { allowCoverEditor, readCoverFile, saveCoverFile } from '@/lib/cover-editor';
import { revalidatePath } from 'next/cache';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = {'Cache-Control':'no-store','X-Robots-Tag':'noindex, noarchive'};
export async function GET(request: Request) {
  if (!allowCoverEditor(request)) return new Response('Not Found',{status:404});
  const url = new URL(request.url);
  try {
    const {revision,edit} = await readCoverFile(url.searchParams.get('locale') ?? '',url.searchParams.get('slug') ?? '');
    return Response.json({revision,edit},{headers});
  } catch { return Response.json({error:'記事を読み込めませんでした'},{status:400,headers}); }
}
export async function PUT(request: Request) {
  if (!allowCoverEditor(request)) return new Response('Not Found',{status:404});
  try {
    const body = await request.text();
    if (body.length > 24000) throw new Error('設定が大きすぎます');
    const {locale,slug,revision,edit} = JSON.parse(body);
    const result = await saveCoverFile(locale,slug,revision,edit);
    // MDX is read from disk, outside Next's fetch cache. Invalidate all localized
    // article/list payloads, then the client refreshes its Router Cache as well.
    revalidatePath('/', 'layout');
    return Response.json(result,{headers});
  } catch (error) {
    const conflict = error instanceof Error && error.message === 'CONFLICT';
    return Response.json({error:conflict?'ファイルが別の場所で更新されました。変更を控えて再読込してください。':error instanceof Error ? error.message : '保存できませんでした'},{status:conflict?409:400,headers});
  }
}
