import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";

const prettyCodeOptions: Options = {
  theme: { light: "solarized-light", dark: "everforest-dark" },
  keepBackground: false,
  defaultLang: "plaintext",
};

/** ブログ記事とローカルドキュメントで共通のMDX表示設定。 */
export function MdxDocument({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  );
}
