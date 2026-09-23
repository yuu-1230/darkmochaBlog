import { createHash, randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { validCoverImage } from './cover-editor-image';
import { validateCover } from './magazine-validation';

export function localEditorHost(host: string | null) {
  return !!host && /^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host);
}
export function localEditorEnabled(environment=process.env.NODE_ENV, enabled=process.env.LOCAL_LAYOUT_EDITOR){return environment==='development'&&enabled==='1';}
export function allowCoverEditor(request: Request, environment = process.env.NODE_ENV, enabled=process.env.LOCAL_LAYOUT_EDITOR) {
  if (!localEditorEnabled(environment,enabled) || !localEditorHost(request.headers.get('host'))) return false;
  if (request.method === 'GET') return !['cross-site', 'same-site'].includes(request.headers.get('sec-fetch-site') ?? '');
  try {
    const origin = new URL(request.headers.get('origin') ?? '');
    return origin.protocol === 'http:' && origin.host === request.headers.get('host') && request.headers.get('content-type')?.startsWith('application/json') === true;
  } catch { return false; }
}
export type CoverEdit = {cover: Record<string, unknown>; displayTitle: string; cardSummary: string};
export const revision = (source: string) => createHash('sha256').update(source).digest('hex');

/** Replace only the three editable top-level fields; keep the body and other metadata byte-for-byte. */
export function patchCover(source: string, edit: CoverEdit) {
  if (!edit || Object.keys(edit).some(k => !['cover','displayTitle','cardSummary'].includes(k))) throw new Error('編集できない項目が含まれています');
  for (const key of ['displayTitle','cardSummary'] as const) {
    if (typeof edit[key] !== 'string' || !edit[key].trim() || edit[key].length > 2000) throw new Error(`${key}: 1〜2000文字で入力してください`);
  }
  const parsed = matter(source);
  validateCover(edit.cover, parsed.data.image);
  for (const val of Object.values(edit.cover)) if (typeof val === 'string' && val.length > 2000) throw new Error('表紙設定が長すぎます');
  if (edit.cover.image && !validCoverImage(String(edit.cover.image))) throw new Error('画像は /images/ のパスまたは設定済み画像配信元のURLで指定してください');
  const match = source.match(/^(---\r?\n)([\s\S]*?)(^---\s*$)/m);
  if (!match || match.index !== 0) throw new Error('対応するfrontmatterがありません');
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  let header = match[2];
  for (const [key,value] of Object.entries(edit)) {
    if (JSON.stringify(parsed.data[key]) === JSON.stringify(value)) continue;
    const field = new RegExp(`^${key}:[^\\r\\n]*(?:\\r?\\n(?:(?:[ \\t]+[^\\r\\n]*)|(?:[ \\t]*)))*`, 'm');
    const replacement = `${key}: ${JSON.stringify(value)}${newline}`;
    if (field.test(header)) header = header.replace(field,replacement);
    else header += replacement;
  }
  const updated = match[1] + header + source.slice(match[1].length + match[2].length);
  const after = matter(updated);
  const beforeOther = {...parsed.data}; const afterOther = {...after.data};
  for (const key of Object.keys(edit)) { delete beforeOther[key]; delete afterOther[key]; }
  if (JSON.stringify(beforeOther) !== JSON.stringify(afterOther) || parsed.content !== after.content || Object.entries(edit).some(([k,v])=>JSON.stringify(after.data[k]) !== JSON.stringify(v))) throw new Error('安全に更新できないfrontmatter形式です');
  return updated;
}
const locks = new Set<string>();
export async function readCoverFile(locale: string, slug: string, root = path.join(process.cwd(),'content/posts')) {
  if (!['ja','en'].includes(locale) || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)) throw new Error('記事の指定が不正です');
  const file = path.join(await fs.realpath(root),locale,`${slug}.mdx`);
  const real = await fs.realpath(file);
  if (real !== file) throw new Error('リンクされたファイルは編集できません');
  const source = await fs.readFile(file,'utf8');
  const {data} = matter(source);
  return {file,source,revision:revision(source),edit:{cover:data.cover ?? {},displayTitle:data.displayTitle ?? data.title,cardSummary:data.cardSummary ?? data.description ?? ''} as CoverEdit};
}
export async function saveCoverFile(locale: string, slug: string, expected: string, edit: CoverEdit, root?: string) {
  return {...await updatePostFile(locale,slug,expected,source=>patchCover(source,edit),root),edit};
}
export async function updatePostFile(locale: string, slug: string, expected: string, transform:(source:string)=>string|Promise<string>, root?:string) {
  const key = `${root}:${locale}:${slug}`;
  if (locks.has(key)) throw new Error('CONFLICT');
  locks.add(key);
  let temp: string | undefined;
  try {
    const current = await readCoverFile(locale,slug,root);
    if (current.revision !== expected) throw new Error('CONFLICT');
    const next = await transform(current.source);
    temp = `${current.file}.${randomUUID()}.tmp`;
    await fs.writeFile(temp,next,{flag:'wx',mode:(await fs.stat(current.file)).mode});
    if (revision(await fs.readFile(current.file,'utf8')) !== expected) throw new Error('CONFLICT');
    await fs.rename(temp,current.file);
    return {revision:revision(next)};
  } finally { if (temp) await fs.rm(temp,{force:true}); locks.delete(key); }
}
