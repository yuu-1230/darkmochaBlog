"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  MapPin,
  Github,
  Twitter,
  Mail,
  ExternalLink,
} from "lucide-react";
import { FaBluesky } from "react-icons/fa6";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const techCategories = [
  {
    label: "Web Frontend",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Game Dev",
    skills: ["Unity", "C#", "C++"],
  },
  {
    label: "Other",
    skills: ["Python", "GitHub Actions", "Firebase", "LLM/AI"],
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/yuu-1230",
    icon: <Github className="w-4 h-4" />,
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/DarkmochaJP",
    icon: <Twitter className="w-4 h-4" />,
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/darkmochajapan.bsky.social",
    icon: <FaBluesky className="w-4 h-4" />,
  },
  {
    label: "Email",
    href: "mailto:darkmocha.jp@email.com",
    icon: <Mail className="w-4 h-4" />,
  },
];

export default function AboutPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="py-12 max-w-3xl mx-auto space-y-16"
    >
      {/* ── Hero ── */}
      <motion.header variants={item} className="flex flex-col md:flex-row gap-8 items-start border-b border-border pb-12">
        {/* Profile image */}
        <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-border bg-muted">
          <Image
            src="/images/About/profile.jpg"
            alt="Yuto Nagata"
            width={112}
            height={112}
            className="object-cover w-full h-full select-none pointer-events-none"
            draggable={false}
          />
        </div>

        <div className="space-y-3 flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Yuto Nagata
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Nagano, Japan
            </span>
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5" />
              Suwa Tokyo Univ. of Science
            </span>
          </div>
          <p className="text-foreground/80 leading-relaxed">
            University Student in Japan.
            Enjoying{" "}
            <span className="text-primary font-medium">Code</span>,{" "}
            <span className="text-primary font-medium">Games</span> &{" "}
            <span className="text-primary font-medium">Travel</span>.
          </p>
        </div>
      </motion.header>

      {/* ── Bio ── */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span className="text-primary/60">{"//"}</span>
          Bio
        </h2>
        <div className="space-y-4 text-foreground/85 leading-8 text-[15px]">
          <p>
            長野（Nagano）出身の大学生。主にWebフロントエンド（Next.js、Reactなど）とUnityを勉強しています。
          </p>
          <p>
            学生ITコミュニティ・PlayGroundや、ハッカソンなどで開発経験を積んでいます。小中学生向けのプログラミング講師としての活動も行っています。
          </p>
          <p>
            趣味は音楽・アニメ・ゲーム・テニス・旅行。
          </p>
        </div>
      </motion.section>

      {/* ── Tech Stack ── */}
      <motion.section variants={item} className="space-y-6">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span className="text-primary/60">{"//"}</span>
          Tech Stack
        </h2>
        <div className="space-y-5">
          {techCategories.map((cat) => (
            <div key={cat.label} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
              <span className="text-xs font-mono text-muted-foreground shrink-0 w-32">
                {cat.label}
              </span>
              <p className="text-sm text-foreground/85">
                {cat.skills.join("  ·  ")}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Connect ── */}
      <motion.section variants={item} className="space-y-6">
        <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
          <span className="text-primary/60">{"//"}</span>
          Connect
        </h2>
        <ul className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                  {link.icon}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.section>
    </motion.div>
  );
}
