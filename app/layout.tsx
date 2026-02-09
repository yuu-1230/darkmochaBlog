import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";
import {
  Files,
  Search,
  GitGraph,
  Bug,
  Settings,
  UserCircle,
  X,
} from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Darkmocha Blog",
  description: "VS Code Styled Engineer Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col`}
      >
        {/* --- 上部エリア (Activity Bar + Sidebar + Main Editor) --- */}
        <div className="flex flex-1 overflow-hidden w-full">
          {/* 1. Activity Bar (左端) */}
          <aside className="w-12 bg-[#333333] flex flex-col items-center py-4 z-40 shrink-0 select-none h-full border-r border-[#252526]">
            <div className="flex flex-col gap-6 w-full items-center">
              <div className="cursor-pointer border-l-2 border-white w-full flex justify-center py-1">
                <Files className="w-6 h-6 text-white" />
              </div>
              <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center">
                <Search className="w-6 h-6 text-[#858585]" />
              </div>
              <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center">
                <GitGraph className="w-6 h-6 text-[#858585]" />
              </div>
              <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center">
                <Bug className="w-6 h-6 text-[#858585]" />
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-6 mb-4 w-full items-center">
              <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center">
                <UserCircle className="w-6 h-6 text-[#858585]" />
              </div>
              <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center">
                <Settings className="w-6 h-6 text-[#858585]" />
              </div>
            </div>
          </aside>

          {/* 2. Sidebar (Explorer) */}
          <Sidebar />

          {/* 3. Main Editor Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-background relative">
            {/* Tab Bar */}
            <header className="h-9 bg-[#252526] flex items-center overflow-x-auto select-none scrollbar-hide shrink-0">
              <div className="h-full bg-[#1E1E1E] px-3 flex items-center min-w-fit border-t border-t-transparent border-r border-r-[#252526] pr-2 relative group cursor-pointer">
                <span className="text-yellow-400 mr-2 text-xs">TSX</span>
                <span className="text-sm text-[#ffffff] mr-2">page.tsx</span>
                <X className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-0.5" />
              </div>
              <div className="h-full bg-transparent px-3 flex items-center min-w-fit border-r border-r-[#252526] pr-2 text-[#969696] hover:bg-[#2A2D2E] cursor-pointer">
                <span className="text-blue-400 mr-2 text-xs">TSX</span>
                <span className="text-sm italic">layout.tsx</span>
              </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
              {children}
            </div>
          </main>
        </div>

        {/* --- 4. Status Bar (最下部・全幅) --- */}
        <footer className="h-6 w-full bg-secondary text-white text-[12px] flex items-center px-3 justify-between select-none shrink-0 z-50 border-t border-[#007ACC]">
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
      </body>
    </html>
  );
}
