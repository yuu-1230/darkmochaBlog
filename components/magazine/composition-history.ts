import type {CompositionSession} from './CompositionContext';
export type HistoryState={session:CompositionSession|null;past:CompositionSession[];future:CompositionSession[];grouping:boolean;recorded:boolean};
export const initialHistory:HistoryState={session:null,past:[],future:[],grouping:false,recorded:false};
type Action={type:'set';value:CompositionSession|null|((s:CompositionSession|null)=>CompositionSession|null)}|{type:'undo'|'redo'|'begin'|'end'};
const layout=(s:CompositionSession)=>JSON.stringify([s.composition,s.opening]);
export function compositionHistory(state:HistoryState,action:Action):HistoryState{
  if(action.type==='begin')return state.grouping?state:{...state,grouping:true,recorded:false};
  if(action.type==='end')return {...state,grouping:false,recorded:false};
  if(action.type==='undo'||action.type==='redo'){
    const stack=action.type==='undo'?state.past:state.future,target=stack.at(-1);
    if(!target||!state.session)return state;
    // Keep current measurement metadata; the renderer measures restored content again.
    const session={...state.session,composition:target.composition,opening:target.opening,selected:target.selected,selectedText:target.selectedText};
    return {...state,session,grouping:false,recorded:false,past:action.type==='undo'?state.past.slice(0,-1):[...state.past,state.session].slice(-100),future:action.type==='undo'?[...state.future,state.session]:state.future.slice(0,-1)};
  }
  if(action.type!=='set')return state;
  const next=typeof action.value==='function'?action.value(state.session):action.value;
  if(next===state.session)return state;
  if(!next||!state.session||next.pageId!==state.session.pageId)return {...initialHistory,session:next};
  if(layout(next)===layout(state.session))return {...state,session:next};
  return {...state,session:next,past:state.grouping&&state.recorded?state.past:[...state.past,state.session].slice(-100),future:[],recorded:state.grouping};
}
