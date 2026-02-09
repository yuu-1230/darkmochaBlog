"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fileTree, FileNode } from "@/lib/file-tree";

export const Sidebar = () => {
  return (
    <aside className="w-64 h-full bg-[#252526] border-r border-[#1E1E1E] hidden md:flex flex-col shrink-0 text-[#CCCCCC]">
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

        {/* Recursive Tree Rendering: データは fileTree から取得 */}
        <div className="flex flex-col">
          {fileTree.map((node, index) => (
            <TreeNode key={index} node={node} level={1} />
          ))}
        </div>
      </div>
    </aside>
  );
};

// TreeNode コンポーネントはそのまま (Iconなどの定義は消してOK)
const TreeNode = ({ node, level }: { node: FileNode; level: number }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen ?? false);
  const pathname = usePathname();

  const handleToggle = () => {
    if (node.type === "folder") setIsOpen(!isOpen);
  };

  const isFile = node.type === "file";
  // 完全一致判定に変更（ツリー構造とURLを1対1にするため）
  const isActive = node.path === pathname;

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
