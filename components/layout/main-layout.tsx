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

// 表示するパネルの型定義
export type SidebarView = "explorer" | "toc";

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

  // 現在表示中のビューを管理するState (デフォルトは Explorer)
  const [activeView, setActiveView] = useState<SidebarView>("explorer");
  useEffect(() => {
    if (pathname.startsWith("/blog/")) {
      setActiveView("toc");
    } else {
      setActiveView("explorer");
    }
  }, [pathname]);

  // アイコンクリック時のトグル・切り替え関数
  const handleToggleSidebar = (view: SidebarView) => {
    if (activeView === view && isSidebarOpen) {
      // 同じアイコンが押されたら閉じる
      setIsSidebarOpen(false);
    } else {
      // 違うアイコンが押されたらビューを切り替えて開く
      setActiveView(view);
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-[100dvh] w-screen flex-col bg-[#1e1e1e] text-[#cccccc] overflow-hidden">
      <header className="shrink-0 z-50 w-full relative">
        <TitleBar isMobile={isMobile} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>

      <div className="flex flex-1 overflow-hidden relative md:flex-row">
        <aside aria-label="Activity Bar" className="hidden md:flex flex-col shrink-0 z-20 h-full">
          {/* handleToggleSidebar を渡す */}
          <ActivityBar
            activeView={activeView}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={handleToggleSidebar}
          />
        </aside>

        <nav
          aria-label="Sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-[#252526] border-r border-[#1E1E1E] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-full",
            !isSidebarOpen && "-translate-x-full md:hidden",
            isMobile && "h-full",
          )}
        >
          <div className="md:hidden flex items-center justify-between p-3 border-b border-[#333] text-xs font-bold text-[#CCCCCC]">
            <span className="uppercase">{activeView === "explorer" ? "Explorer" : "Outline"}</span>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* tree と view を渡す */}
          <Sidebar tree={tree} view={activeView} />
        </nav>

        <main className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e] relative h-full overflow-hidden">
          <nav aria-label="Tabs" className="shrink-0">
            <TabBar tree={tree} />
          </nav>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent flex flex-col">
            <div className="flex-1">{children}</div>
            <StatusBar />
          </div>
        </main>
      </div>
    </div>
  );
};