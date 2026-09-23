import {layoutOptions,pagePhotos,type BlockCatalog} from './article-layout-options';
import type {PlannedPage} from './remark-magazine-plan';
export function isProtectedPage(plan:PlannedPage[],index:number){const p=plan[index];return !p||p.template==='opening'||p.template==='spotlight'||index===1&&plan[0]?.template==='opening'&&p.template==='editorial';}
export type AssignmentAction={type:'move';direction:-1|1}|{type:'merge'}|{type:'split';at:number;newId:string};
/** Move only a shared boundary. Content order never changes. */
export function assignPages(plan:PlannedPage[],index:number,action:AssignmentAction,catalog:BlockCatalog):PlannedPage[]{
 const next=structuredClone(plan),page=next[index];
 const editable=(i:number)=>!isProtectedPage(next,i)&&!next[i]?.composition?.fixed;
 if(!editable(index))throw new Error('固定されたページは変更できません');
 let affected:number[]=[];
 if(action.type==='split'){
  if(action.at<1||action.at>=page.blocks.length||!Number.isInteger(action.at))throw new Error('本文の区切りを選択してください');
  const following={...structuredClone(page),id:action.newId,blocks:page.blocks.splice(action.at)};
  next.splice(index+1,0,following);affected=[index,index+1];
 }else{
  const other=index+(action.type==='merge'?1:action.direction);
  if(!editable(other))throw new Error('隣のページの固定を解除してください');
  if(action.type==='merge'){page.blocks.push(...next[other].blocks);next.splice(other,1);affected=[index];}
  else {if(page.blocks.length<2)throw new Error('空のページにはできません');if(action.direction===1)next[other].blocks.unshift(page.blocks.pop()!);else next[other].blocks.push(page.blocks.shift()!);affected=[index,other];}
 }
 const allBlocks=plan.flatMap(p=>p.blocks),photoSettings=Object.assign({},...plan.map(p=>p.photos));
 for(const i of affected){const p=next[i];delete p.composition;
  if(allBlocks.includes(p.id)&&p.id!==p.blocks[0])p.id=p.blocks[0];
  const choices=layoutOptions(p,catalog);p.template=choices.length?'feature':'text';if(choices.length)p.layout=choices[0] as PlannedPage['layout'];else delete p.layout;
  delete p.balance;p.photos=Object.fromEntries(pagePhotos(p,catalog).filter(photo=>photoSettings[photo.src]).map(photo=>[photo.src,photoSettings[photo.src]]));
 }
 if(JSON.stringify(next.flatMap(p=>p.blocks))!==JSON.stringify(allBlocks))throw new Error('本文の割り当てが一致しません');
 return next;
}
