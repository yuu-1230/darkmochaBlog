export type WrapRect={left:number;right:number;top:number;bottom:number};
/** Rectangular exclusions become step-shaped floats; the browser wraps each line. */
export function textWrapShapes(box:WrapRect, obstacles:WrapRect[], gap=12){
 const width=box.right-box.left;
 const hits=obstacles.filter(r=>r.right>box.left&&r.left<box.right&&r.bottom+gap>box.top&&r.top-gap<box.bottom)
  .map(r=>({left:Math.max(0,r.left-box.left-gap),right:Math.min(width,r.right-box.left+gap),top:Math.max(0,r.top-box.top-gap),bottom:Math.min(box.bottom-box.top,Math.max(0,r.bottom-box.top+gap))}));
 const ys=[...new Set([0,...hits.flatMap(r=>[r.top,r.bottom])])].sort((a,b)=>a-b);
// Both float envelopes must fit side by side. Keep a shared reading corridor
 // rather than letting a later band move the right float below the left one.
 let corridorLeft=0,corridorRight=width;
 const bands=ys.slice(0,-1).map((top,i)=>{
  const bottom=ys[i+1],active=hits.filter(r=>r.top<bottom&&r.bottom>top).sort((a,b)=>a.left-b.left);
  let cursor=0,start=corridorLeft,end=corridorLeft,best=-1;
  for(const r of [...active,{left:width,right:width}]){
   if(r.left-cursor>best&&r.left>=corridorLeft&&cursor<=corridorRight){best=r.left-cursor;start=cursor;end=r.left;}
   cursor=Math.max(cursor,r.right);
  }
  if(end-start<Math.min(60,width*.3))end=start;
  corridorLeft=Math.max(corridorLeft,start);corridorRight=Math.min(corridorRight,end);
  return {top,bottom,left:start,right:width-end};
 });
 const height=ys.at(-1)??0;
 const polygon=(side:'left'|'right')=>{
  const extent=Math.max(0,...bands.map(b=>b[side]));
  const edge=side==='left'?0:extent;
  const points=[`${edge}px 0px`];
  for(const b of bands){const x=side==='left'?b.left:extent-b.right;points.push(`${x}px ${b.top}px`,`${x}px ${b.bottom}px`);}
  points.push(`${edge}px ${height}px`);
  return `polygon(${points.join(',')})`;
 };
 return {height,left:polygon('left'),right:polygon('right'),leftWidth:Math.max(0,...bands.map(b=>b.left)),rightWidth:Math.max(0,...bands.map(b=>b.right)),bands};
}
