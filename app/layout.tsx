import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {
  Files,
  Search,
  GitGraph,
  Bug,
  Settings,
  UserCircle,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar"; // 作成済み
import { TabBar } from "@/components/layout/tab-bar"; // 今回追加
import { StatusBar } from "@/components/layout/status-bar"; // 今回追加

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col`}
      >
        {/* --- 上部エリア --- */}
        <div className="flex flex-1 overflow-hidden w-full">
          {/* Activity Bar */}
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

          {/*  Sidebar (Explorer) */}
          <Sidebar />

          {/*  Main Editor Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-background relative">
            <TabBar />

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
              {children}
            </div>
          </main>
        </div>

        {/* --- Status Bar (最下部) --- */}
        <StatusBar />
      </body>
    </html>
  );
}
