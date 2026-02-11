import React from "react";
import Image from "next/image";
import { Minus, Square, X, Menu } from "lucide-react";

interface TitleBarProps {
  isMobile?: boolean;
  onToggleSidebar?: () => void;
}

export const TitleBar = ({
  isMobile = false,
  onToggleSidebar,
}: TitleBarProps) => {
  return (
    <div
      aria-label="Window Title Bar"
      className="h-10 md:h-8 bg-[#181818] flex items-center justify-between px-3 select-none text-[#CCCCCC] text-[13px] border-b border-[#1E1E1E] w-full shrink-0"
    >
      {/* 左側: メニューボタン & アプリアイコン & タイトル */}
      <div className="flex items-center gap-3">
        {/* スマホのみメニューボタンを表示 */}
        {isMobile && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar"
            className="p-1 hover:bg-[#333] rounded text-[#CCCCCC] outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <Image
            src="/icon.png"
            alt="Darkmocha Icon"
            width={16}
            height={16}
            className="rounded-sm opacity-90"
          />
          {/* サイト名 */}
          <h1 className="font-medium text-xs tracking-wide opacity-90 truncate m-0">
            DARKMOCHA_BLOG
          </h1>
          <Image
            src="/icon.png"
            alt="Darkmocha Icon"
            width={16}
            height={16}
            className="rounded-sm opacity-90"
          />
        </div>
      </div>

      {/* 右側: ウィンドウ操作ボタン (PCのみ表示) */}
      {!isMobile && (
        <div
          role="group"
          aria-label="Window Controls"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            aria-label="Minimize"
            className="hover:bg-white/10 rounded cursor-pointer p-1 outline-none flex items-center justify-center transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            aria-label="Maximize"
            className="hover:bg-white/10 rounded cursor-pointer p-1 outline-none flex items-center justify-center transition-colors"
          >
            <Square className="w-3 h-3" />
          </button>

          <button
            type="button"
            aria-label="Close"
            className="hover:bg-[#E81123] hover:text-white rounded cursor-pointer p-1 outline-none flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
