import {act,render} from '@testing-library/react';
import {PageComposer} from './PageComposer';
import {initialComposition} from '@/lib/page-composition';

it('keeps fractional frame dimensions when a spread is hidden and restores them when shown',()=>{
  let width=465.8515625;
  const callbacks=new Set<()=>void>();
  const resize=()=>{for(const callback of [...callbacks])callback();};
  const originalObserver=global.ResizeObserver;
  global.ResizeObserver=class {
    callback:()=>void;
    constructor(callback:()=>void){this.callback=callback;callbacks.add(callback);}
    observe(){} unobserve(){} disconnect(){callbacks.delete(this.callback);}
  } as unknown as typeof ResizeObserver;
  const bounds=jest.spyOn(HTMLElement.prototype,'getBoundingClientRect').mockImplementation(()=>({width} as DOMRect));
  try{
    const composition=initialComposition([{src:'/test.jpg',width:800,height:1200}],1);
    const {container,unmount}=render(<PageComposer id="test" initial={JSON.stringify(composition)} text={[<p key="text">本文</p>]} photos={[<figure key="photo"/>]}>通常の型</PageComposer>);
    const frame=container.querySelector<HTMLElement>('.composition-frame')!;
    const expected=width*.44/(800/1200);
    expect(parseFloat(frame.style.height)).toBeCloseTo(expected,5);
    act(()=>{width=0;resize();});
    expect(parseFloat(frame.style.height)).toBeCloseTo(expected,5);
    act(()=>{width=512.625;resize();});
    expect(parseFloat(frame.style.height)).toBeCloseTo(width*.44/(800/1200),5);
    unmount();
  }finally{bounds.mockRestore();global.ResizeObserver=originalObserver;}
});

it('retains semantic order even when old settings contain reordered text references',()=>{
  const oldObserver=global.ResizeObserver;
  global.ResizeObserver=class {observe(){} disconnect(){}} as unknown as typeof ResizeObserver;
  try{
    const composition={textWidth:100,frames:[],textGroups:[{id:'b',width:70,inset:10,offset:20},{id:'a',width:100,inset:0,offset:0}]};
    const {container,unmount}=render(<PageComposer id="test" initial={JSON.stringify(composition)} photos={[]} text={[
      <span key="ma" data-text-section="a"/>,<h2 key="ha" id="heading-a">見出しA</h2>,<p key="a">本文A</p>,
      <span key="mb" data-text-section="b"/>,<h2 key="hb" id="heading-b">見出しB</h2>,<p key="b">本文B <a href="#heading-a">戻る</a></p>,
    ]}>通常の型</PageComposer>);
    expect(Array.from(container.querySelectorAll('h2')).map(el=>el.id)).toEqual(['heading-a','heading-b']);
    expect(container.querySelectorAll('#heading-a')).toHaveLength(1);
    expect(container.querySelector('a')).toHaveAttribute('href','#heading-a');
    expect(container.querySelector('[data-text-group="b"]')).toHaveStyle({width:'70%',marginLeft:'10%',paddingTop:'20px'});
    expect(container.textContent).toBe('見出しA本文A見出しB本文B 戻る');
    unmount();
  }finally{global.ResizeObserver=oldObserver;}
});

it('styles an individual paragraph without changing its position in the reading order',()=>{
  const oldObserver=global.ResizeObserver;
  global.ResizeObserver=class {observe(){} disconnect(){}} as unknown as typeof ResizeObserver;
  try{
    const composition={textWidth:100,frames:[],textUnit:'paragraph',textGroups:['h','p2','p1'].map(id=>({id,width:id==='p2'?80:100,inset:0,offset:0}))};
    const {container,unmount}=render(<PageComposer id="test" initial={JSON.stringify(composition)} photos={[]} text={[
      <span key="s" data-text-section="section"/>,<span key="mh" data-text-unit="h"/>,<h2 key="h" id="heading">見出し</h2>,
      <span key="m1" data-text-unit="p1"/>,<p key="p1">一つ目</p>,
      <span key="m2" data-text-unit="p2"/>,<p key="p2">二つ目 <a href="#heading">見出しへ</a></p>,
    ]}>通常の型</PageComposer>);
    expect(container.textContent).toBe('見出し一つ目二つ目 見出しへ');
    expect(container.querySelectorAll('p')).toHaveLength(2);
    expect(container.querySelector('[data-text-group="p2"]')).toHaveStyle({width:'80%'});
    expect(container.querySelector('h2')).toHaveAttribute('id','heading');
    unmount();
  }finally{global.ResizeObserver=oldObserver;}
});
