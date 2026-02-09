"use client";

import React, { useState } from "react";
import { ActivityBar } from "@/components/layout/activity-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { TabBar } from "@/components/layout/tab-bar";
import { cn } from "@/lib/utils";
import { FileNode } from "@/lib/file-tree";

export const MainLayout = ({
  children,
  tree,
}: {
  children: React.ReactNode;
  tree: FileNode[];
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-1 overflow-hidden w-full">
      <ActivityBar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={cn(
          "flex flex-col shrink-0 h-full transition-all duration-300",
          !isSidebarOpen && "hidden",
        )}
      >
        <Sidebar tree={tree} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        <TabBar tree={tree} />

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  );
};
