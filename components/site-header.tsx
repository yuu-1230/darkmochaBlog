"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "blog", href: "/blog" },
  { label: "notes", href: "/notes" },
  { label: "travel", href: "/travel" },
  { label: "project", href: "/projects" },
  { label: "about", href: "/about" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // ハイドレーション対策: マウント後にのみ表示
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

export const SiteHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm"
    >
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
        >
          <Coffee className="w-4 h-4 text-primary" />
          <span className="text-sm tracking-tight">darkmocha.dev</span>
        </Link>

        {/* Right: Nav + Theme Toggle */}
        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-0.5 mr-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
              >
                [{item.label}]
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};
