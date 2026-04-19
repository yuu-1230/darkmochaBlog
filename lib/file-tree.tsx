import React from "react";
import { FileType } from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. アイコン定義 ---
export const TSXIcon = ({ color }: { color: "blue" | "yellow" }) => (
  <span
    className={cn(
      "text-[10px] font-bold w-4 text-center inline-block",
      color === "blue" ? "text-[#519aba]" : "text-[#CBCB41]",
    )}
  >
    TSX
  </span>
);
export const MDIcon = () => (
  <span className="text-[10px] text-[#CCCCCC] font-bold w-4 text-center inline-flex items-center justify-center">
    <FileType className="w-3 h-3 text-[#519aba]" />
  </span>
);
export const InfoIcon = () => (
  <span className="text-[10px] text-[#519aba] font-bold w-4 text-center inline-block">
    i
  </span>
);
export const CSharpIcon = () => (
  <span className="text-[10px] text-[#178600] font-bold w-4 text-center inline-block">
    C#
  </span>
);
export const JsonIcon = () => (
  <span className="text-[10px] text-[#80BD01] font-bold w-4 text-center inline-block">
    {"{}"}
  </span>
);

// --- 2. 型定義 ---
export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  icon?: React.ReactNode;
  children?: FileNode[];
  isOpen?: boolean;
};

// --- 3. 自動生成関数  ---
// 記事データ(posts)を受け取って、動的にツリーを結合します
export const generateFileTree = (
  posts: { slug: string; frontmatter: { title: string; category?: string } }[],
  options?: { hasNotes?: boolean },
): FileNode[] => {
  const hasNotes = options?.hasNotes ?? false;
  // 記事をカテゴリごとに分類
  const techPosts = posts.filter((p) => p.frontmatter.category === "Tech");
  const unityPosts = posts.filter((p) => p.frontmatter.category === "Unity");
  const lifePosts = posts.filter((p) => p.frontmatter.category === "Life");

  // ノード作成のヘルパー関数
  const createNodes = (filteredPosts: typeof posts) =>
    filteredPosts.map((post) => ({
      name: `${post.slug}.mdx`,
      type: "file" as const,
      path: `/blog/${post.slug}`,
      icon: <MDIcon />,
    }));

  return [
    // 👇 ここに Home.tsx (トップページ) を追加！
    {
      name: "Home.tsx",
      type: "file",
      path: "/",
      icon: <TSXIcon color="blue" />,
    },
    {
      name: "About_me.md",
      type: "file",
      path: "/about",
      icon: <InfoIcon />,
    },
    {
      name: "Projects.json",
      type: "file",
      path: "/projects",
      icon: <JsonIcon />,
    },
    ...(hasNotes ?
      [
        {
          name: "notes.json",
          type: "file" as const,
          path: "/#daily-notes",
          icon: <JsonIcon />,
        },
      ]
    : []),

    {
      name: "Tech_Articles",
      type: "folder",
      isOpen: true,
      children: createNodes(techPosts),
    },
    {
      name: "Unity_Dev",
      type: "folder",
      isOpen: true,
      children: createNodes(unityPosts),
    },
    {
      name: "Life_and_Travel",
      type: "folder",
      isOpen: true,
      children: createNodes(lifePosts),
    },
  ];
};

// --- 検索関数 ---
export const findFileByPath = (
  tree: FileNode[],
  path: string,
): FileNode | null => {
  for (const node of tree) {
    if (node.type === "file" && node.path === path) {
      return node;
    }
    if (node.type === "folder" && node.children) {
      const found = findFileByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
};
