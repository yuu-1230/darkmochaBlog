import {initialComposition,type PageComposition} from './page-composition';
import type {BlockCatalog} from './article-layout-options';
import type {PlannedPage} from './remark-magazine-plan';

export const imageRatios={original:'元比率',portrait:'4:5',landscape:'3:2',square:'1:1'} as const;
export const densityPresets={compact:'コンパクト',standard:'標準',relaxed:'ゆったり'} as const;
export const layoutRegistry={
 opening:{name:'全面写真の導入',preview:'▣ 題名',purpose:'導入・章扉',min:1,max:1,kinds:['heading','paragraph','photo'],slots:['background','title','lead'],desktop:'全面写真＋短い題名',mobile:'写真と導入文を縦に読む',fallback:'text',overflow:'収まらない内容を続きのページへ送る',reason:'大きな写真を主役にする'},
 portrait:{name:'縦写真と本文',preview:'▥ ▤',purpose:'縦写真1枚と説明',min:1,max:1,kinds:['heading','paragraph','photo'],slots:['main-photo','copy'],desktop:'左写真・右本文',mobile:'意味順の1列',fallback:'landscape',overflow:'収まらない内容を続きのページへ送る',reason:'縦写真を高さ方向に大きく扱える'},
 landscape:{name:'横写真と本文',preview:'▰ / ▤',purpose:'横写真1枚と説明',min:1,max:1,kinds:['heading','paragraph','photo'],slots:['main-photo','copy'],desktop:'横写真の下へ本文',mobile:'意味順の1列',fallback:'portrait',overflow:'収まらない内容を続きのページへ送る',reason:'横写真を元の構図に近い形で見せる'},
 pair:{name:'写真2枚と短文',preview:'▥ ▥ / ▤',purpose:'関連する2枚',min:2,max:2,kinds:['paragraph','photo'],slots:['main-photo','support-photo','copy'],desktop:'2枚と本文',mobile:'写真と説明を順に読む',fallback:'mosaic',overflow:'収まらない内容を続きのページへ送る',reason:'2枚の写真を関連づけて見せる'},
 text:{name:'本文中心',preview:'▤ ▤',purpose:'長文・写真なし',min:0,max:20,kinds:['heading','paragraph','quote','list','photo'],slots:['copy','support-photo'],desktop:'本文＋補助写真',mobile:'意味順の1列',fallback:'data',overflow:'収まらない内容を続きのページへ送る',reason:'本文の行長と読みやすさを優先する'},
 data:{name:'表・コード・図解',preview:'▦ / ▤',purpose:'技術記事・費用表',min:0,max:20,kinds:['table','code','list','diagram','paragraph'],slots:['data','copy','support-photo'],desktop:'情報を切らない本文幅',mobile:'図は元比率・横長コードは局所スクロール',fallback:'text',overflow:'収まらない内容を続きのページへ送る',reason:'表やコードの情報を切り捨てない'},
 mosaic:{name:'写真と記録（互換）',preview:'▥ ▥ ▥',purpose:'既存の写真3枚以上',min:2,max:20,kinds:['paragraph','photo'],slots:['main-photo','support-photo','copy'],desktop:'写真と短文',mobile:'意味順の1列',fallback:'text',overflow:'収まらない内容を続きのページへ送る',reason:'既存記事の複数写真を保持する'},
} as const;
export type LayoutId=keyof typeof layoutRegistry;
export function templateCandidates(page:PlannedPage,catalog:BlockCatalog){
 const assets=Object.values(catalog).flatMap(b=>b.photos);
 const photos=page.blocks.flatMap(id=>catalog[id]?.photos??[]).map(p=>{const f=page.composition?.frames.find(f=>f.source===p.src);return assets.find(a=>a.src===f?.replacement)??p;}),hasData=page.blocks.some(id=>catalog[id]?.table||catalog[id]?.code);
 return (Object.keys(layoutRegistry) as LayoutId[]).filter(id=>{
  if(id==='opening')return false;
  const t=layoutRegistry[id];if(photos.length<t.min||photos.length>t.max)return false;
  if(id==='portrait')return photos[0].height>photos[0].width;
  if(id==='landscape')return photos[0].width>=photos[0].height;
  if(id==='data')return hasData;
  if(id==='mosaic')return photos.length>2;
  return true;
 }).sort((a,b)=>Number(b==='data'&&hasData)-Number(a==='data'&&hasData));
}
export function templateComposition(id:LayoutId,photos:{src:string;width:number;height:number}[],textCount:number):PageComposition{
 const c=initialComposition(photos,textCount);
 c.templateId=id;c.density='standard';c.headingSize='standard';
 c.frames=c.frames.map((f,i)=>({...f,side:id==='landscape'?'block':i%2?'right':'left',width:id==='landscape'?100:id==='portrait'?52:id==='text'||id==='data'?32:44,role:i?'support':'main',anchor:0,inset:0,offset:0}));
 return c;
}
