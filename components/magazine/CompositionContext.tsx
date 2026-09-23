'use client';
import {createContext,useContext,useReducer,useState,useCallback,useEffect,type ReactNode,type Dispatch,type SetStateAction} from 'react';
import {compositionHistory,initialHistory} from './composition-history';
import type {PageSettings} from '@/lib/magazine';
import type {PageComposition} from '@/lib/page-composition';
export type CompositionSession={pageId:string;baseComposition?:string;preview?:'desktop'|'mobile'|'before';assets?:import('@/lib/article-layout-options').PhotoAsset[];advice?:string[];selectedText?:string;paragraphLabels?:{id:string;label:string;section:string}[];textLabels?:{id:string;label:string}[];opening?:Pick<PageSettings,"image"|"title"|"subtitle"|"focal"|"placement"|"tone"|"overlay"|"background">;composition:PageComposition;selected:number;photoTool?:'move'|'crop';locked:boolean;overflow:boolean;textCount:number};
const Context=createContext<{planPreview:ReactNode;setPlanPreview:Dispatch<SetStateAction<ReactNode>>;session:CompositionSession|null;setSession:Dispatch<SetStateAction<CompositionSession|null>>;undo:()=>void;redo:()=>void;canUndo:boolean;canRedo:boolean}|null>(null);
export function CompositionProvider({children}:{children:ReactNode}){
  const [planPreview,setPlanPreview]=useState<ReactNode>(null);
  const [state,dispatch]=useReducer(compositionHistory,initialHistory);
  const setSession=useCallback<Dispatch<SetStateAction<CompositionSession|null>>>(value=>dispatch({type:'set',value}),[]);
  const undo=useCallback(()=>dispatch({type:'undo'}),[]),redo=useCallback(()=>dispatch({type:'redo'}),[]);
  const active=!!state.session;
  useEffect(()=>{
    if(!active)return;
    const begin=()=>dispatch({type:'begin'}),end=()=>dispatch({type:'end'});
    window.addEventListener('pointerdown',begin,true);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);window.addEventListener('blur',end);
    return()=>{window.removeEventListener('pointerdown',begin,true);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);window.removeEventListener('blur',end);};
  },[active]);
  return <Context.Provider value={{planPreview,setPlanPreview,session:state.session,setSession,undo,redo,canUndo:state.past.length>0,canRedo:state.future.length>0}}>{children}</Context.Provider>;
}
export const useCompositionSession=()=>useContext(Context);
