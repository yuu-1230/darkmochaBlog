/** @jest-environment node */
import {mkdtemp, mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {validCoverImage} from './cover-editor-image';
import {allowCoverEditor,patchCover,readCoverFile,saveCoverFile} from './cover-editor';
const source='---\ntitle: "Original"\ndate: "2026-01-01"\nimage: "/images/photo.jpg"\ncover:\n  template: overlay\n  title: old\nreader: {mode: magazine}\n---\n\n# Heading {#anchor}\n\n本文とコード `value`\n';
const edit={cover:{template:'split',textSide:'top',imageFit:'contain',imageZoom:150,titleFontSize:40,subtitleFontSize:14,labelFontSize:12},displayTitle:'一覧',cardSummary:'概要'};
it('changes only editable fields and preserves body and unrelated metadata verbatim',()=>{
  const result=patchCover(source,edit);
  expect(result).toContain('title: "Original"\ndate: "2026-01-01"\nimage: "/images/photo.jpg"\n');
  expect(result).toContain('reader: {mode: magazine}\n');
  expect(result.split('---')[2]).toBe(source.split('---')[2]);
  expect(patchCover(result,edit)).toBe(result);
});
it('rejects unsupported data and invalid layout choices',()=>{
  expect(()=>patchCover(source,{...edit,title:'bad'} as typeof edit)).toThrow();
  expect(()=>patchCover(source,{...edit,cover:{template:'unknown'}})).toThrow();
});
it('blocks production, nonlocal host and cross-origin writes',()=>{
  const request=(host:string,origin:string)=>new Request('http://localhost/api/local/cover',{method:'PUT',headers:{host,origin,'Content-Type':'application/json'}});
  expect(allowCoverEditor(request('localhost:3000','http://localhost:3000'),'development','1')).toBe(true);
  expect(allowCoverEditor(request('localhost:3000','http://localhost:3000'),'development','0')).toBe(false);
  expect(allowCoverEditor(request('localhost:3000','http://localhost:3000'),'production','1')).toBe(false);
  expect(allowCoverEditor(request('example.com','http://example.com'),'development','1')).toBe(false);
  expect(allowCoverEditor(request('localhost:3000','https://evil.example'),'development','1')).toBe(false);
  expect(allowCoverEditor(new Request('http://localhost',{headers:{host:'localhost','sec-fetch-site':'cross-site'}}),'development','1')).toBe(false);
});
it('persists edits, rejects stale revisions and traversal without altering newer content',async()=>{
  const root=await mkdtemp(path.join(tmpdir(),'cover-editor-'));
  try {
    await mkdir(path.join(root,'ja'));await writeFile(path.join(root,'ja/test.mdx'),source);
    const first=await readCoverFile('ja','test',root);
    await saveCoverFile('ja','test',first.revision,edit,root);
    expect(await readFile(first.file,'utf8')).toBe(patchCover(source,edit));
    await expect(saveCoverFile('ja','test',first.revision,edit,root)).rejects.toThrow('CONFLICT');
    await expect(readCoverFile('ja','../test',root)).rejects.toThrow();
    await expect(readCoverFile('../ja','test',root)).rejects.toThrow();
  }finally{await rm(root,{recursive:true,force:true});}
});

it('limits images to the configured delivery paths',()=>{
  expect(validCoverImage('/images/Articles/photo.JPG')).toBe(true);
  expect(validCoverImage('https://external.example/photo.jpg')).toBe(false);
  expect(validCoverImage('javascript:alert(1)')).toBe(false);
  expect(validCoverImage('/images/../private.png')).toBe(false);
});

it('rejects invalid zoom and font sizes',()=>{
 for(const cover of [{imageZoom:99},{imageZoom:251},{titleFontSize:100},{subtitleFontSize:'14'},{labelFontSize:NaN}]) expect(()=>patchCover(source,{...edit,cover})).toThrow();
});
