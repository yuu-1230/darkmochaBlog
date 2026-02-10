import React from "react";
import { GitGraph, X, Bug, Copyright } from "lucide-react";

export const StatusBar = () => {
  return (
    <footer className="h-6 w-full bg-[#007ACC] text-white text-[12px] flex items-center px-3 select-none shrink-0 z-50 overflow-hidden justify-center md:justify-between">
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <a
          href="https://github.com/yuu-1230"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer transition-colors"
        >
          <GitGraph className="w-3 h-3" />
          <span>main*</span>
        </a>
        <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">
          <div className="flex items-center gap-1">
            <X className="w-3 h-3" /> 0
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Bug className="w-3 h-3" /> 0
          </div>
        </div>
      </div>
      <div className="flex items-center opacity-70 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
        <Copyright className="w-3 h-3 mr-1" />
        <span>2026 Yuto Nagata. All rights reserved.</span>
      </div>
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer hidden sm:block transition-colors">
          Ln 12, Col 45
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer hidden sm:block transition-colors">
          UTF-8
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors">
          TypeScript JSX
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer transition-colors mr-1">
          Prettier
        </div>
      </div>
    </footer>
  );
};
