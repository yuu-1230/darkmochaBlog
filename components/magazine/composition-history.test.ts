import {compositionHistory as reduce,initialHistory} from './composition-history';
import type {CompositionSession} from './CompositionContext';
const session:CompositionSession={pageId:'one',composition:{textWidth:100,frames:[]},selected:0,locked:true,overflow:false,textCount:1};
it('groups a drag into one undo and preserves measurement-only updates',()=>{
  let s=reduce(initialHistory,{type:'set',value:session});
  s=reduce(s,{type:'begin'});
  for(const width of [95,90,85])s=reduce(s,{type:'set',value:p=>({...p!,composition:{...p!.composition,textWidth:width}})});
  s=reduce(s,{type:'end'});
  s=reduce(s,{type:'set',value:p=>({...p!,overflow:true})});
  expect(s.past).toHaveLength(1);
  s=reduce(s,{type:'undo'});expect(s.session!.composition.textWidth).toBe(100);
  expect(s.session!.overflow).toBe(true);
  s=reduce(s,{type:'redo'});expect(s.session!.composition.textWidth).toBe(85);
  s=reduce(s,{type:'undo'});
  s=reduce(s,{type:'set',value:p=>({...p!,composition:{...p!.composition,textWidth:80}})});
  expect(s.future).toHaveLength(0);
});
it('resets when leaving a page and ignores selection changes',()=>{
  let s=reduce(initialHistory,{type:'set',value:session});
  s=reduce(s,{type:'set',value:{...session,selected:1}});expect(s.past).toHaveLength(0);
  s=reduce(s,{type:'set',value:{...session,opening:{title:'New'}}});expect(s.past).toHaveLength(1);
  s=reduce(s,{type:'undo'});expect(s.session!.opening).toBeUndefined();
  s=reduce(s,{type:'set',value:{...session,pageId:'two'}});expect(s.future).toHaveLength(0);
  s=reduce(s,{type:'set',value:null});expect(s.session).toBeNull();
});
it('does not rerender after a measurement reports no change',()=>{
 const state=reduce(initialHistory,{type:'set',value:session});
 expect(reduce(state,{type:'set',value:s=>s})).toBe(state);
});
