import {layoutSettled} from './layout-settling';

test('waits through photo measurement and later text wrapping before pagination', () => {
  const settled = layoutSettled();
  expect(settled('server photo size')).toBe(false);
  expect(settled('measured photo size')).toBe(false);
  expect(settled('measured photo size')).toBe(false);
  expect(settled('wrapped text')).toBe(false);
  expect(settled('wrapped text')).toBe(false);
  expect(settled('wrapped text')).toBe(false);
  expect(settled('wrapped text')).toBe(true);
});

test('bounds measurement even when geometry keeps changing', () => {
  const settled = layoutSettled(3, 4);
  expect(['a','b','c','d'].map(settled)).toEqual([false,false,false,true]);
});
