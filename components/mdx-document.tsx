import { MDXRemote,compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMagazinePlan, {type PlannedPage} from "@/lib/remark-magazine-plan";
import remarkMagazine from "@/lib/remark-magazine";
import type { ComponentProps,ReactNode } from "react";
import { mdxComponents } from "@/components/mdx";

const prettyCodeOptions: Options = {
  theme: { light: "solarized-light", dark: "everforest-dark" },
  keepBackground: false,
  defaultLang: "plaintext",
};

export function documentMdxOptions(plan?:PlannedPage[]){return {
 remarkPlugins:[remarkGfm,[remarkMagazinePlan,plan],remarkMagazine],
 rehypePlugins:[rehypeSlug,[rehypePrettyCode,prettyCodeOptions]],
} as NonNullable<NonNullable<ComponentProps<typeof MDXRemote>['options']>['mdxOptions']>;}

/** ブログ記事とローカルドキュメントで共通のMDX表示設定。 */
export async function MdxDocument({ source, components = {}, plan }: { source: string; plan?: PlannedPage[]; components?: ComponentProps<typeof MDXRemote>["components"] }) {
  const merged={...mdxComponents,...components};
  try {
    return (await compileMDX({source,components:merged,options:{mdxOptions:documentMdxOptions(plan)}})).content;
  } catch(error) {
    if(!plan)throw error;
    // Stale layout references must not make valid article prose disappear.
    const fallback=await compileMDX({source,components:{...merged,ArticleBlock:({id,children}:{id:string;children:ReactNode})=><section id={`page-${id}`} className="magazine-page"><div className="magazine-page-content">{children}</div></section>},options:{mdxOptions:{remarkPlugins:[remarkGfm],rehypePlugins:[rehypeSlug,[rehypePrettyCode,prettyCodeOptions]]}}});
    return <div data-reader-fallback><p role="status">この記事は全文表示でお読みいただけます。</p>{fallback.content}</div>;
  }
}
