import React from "react";
import { Minus, Square, X } from "lucide-react";

export const TitleBar = () => {
  return (
    <div className="h-8 bg-[#181818] flex items-center justify-between px-3 select-none text-[#CCCCCC] text-[13px] border-b border-[#1E1E1E] w-full shrink-0">
      {/* 左側: VS Code ロゴ */}
      <div className="flex items-center"></div>

      {/* 中央: タイトル  */}
      <div className="font-medium text-xs tracking-wide opacity-90">
        DARKMOCHA_BLOG
      </div>

      {/* 右側: ウィンドウ操作ボタン  */}
      <div className="flex items-center gap-3">
        <Minus className="w-4 h-4 hover:bg-white/10 rounded cursor-pointer p-0.5" />
        <Square className="w-3.5 h-3.5 hover:bg-white/10 rounded cursor-pointer p-0.5" />
        <X className="w-4 h-4 hover:bg-[#E81123] hover:text-white rounded cursor-pointer transition-colors p-0.5" />
      </div>
    </div>
  );
};
