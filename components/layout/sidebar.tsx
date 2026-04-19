"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileNode } from "@/lib/file-tree";

export const Sidebar = ({ tree }: { tree: FileNode[] }) => {
  return (
    <div className="w-full h-full bg-[#252526] flex flex-col shrink-0 text-[#CCCCCC]">
      <div
        id="explorer-heading"
        className="h-9 px-4 flex items-center text-[11px] font-bold text-[#BBBBBB] tracking-wide select-none shrink-0"
      >
        EXPLORER
      </div>

      {/* Project Root */}
      <div
        className="flex-1 overflow-y-auto"
        aria-labelledby="explorer-heading"
      >
        <div className="px-1 py-0.5 text-sm font-bold text-[#CCCCCC] flex items-center cursor-pointer hover:bg-[#2A2D2E]">
          <ChevronDown className="w-4 h-4 mr-1" />
          <span className="font-bold text-xs uppercase tracking-wider">
            DARKMOCHA_BLOG
          </span>
        </div>

        <ul className="flex flex-col pb-10">
          {tree.map((node, index) => (
            <TreeNode key={index} node={node} level={1} />
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- TreeNode コンポーネント ---
const TreeNode = ({ node, level }: { node: FileNode; level: number }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen ?? false);
  const pathname = usePathname();

  const handleToggle = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    }
  };

  const isFile = node.type === "file";
  const isActive = isFile && node.path === pathname;

  return (
    <li className="list-none">
      <div
        className={cn(
          "flex items-center py-[3px] cursor-pointer select-none text-[13px] hover:bg-[#2A2D2E] border-l-[1px] border-transparent",
          isActive && isFile ?
            "bg-[#37373D] text-white border-blue-400"
          : "text-[#CCCCCC]",
        )}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleToggle}
        role={node.type === "folder" ? "button" : undefined}
        aria-expanded={node.type === "folder" ? isOpen : undefined}
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
          <Link
            href={node.path}
            className="flex-1 truncate block w-full"
            aria-current={isActive ? "page" : undefined}
          >
            {node.name}
          </Link>
        : <span className="flex-1 truncate">{node.name}</span>}
      </div>

      {node.type === "folder" && isOpen && node.children && (
        <ul className="flex flex-col">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};
