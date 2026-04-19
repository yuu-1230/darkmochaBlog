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
