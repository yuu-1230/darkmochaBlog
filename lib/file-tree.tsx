import React from "react";
import { FileType } from "lucide-react";
import { cn } from "@/lib/utils";

// --- 共通アイコンコンポーネント ---
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

// ---  型定義 ---
export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  icon?: React.ReactNode;
  children?: FileNode[];
  isOpen?: boolean;
};

// --- ファイルツリーの定義  ---
export const fileTree: FileNode[] = [
  // About me
  {
    name: "About_me.md",
    type: "file",
    path: "/about",
    icon: <InfoIcon />,
  },

  // Articles
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
      {
        name: "hello-world.mdx",
        type: "file",
        path: "/blog/hello",
        icon: <MDIcon />,
      },
      // 記事が増えたらここに追加
    ],
  },

  // Unity
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

  // Config
  { name: "package.json", type: "file", path: "/package", icon: <JsonIcon /> },
];

// --- 4. パスからファイル情報を探すヘルパー関数 ---
export const findFileByPath = (
  path: string,
  nodes: FileNode[] = fileTree,
): FileNode | null => {
  for (const node of nodes) {
    // ファイルかつパスが一致する場合
    if (node.type === "file" && node.path === path) {
      return node;
    }
    // フォルダなら再帰的に探索
    if (node.type === "folder" && node.children) {
      const found = findFileByPath(path, node.children);
      if (found) return found;
    }
  }
  return null;
};
