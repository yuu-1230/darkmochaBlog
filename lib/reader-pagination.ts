/** Physical sheets are viewport-specific; authored MDX pages remain unchanged. */
export type ReaderSheet<T>={source:T;part:number};
export function readerSheets<T>(sources:T[],count:(source:T)=>number):ReaderSheet<T>[] {
 return sources.flatMap(source=>Array.from({length:Math.max(1,count(source))},(_,part)=>({source,part})));
}
export function columnCount(scrollWidth:number,width:number,gap:number){
 return Math.max(1,Math.ceil((scrollWidth+gap-2)/(width+gap)));
}
export function continuationHash(id:string,part:number){return part?`${id}--continuation-${part+1}`:id;}
