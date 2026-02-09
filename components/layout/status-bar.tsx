import React from "react";
import { GitGraph, X, Bug } from "lucide-react";

export const StatusBar = () => {
  return (
    <footer className="h-6 w-full bg-[#007ACC] text-white text-[12px] flex items-center px-3 justify-between select-none shrink-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
          <GitGraph className="w-3 h-3" />
          <span>main*</span>
        </div>
        <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer">
          <div className="flex items-center gap-1">
            <X className="w-3 h-3" /> 0
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Bug className="w-3 h-3" /> 0
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mr-2">
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer hidden sm:block">
          Ln 12, Col 45
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer hidden sm:block">
          UTF-8
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
          TypeScript JSX
        </div>
        <div className="hover:bg-white/20 px-1 rounded cursor-pointer">
          Prettier
        </div>
      </div>
    </footer>
  );
};
