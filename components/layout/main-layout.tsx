"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ActivityBar } from "@/components/layout/activity-bar";
import { TitleBar } from "@/components/layout/title-bar";
import { TabBar } from "@/components/layout/tab-bar";
import { StatusBar } from "@/components/layout/status-bar";
import { X } from "lucide-react";
import { FileNode } from "@/lib/file-tree";
import { cn } from "@/lib/utils";

export const MainLayout = ({
  children,
  tree,
}: {
  children: React.ReactNode;
  tree: FileNode[];
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    // ■ 画面全体レイアウト: 縦方向
    <div className="flex h-[100dvh] w-screen flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden">
      {/* 1. Title Bar */}
      <div className="shrink-0 z-50 w-full relative">
        <TitleBar
          isMobile={isMobile}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* 2. Workspace Area */}
      <div className="flex flex-1 overflow-hidden relative md:flex-row">
        {/* Activity Bar (PCのみ) */}
        <div className="hidden md:flex flex-col shrink-0 z-20 h-full">
          <ActivityBar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-[#252526] border-r border-[#1E1E1E] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-full",
            !isSidebarOpen && "-translate-x-full md:hidden",
            isMobile && "h-full",
          )}
        >
          {/* スマホ用: 閉じるボタン */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-[#333] text-xs font-bold text-[#CCCCCC]">
            <span>EXPLORER</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <Sidebar tree={tree} />
        </div>

        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative h-full overflow-hidden">
          {/* TabBar */}
          <div className="shrink-0">
            <TabBar tree={tree} />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent flex flex-col">
            {/* コンテンツ本体 */}
            <div className="flex-1">{children}</div>

            {/* 最下部のステータスバー */}
            <StatusBar />
          </div>
        </main>
      </div>
    </div>
  );
};
