"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { SearchDialog } from "@/components/search-dialog";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/routing";
import { useEffect, useRef, type ReactNode } from "react";

export function MagazineHeader({ home, languages, themeToggle, showLocalDocs = false }: {
  home: boolean; languages: Partial<Record<Locale, string[]>>; themeToggle: ReactNode; showLocalDocs?: boolean;
}) {
  const ja = useLocale() === "ja";
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const links = [
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/travel", label: "Travel" },
    { href: "/notes-timeline", label: "Notes" },
    ...(showLocalDocs ? [{ href: "/docs", label: "Docs" }] : []),
  ];
  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  useEffect(() => { menuRef.current?.removeAttribute("open"); }, [pathname]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) menuRef.current?.removeAttribute("open");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuRef.current?.open) {
        menuRef.current.removeAttribute("open");
        menuRef.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  return (
    <header className={`magazine-header ${home ? "magazine-masthead" : "magazine-reader-header"}`}>
      {home && <p className="magazine-header-note">{ja ? "つくること、学ぶこと。" : "Making, learning."}<br />{ja ? "ときどき、旅のこと。" : "And a little travel."}</p>}
      <Link href="/" className="magazine-brand">Darkmocha</Link>
      <nav className="magazine-nav" aria-label={ja ? "サイトナビゲーション" : "Site navigation"}>
        <Link href="/blog" aria-current={current("/blog") ? "page" : undefined}>{ja ? "記事一覧" : "Journal"}</Link>
        <details className="magazine-menu" ref={menuRef} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.removeAttribute("open");
        }}>
          <summary>{ja ? "メニュー" : "Menu"}<span aria-hidden="true">＋</span></summary>
          <div className="magazine-menu-links">
            {links.map(({ href, label }) => <Link key={href} href={href}
              aria-current={current(href) ? "page" : undefined}
              onClick={() => menuRef.current?.removeAttribute("open")}>{label}</Link>)}
          </div>
        </details>
        <SearchDialog />
        {themeToggle}
        <LanguageSwitcher postSlugsByLocale={languages} />
      </nav>
    </header>
  );
}

export function MagazineFooter() {
  const locale = useLocale();
  return (
    <footer className="magazine-footer">
      <div><Link href="/" className="magazine-footer-brand">Darkmocha</Link><p>Tech, Unity & Life</p></div>
      <nav aria-label={locale === "ja" ? "関連ページ" : "More from Darkmocha"}>
        <Link href="/blog">{locale === "ja" ? "すべての記事" : "All articles"}</Link>
        <Link href="/notes-timeline">Notes</Link><Link href="/projects">Projects</Link><Link href="/travel">Travel</Link>
        <a href={locale === "en" ? "/en/feed.xml" : "/feed.xml"}>RSS</a>
      </nav>
      <div className="magazine-footer-social"><nav aria-label="Social links">
        <a href="https://github.com/yuu-1230">GitHub</a><a href="https://x.com/DarkmochaJP">X</a><a href="https://zenn.dev/darkmocha">Zenn</a><a href="https://qiita.com/darkmocha">Qiita</a><a href="https://v1.darkmocha.dev">v1</a>
      </nav><p>© Yuto Nagata 2026</p></div>
    </footer>
  );
}
