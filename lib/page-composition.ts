/** Layout only. Article prose and image sources remain in MDX. */
export type PhotoFrame = {
  sourceId?:string;
  replacementId?:string;
  replacement?: string;
  role?: 'main'|'support';
  source: string; // reference to the existing MDX Photo, never duplicated content
  side: 'left' | 'right' | 'block';
  width: number; // percentage of the text area
  ratio: number; // width / height of the frame
  inset: number; // distance from the chosen edge, percentage
  offset: number; // vertical offset from the insertion point, px
  gap: number;
  anchor?: number; // legacy/unsaved insertion index; normalized to anchorId on save
  anchorId?: string; // stable paragraph ID, or end
  fit: 'cover' | 'contain';
  position?: 'free';
  x?: number; // percentage of page content width
  y?: number; // percentage of page content height
  shape?: 'rect'|'circle'|'rounded';
  cornerRadius?: number; // px; only used for rounded photos
  zoom?: number;
  focalX: number;
  focalY: number;
};
export const textSizes = [12,14,16,18,22,28,36,48] as const;
export type TextFrame = {position?:'free';x?:number;y?:number;id:string;width:number;inset:number;offset:number;bottomSpace?:number;fontSize?:number};
export type PageComposition = { allowOverlap?:boolean; templateId?:import('./layout-registry').LayoutId; background?:import('./magazine').Background; density?:'compact'|'standard'|'relaxed';headingSize?:'small'|'standard'|'large';fixed?:boolean; textWidth: number; frames: PhotoFrame[]; textGroups?:TextFrame[]; textUnit?:'paragraph' };
export function moveTextGroup(groups:TextFrame[],id:string,target:string){
  const from=groups.findIndex(g=>g.id===id),to=groups.findIndex(g=>g.id===target);
  if(from<0||to<0)return groups;
  const next=[...groups];next.splice(to,0,next.splice(from,1)[0]);return next;
}
export const clamp = (value:number,min:number,max:number) => Math.min(max,Math.max(min,value));
export function initialComposition(photos:{src:string;width:number;height:number}[],textCount:number):PageComposition {
  return {textWidth:100,frames:photos.map((photo,i)=>({source:photo.src,side:i%2?'left':'right',width:44,ratio:photo.width>0&&photo.height>0?photo.width/photo.height:.8,inset:0,offset:0,gap:18,anchor:Math.min(textCount,Math.floor(i*textCount/Math.max(1,photos.length))),fit:'contain',focalX:50,focalY:50}))};
}
export function validateComposition(value:unknown,photoCount?:number,sources?:string[]):asserts value is PageComposition {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('組版設定が不正です');
  const c=value as PageComposition;
  if(Object.keys(c).some(k=>!['textWidth','frames','textGroups','textUnit','templateId','density','background','headingSize','fixed','allowOverlap'].includes(k))||!Array.isArray(c.frames)||c.frames.length>20||photoCount!==undefined&&c.frames.length!==photoCount)throw new Error('組版の写真数が一致しません');
  if(c.templateId&&!['opening','portrait','landscape','pair','text','data','mosaic'].includes(c.templateId)||c.density&&!['compact','standard','relaxed'].includes(c.density)||c.headingSize&&!['small','standard','large'].includes(c.headingSize)||c.fixed!==undefined&&typeof c.fixed!=='boolean')throw new Error('未対応のプリセットです');
  if(c.background&&!['paper','sand','rust','sage','sky','ink'].includes(c.background))throw new Error('未対応の配色です');
  if(c.allowOverlap!==undefined&&typeof c.allowOverlap!=='boolean')throw new Error('重なり設定が不正です');
  const range=(n:unknown,min:number,max:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
  if(!range(c.textWidth,60,100))throw new Error('本文領域の幅は60〜100%です');
  if(c.textUnit!==undefined&&c.textUnit!=='paragraph')throw new Error('文章の編集単位が不正です');
  if(c.textUnit&&!c.textGroups)throw new Error('段落の配置がありません');
  if(c.textGroups!==undefined){
    if(!Array.isArray(c.textGroups)||c.textGroups.length>200||new Set(c.textGroups.map(g=>g?.id)).size!==c.textGroups.length)throw new Error('文章のまとまりが重複・不正です');
    for(const g of c.textGroups)if(!g||Object.keys(g).some(k=>!['id','width','inset','offset','bottomSpace','fontSize','position','x','y'].includes(k))||typeof g.id!=='string'||!g.id||!range(g.width,30,100)||!range(g.inset,0,70)||g.width+g.inset>100.01||!range(g.offset,0,300)||g.bottomSpace!==undefined&&!range(g.bottomSpace,0,500)||g.fontSize!==undefined&&!(textSizes as readonly number[]).includes(g.fontSize)||g.position!==undefined&&g.position!=='free'||g.x!==undefined&&!range(g.x,0,100)||g.y!==undefined&&!range(g.y,0,100))throw new Error('文章枠の設定が不正です');
  }
  for(const [index,f] of c.frames.entries()){
    if(!f||Object.keys(f).some(k=>!['sourceId','replacementId','replacement','role','source','side','width','ratio','inset','offset','gap','anchor','anchorId','fit','focalX','focalY','zoom','position','x','y','shape','cornerRadius'].includes(k)))throw new Error('写真枠の設定が不正です');
    if(f.shape!==undefined&&!['rect','circle','rounded'].includes(f.shape)||f.cornerRadius!==undefined&&!range(f.cornerRadius,0,100))throw new Error('写真の形・角丸の設定が不正です');
    if(f.position!==undefined&&f.position!=='free'||f.x!==undefined&&!range(f.x,0,100)||f.y!==undefined&&!range(f.y,0,100))throw new Error('写真の位置が不正です');
    if([f.sourceId,f.replacementId].some(id=>id!==undefined&&(typeof id!=='string'||!/^asset-[a-f0-9-]+$/.test(id))))throw new Error('画像IDが不正です');
    if(f.replacement!==undefined&&typeof f.replacement!=='string'||f.role!==undefined&&!['main','support'].includes(f.role))throw new Error('写真の参照・役割が不正です');
    if(typeof f.source!=='string'||!f.source||sources&&f.source!==sources[index])throw new Error('写真の参照が変更されています。配置を調整し直してください');
    if(!['left','right','block'].includes(f.side)||!['cover','contain'].includes(f.fit)||!range(f.width,20,100)||!range(f.ratio,.01,100)||!range(f.inset,0,80)||f.width+f.inset>100.01||!range(f.offset,0,500)||!range(f.gap,0,48)||(f.anchorId===undefined?(!range(f.anchor,0,200)||!Number.isInteger(f.anchor)):typeof f.anchorId!=='string'||!f.anchorId)||!range(f.focalX,0,100)||!range(f.focalY,0,100)||f.zoom!==undefined&&!range(f.zoom,1,4))throw new Error('写真枠の数値が範囲外です');
  }
}
export function validateTextReferences(composition:PageComposition,ids:string[]){
  if(composition.textGroups&&(composition.textGroups.length!==ids.length||composition.textGroups.some((g,i)=>g.id!==ids[i])))throw new Error('すべての文章のまとまりを一度ずつ配置してください');
}
export function parseComposition(value?:string):PageComposition|undefined {
  if(!value)return;
  const parsed:unknown=JSON.parse(value);validateComposition(parsed);return parsed;
}
