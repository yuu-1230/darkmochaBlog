/** @jest-environment node */
import {textWrapShapes} from './text-wrap';
const box={left:0,right:600,top:0,bottom:500};
it('widens lines below the photograph, then excludes the next photograph',()=>{
 const result=textWrapShapes(box,[{left:400,right:600,top:0,bottom:100},{left:450,right:600,top:200,bottom:300}],0);
 expect(result.bands).toEqual([
  {top:0,bottom:100,left:0,right:200},
  {top:100,bottom:200,left:0,right:0},
  {top:200,bottom:300,left:0,right:150},
 ]);
});
it('wraps between left and right obstacles without intersecting either',()=>{
 const result=textWrapShapes(box,[{left:0,right:200,top:0,bottom:400},{left:400,right:600,top:0,bottom:100}],0);
 expect(result.bands).toEqual([{top:0,bottom:100,left:200,right:200},{top:100,bottom:400,left:200,right:0}]);
});
it('does not let invisible exclusion shapes extend beyond the current text frame',()=>{
 const result=textWrapShapes({...box,bottom:80},[{left:0,right:200,top:0,bottom:400}],0);
 expect(result.height).toBe(80);
 expect(textWrapShapes(box,[{left:0,right:200,top:600,bottom:800}]).height).toBe(0);
});
it('keeps both float contours in the same row when the available side changes',()=>{
 const result=textWrapShapes(box,[{left:0,right:300,top:0,bottom:300},{left:310,right:440,top:100,bottom:400},{left:500,right:600,top:0,bottom:150}],0);
 expect(result.leftWidth+result.rightWidth).toBeLessThanOrEqual(600);
});
it('full-width obstacles block lines until their lower edge',()=>{
 const result=textWrapShapes(box,[{left:0,right:600,top:0,bottom:80}],0);
 expect(result.bands[0].left+result.bands[0].right).toBe(600);
 expect(result.height).toBe(80);
});
