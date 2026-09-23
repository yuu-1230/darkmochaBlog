/** @jest-environment node */
import {PUT} from './route';
import {revalidatePath} from 'next/cache';
import {saveCoverFile} from '@/lib/cover-editor';
jest.mock('next/cache',()=>({revalidatePath:jest.fn()}));
jest.mock('@/lib/cover-editor',()=>({allowCoverEditor:()=>true,saveCoverFile:jest.fn()}));
const request=()=>new Request('http://localhost:3000/api/local/cover',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:'ja',slug:'test',revision:'before',edit:{cover:{imageZoom:150}}})});
it('invalidates localized lists and article pages after a successful save',async()=>{
  jest.mocked(saveCoverFile).mockResolvedValueOnce({revision:'after',edit:{cover:{imageZoom:150},displayTitle:'Title',cardSummary:'Summary'}});
  expect((await PUT(request())).status).toBe(200);
  expect(revalidatePath).toHaveBeenCalledWith('/','layout');
});
it('does not invalidate or report success when saving conflicts',async()=>{
  jest.mocked(saveCoverFile).mockRejectedValueOnce(new Error('CONFLICT'));
  expect((await PUT(request())).status).toBe(409);
  expect(revalidatePath).not.toHaveBeenCalled();
});
