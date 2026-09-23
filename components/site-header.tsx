"use client";

import { usePathname } from "@/i18n/navigation";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { MagazineHeader } from "@/components/magazine/MagazineChrome";
import type { Locale } from "@/i18n/routing";

function ThemeToggle() {
  const { resolvedTheme: theme, setTheme } = useTheme();
  const t = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={t("toggleTheme")}
      className="magazine-theme-toggle"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

type SiteHeaderProps = {
  postSlugsByLocale: Partial<Record<Locale, string[]>>;
  showLocalDocs?: boolean;
};

export function SiteHeader({ postSlugsByLocale, showLocalDocs = false }: SiteHeaderProps) {
  const pathname = usePathname();
  return <MagazineHeader home={pathname === "/"} languages={postSlugsByLocale}
    showLocalDocs={showLocalDocs} themeToggle={<ThemeToggle />} />;
}
