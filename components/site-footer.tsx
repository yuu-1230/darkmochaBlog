"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SiGithub, SiX, SiZenn, SiQiita } from "react-icons/si";
import { Archive } from "lucide-react";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/yuu-1230", icon: <SiGithub className="w-4 h-4" /> },
  { label: "X", href: "https://x.com/DarkmochaJP", icon: <SiX className="w-4 h-4" /> },
  { label: "Zenn", href: "https://zenn.dev/darkmocha", icon: <SiZenn className="w-4 h-4" /> },
  { label: "Qiita", href: "https://qiita.com/darkmocha", icon: <SiQiita className="w-4 h-4" /> },
];

export const SiteFooter = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t border-border mt-16"
    >
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Left */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <span>© Yuto Nagata 2026</span>
          <Link
            href="https://v1.darkmocha.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs hover:text-foreground transition-colors group"
          >
            <Archive className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            Go back in time (v1)
          </Link>
        </div>

        {/* Right: Social */}
        <nav className="flex items-center gap-4" aria-label="Social links">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="hover:text-foreground transition-colors"
            >
              {link.icon}
            </Link>
          ))}
        </nav>
      </div>
    </motion.footer>
  );
};
