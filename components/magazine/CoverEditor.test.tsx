import {render,screen} from '@testing-library/react';
import {CoverEditor} from './CoverEditor';
import type {PostData} from '@/lib/mdx';
jest.mock('next/navigation',()=>({useRouter:()=>({refresh:jest.fn()})}));
jest.mock('./ArticleCoverCard',()=>({ArticleCoverCard:({post}:{post:PostData})=><div data-testid="cover">{post.frontmatter.cover?.imageZoom}</div>}));
jest.mock('./CoverReview',()=>({CoverReview:()=>null}));
const posts=(zoom:number)=>[{slug:'test',content:'',frontmatter:{title:'Test',date:'2026-01-01',displayTitle:'Test',cardSummary:'Summary',readTime:'1',progress:null,cover:{imageZoom:zoom}}}] satisfies PostData[];
it('uses new server data when a saved home route is refreshed',()=>{
  const {rerender}=render(<CoverEditor posts={posts(100)} locale="ja"/>);
  expect(screen.getByTestId('cover')).toHaveTextContent('100');
  rerender(<CoverEditor posts={posts(160)} locale="ja"/>);
  expect(screen.getByTestId('cover')).toHaveTextContent('160');
});
