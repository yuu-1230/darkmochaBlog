"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, FileType } from "lucide-react";
import { cn } from "@/lib/utils";

// --- 1. アイコンコンポーネントを先に定義
const TSXIcon = ({ color }: { color: "blue" | "yellow" }) => (
  <span
    className={cn(
      "text-[10px] font-bold w-4 text-center",
      color === "blue" ? "text-[#519aba]" : "text-[#CBCB41]",
    )}
  >
    TSX
  </span>
);
const HashIcon = () => (
  <span className="text-[10px] text-[#A074C4] font-bold w-4 text-center">
    #
  </span>
);
const MDIcon = () => (
  <span className="text-[10px] text-[#CCCCCC] font-bold w-4 text-center flex items-center justify-center">
    <FileType className="w-3 h-3 text-[#519aba]" />
  </span>
);
const NodeIcon = () => (
  <span className="text-[10px] text-[#80BD01] font-bold w-4 text-center">
    {"{}"}
  </span>
);
const InfoIcon = () => (
  <span className="text-[10px] text-[#519aba] font-bold w-4 text-center">
    i
  </span>
);

// --- 2. 型定義 ---
type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string;
  icon?: React.ReactNode;
  children?: FileNode[];
  isOpen?: boolean;
};

// --- 3. ツリー構造の定義  ---
const initialTree: FileNode[] = [
  {
    name: "app",
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "layout.tsx",
        type: "file",
        path: "/layout-visual",
        icon: <TSXIcon color="blue" />,
      },
      {
        name: "page.tsx",
        type: "file",
        path: "/",
        icon: <TSXIcon color="yellow" />,
      },
      { name: "globals.css", type: "file", path: "/css", icon: <HashIcon /> },
    ],
  },
  {
    name: "components",
    type: "folder",
    isOpen: false,
    children: [
      {
        name: "typewriter.tsx",
        type: "file",
        path: "/components/typewriter",
        icon: <TSXIcon color="blue" />,
      },
      {
        name: "sidebar.tsx",
        type: "file",
        path: "/components/sidebar",
        icon: <TSXIcon color="blue" />,
      },
    ],
  },
  {
    name: "content",
    type: "folder",
    isOpen: true,
    children: [
      {
        name: "posts",
        type: "folder",
        isOpen: true,
        children: [
          {
            name: "hello-world.mdx",
            type: "file",
            path: "/blog/hello",
            icon: <MDIcon />,
          },
          {
            name: "darkmocha-theme.mdx",
            type: "file",
            path: "/blog/test",
            icon: <MDIcon />,
          },
        ],
      },
    ],
  },
  { name: "package.json", type: "file", path: "/package", icon: <NodeIcon /> },
  { name: "readme.md", type: "file", path: "/about", icon: <InfoIcon /> },
];

// --- 4. Sidebar コンポーネント本体 ---
export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#252526] border-r border-[#1E1E1E] hidden md:flex flex-col shrink-0 text-[#CCCCCC]">
      {/* Explorer Header */}
      <div className="h-9 px-4 flex items-center text-[11px] font-bold text-[#BBBBBB] tracking-wide select-none">
        EXPLORER
      </div>

      {/* Project Root */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-1 py-0.5 text-sm font-bold text-[#CCCCCC] flex items-center cursor-pointer hover:bg-[#2A2D2E]">
          <ChevronDown className="w-4 h-4 mr-1" />
          <span className="font-bold text-xs uppercase tracking-wider">
            DARKMOCHA_BLOG
          </span>
        </div>

        {/* Recursive Tree Rendering */}
        <div className="flex flex-col">
          {initialTree.map((node, index) => (
            <TreeNode key={index} node={node} level={1} />
          ))}
        </div>
      </div>
    </aside>
  );
};

// --- 5. ツリーノード (再帰描画用) ---
const TreeNode = ({ node, level }: { node: FileNode; level: number }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen ?? false);
  const pathname = usePathname();

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    }
  };

  const isFile = node.type === "file";
  // 現在のパスと一致するか判定
  const isActive =
    node.path === pathname ||
    (node.path !== "/" && pathname.startsWith(node.path || "###"));

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-[3px] cursor-pointer select-none text-[13px] hover:bg-[#2A2D2E] border-l-[1px] border-transparent",
          isActive && isFile ?
            "bg-[#37373D] text-white border-blue-400"
          : "text-[#CCCCCC]",
        )}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleToggle}
      >
        <span className="mr-1.5 opacity-80 shrink-0">
          {node.type === "folder" ?
            isOpen ?
              <ChevronDown className="w-4 h-4" />
            : <ChevronRight className="w-4 h-4" />
          : <span className="w-4 h-4 inline-block" />}
        </span>

        {node.icon && <span className="mr-1.5 shrink-0">{node.icon}</span>}

        {isFile && node.path ?
          <Link href={node.path} className="flex-1 truncate">
            {node.name}
          </Link>
        : <span className="flex-1 truncate">{node.name}</span>}
      </div>

      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
