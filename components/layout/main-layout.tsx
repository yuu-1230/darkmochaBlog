"use client"; // これが重要！(ブラウザで動く機能を持たせる宣言)

import React, { useState } from "react";
import { ActivityBar } from "@/components/layout/activity-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { TabBar } from "@/components/layout/tab-bar";
import { cn } from "@/lib/utils";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  // サイドバーの開閉状態 (初期値: true = 開いている)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-1 overflow-hidden w-full">
      {/* 1. Activity Bar (左端) */}
      <ActivityBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 2. Sidebar (Explorer) */}
      {/* hidden クラスで隠すことで、フォルダの開閉状態を維持したまま非表示にできます */}
      <div
        className={cn(
          "flex flex-col shrink-0 transition-all duration-300",
          !isSidebarOpen && "hidden",
        )}
      >
        <Sidebar />
      </div>

      {/* 3. Main Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Tab Bar */}
        <TabBar />

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
};
