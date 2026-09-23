import {columnCount,continuationHash,readerSheets} from './reader-pagination';
test('continuations preserve left-to-right article order without duplicating sources',()=>{
 expect(readerSheets(['a','b','c'],id=>id==='b'?3:1)).toEqual([{source:'a',part:0},{source:'b',part:0},{source:'b',part:1},{source:'b',part:2},{source:'c',part:0}]);
});
test('column measurement accounts for gutters and subpixel rounding',()=>{
 expect(columnCount(615,615,56)).toBe(1);
 expect(columnCount(1286,615,56)).toBe(2);
 expect(columnCount(1287,615,56)).toBe(2);
 expect(columnCount(1957,615,56)).toBe(3);
 expect(continuationHash('page-one',0)).toBe('page-one');
 expect(continuationHash('page-one',2)).toBe('page-one--continuation-3');
});
