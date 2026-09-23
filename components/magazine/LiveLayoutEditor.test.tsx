import {fireEvent,render,screen,waitFor} from '@testing-library/react';
import {CompositionProvider,useCompositionSession} from './CompositionContext';
import {LiveLayoutEditor} from './LiveLayoutEditor';

jest.mock('next/navigation',()=>({useRouter:()=>({refresh:jest.fn()})}));
jest.mock('./LayoutPresetControls',()=>({LayoutPresetControls:()=>null}));
function TestControls(){
 const context=useCompositionSession()!;
 return <><button onClick={()=>context.setSession(s=>s?{...s,overflow:true}:s)}>simulate overflow</button>
 <button onClick={()=>context.setSession(s=>s?{...s,composition:{...s.composition,textWidth:90}}:s)}>edit layout</button></>;
}
const plan=['first','second'].map(id=>({id,template:'text',blocks:[id],composition:{textWidth:100,frames:[]}}));
const originalFetch=global.fetch;
afterEach(()=>{global.fetch=originalFetch;jest.restoreAllMocks();});

test.each([false,true])('overflow stays advisory when saving (other page: %s)',async other=>{
 const fetchMock=jest.fn().mockResolvedValue({ok:true,json:async()=>({plan,catalog:{},revision:'test'})} as Response);
 global.fetch=fetchMock;
 render(<CompositionProvider><LiveLayoutEditor locale="ja" slug="test"/><TestControls/></CompositionProvider>);
 fireEvent.click(screen.getByRole('button',{name:'誌面を直接編集'}));
 await screen.findByRole('combobox',{name:'編集するページ'});
 fireEvent.click(screen.getByText('simulate overflow'));
 if(other)fireEvent.change(screen.getByRole('combobox',{name:'編集するページ'}),{target:{value:'second'}});
 fireEvent.click(screen.getByText('edit layout'));
 expect(screen.getByText(/はみ出しがあります（1ページ）/)).toBeInTheDocument();
 const save=screen.getByRole('button',{name:'変更を保存'});
 expect(save).toBeEnabled();fireEvent.click(save);
 await waitFor(()=>expect(fetchMock).toHaveBeenCalledWith('/api/local/layout',expect.objectContaining({method:'PUT'})));
});
