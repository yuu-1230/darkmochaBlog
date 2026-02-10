import React from "react";
import { FileType } from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. アイコン定義 (そのまま) ---
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

// --- 2. 型定義 (そのまま) ---
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
  posts: { slug: string; frontmatter: { title: string } }[],
): FileNode[] => {
  // 記事データをFileNode形式に変換
  const articleNodes: FileNode[] = posts.map((post) => ({
    name: `${post.slug}.mdx`, // ファイル名っぽく表示
    type: "file",
    path: `/blog/${post.slug}`,
    icon: <MDIcon />,
  }));

  return [
    // 1. About me
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

    // 2. Articles (ここに動的データを注入！)
    {
      name: "Articles",
      type: "folder",
      isOpen: true,
      children: [
        {
          name: "latest_posts.tsx",
          type: "file",
          path: "/",
          icon: <TSXIcon color="yellow" />,
        },
        ...articleNodes,
      ],
    },

    // 3. Unity
    {
      name: "Unity_Projects",
      type: "folder",
      isOpen: false,
      children: [
        {
          name: "TankGame_v0.1.exe",
          type: "file",
          path: "/projects/tank",
          icon: <CSharpIcon />,
        },
        {
          name: "WebcamBot.cs",
          type: "file",
          path: "/projects/bot",
          icon: <CSharpIcon />,
        },
      ],
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
