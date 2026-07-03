"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Coffee, X, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { SearchDialog } from "@/components/search-dialog";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const navItems = [
  { label: "blog",    href: "/blog" },
  { label: "notes",  href: "/notes-timeline" },
  { label: "travel", href: "/travel" },
  { label: "project",href: "/projects" },
  { label: "about",  href: "/about" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export const SiteHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const drawerRef = useFocusTrap<HTMLElement>(open);

  // パス変更でメニューを閉じる
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); }, [pathname]);

  // メニュー開閉中は body スクロールをロック
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape でメニューを閉じる
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base text-foreground hover:text-primary transition-colors"
          >
            <Coffee className="w-4 h-4 text-primary" />
            darkmocha.dev
          </Link>

          <div className="flex items-center gap-1">
            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 mr-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative inline-block font-mono text-xs transition-colors pb-0.5 ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </Link>
              ))}
            </nav>

            <SearchDialog />
            <ThemeToggle />

            {/* Hamburger button (mobile only) */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={open}
              className="md:hidden ml-1 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer panel */}
            <motion.nav
              key="drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-64 bg-background border-l border-border shadow-xl md:hidden flex flex-col"
              aria-label="モバイルナビゲーション"
            >
              {/* Drawer header */}
              <div className="h-14 flex items-center justify-between px-5 border-b border-border">
                <span className="font-bold text-sm flex items-center gap-2 text-foreground">
                  <Coffee className="w-4 h-4 text-primary" />
                  darkmocha.dev
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="メニューを閉じる"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <ul className="flex flex-col py-4 px-3 gap-1 flex-1">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span className="text-primary/50 text-xs">{"//"}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-border text-xs font-mono text-muted-foreground">
                © Yuto Nagata 2026
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
