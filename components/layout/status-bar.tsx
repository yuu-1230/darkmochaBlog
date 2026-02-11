import React from "react";
import { GitGraph, X, Bug, Copyright } from "lucide-react";

export const StatusBar = () => {
  return (
    <footer
      aria-label="Status Bar"
      className="h-6 w-full bg-[#007ACC] text-white text-[12px] flex items-center px-3 select-none shrink-0 z-50 overflow-hidden justify-center md:justify-between"
    >
      {/* --- Left Section (Git & Errors) --- */}
      <div
        aria-label="Source Control and Problems"
        className="hidden md:flex items-center gap-3 shrink-0"
      >
        <a
          href="https://github.com/yuu-1230"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Current Branch: main"
          className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"
        >
          <GitGraph className="w-3 h-3" />
          <span>main*</span>
        </a>

        {/* <div> から <button> に変更し、エラー・警告数を読み上げるラベルを追加 */}
        <button
          type="button"
          aria-label="0 Errors, 0 Warnings"
          className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-1">
            <X className="w-3 h-3" /> <span>0</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Bug className="w-3 h-3" /> <span>0</span>
          </div>
        </button>
      </div>

      {/* --- Center Section (Copyright) --- */}
      <div
        aria-label="Copyright Information"
        className="flex items-center opacity-70 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap"
      >
        <Copyright className="w-3 h-3 mr-1" aria-hidden="true" />
        {/* <span> を文章を表す <p> に変更 */}
        <p>2026 Yuto Nagata. All rights reserved.</p>
      </div>

      {/* --- Right Section (Editor Info) --- */}
      <div
        aria-label="Editor Information"
        className="hidden md:flex items-center gap-3 shrink-0"
      >
        {/* すべて <div> から <button> に変更し、設定項目の意味を伝えるラベルを追加 */}
        <button
          type="button"
          aria-label="Go to Line 12, Column 45"
          className="hover:bg-white/20 px-1 rounded cursor-pointer hidden sm:block transition-colors"
        >
          Ln 12, Col 45
        </button>

        <button
          type="button"
          aria-label="Select Encoding: UTF-8"
          className="hover:bg-white/20 px-1 rounded cursor-pointer hidden sm:block transition-colors"
        >
          UTF-8
        </button>

        <button
          type="button"
          aria-label="Select Language Mode: TypeScript JSX"
          className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"
        >
          TypeScript JSX
        </button>

        <button
          type="button"
          aria-label="Code Formatter: Prettier"
          className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors mr-1"
        >
          Prettier
        </button>
      </div>
    </footer>
  );
};
