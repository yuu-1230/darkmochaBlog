import React from "react";
import {
  Github,
  Twitter,
  Mail,
  MapPin,
  Link as LinkIcon,
  Coffee,
  Code2,
  Gamepad2,
} from "lucide-react";
import { FaBluesky } from "react-icons/fa6";

const SkillBadge = ({ name, color }: { name: string; color: string }) => (
  <span
    className={`px-2.5 py-1 rounded-md text-xs font-medium font-mono border border-white/5 ${color}`}
  >
    {name}
  </span>
);

const SocialButton = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-4 py-2.5 bg-[#252526]/50 hover:bg-[#3794ff] hover:text-white border border-white/5 rounded-xl transition-all duration-200 text-[#cccccc] text-sm group"
  >
    <span className="opacity-70 group-hover:opacity-100">{icon}</span>
    <span>{label}</span>
  </a>
);

// --- Main Page Component ---

export default function AboutPage() {
  return (
    <div className="min-h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans overflow-y-auto p-6 md:p-12 select-none">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* --- Header: Profile --- */}
        <section className="flex flex-col md:flex-row gap-8 items-start md:items-center border-b border-white/5 pb-12">
          {/* Avatar Placeholder */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#252526] border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
            <Coffee className="w-10 h-10 md:w-12 md:h-12 text-[#565656]" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Yuto Nagata
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[#858585]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Nagano, Japan
              </span>
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" /> Public Univ. of Suwa
              </span>
            </div>
            <p className="text-[#a0a0a0] leading-relaxed max-w-xl">
              Web Developer & Game Creator. <br />I love building things with{" "}
              <span className="text-[#3794ff]">Code</span> and{" "}
              <span className="text-[#ce9178]">Coffee</span>.
            </p>
          </div>
        </section>

        {/* --- Bio Section --- */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-[#3794ff] rounded-full" />
            Bio
          </h2>
          <div className="space-y-4 text-[#cccccc] leading-7 bg-[#252526]/30 p-6 rounded-2xl border border-white/5">
            <p>
              長野（Nagano）出身の大学生です。
              主にWebフロントエンド（Next.js、Reactなど）とUnityを使ったゲーム開発に興味があり、個人開発・チーム開発を続けています。
            </p>
            <p>音楽・アニメ・ゲーム・テニス好きです。</p>
          </div>
        </section>

        {/* --- Tech Stack --- */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-[#ce9178] rounded-full" />
            Tech Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Web Dev */}
            <div className="bg-[#252526]/30 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-[#3794ff]">
                <Code2 className="w-5 h-5" />
                <span className="font-bold">Web Development</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <SkillBadge
                  name="React"
                  color="bg-[#149eca]/20 text-[#149eca]"
                />
                <SkillBadge name="Next.js" color="bg-white/10 text-white" />
                <SkillBadge
                  name="TypeScript"
                  color="bg-[#3178c6]/20 text-[#3178c6]"
                />
                <SkillBadge
                  name="Tailwind CSS"
                  color="bg-[#38bdf8]/20 text-[#38bdf8]"
                />
                <SkillBadge
                  name="Python"
                  color="bg-[#ffde57]/20 text-[#e6c02a]"
                />
              </div>
            </div>

            {/* Game Dev */}
            <div className="bg-[#252526]/30 p-5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-3 text-[#ce9178]">
                <Gamepad2 className="w-5 h-5" />
                <span className="font-bold">Game Development</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <SkillBadge name="Unity" color="bg-white/10 text-white" />
                <SkillBadge name="C#" color="bg-[#9b4f96]/20 text-[#d075ca]" />
                <SkillBadge name="C++" color="bg-[#00599c]/20 text-[#5e97d0]" />
              </div>
            </div>
          </div>
        </section>

        {/* --- Connect --- */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-1 h-6 bg-[#4ec9b0] rounded-full" />
            Connect
          </h2>
          <div className="flex flex-wrap gap-4">
            <SocialButton
              href="https://github.com/yuu-1230"
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
            />
            <SocialButton
              href="https://bsky.app/profile/darkmochajapan.bsky.social"
              icon={<FaBluesky className="w-5 h-5" />}
              label="Bluesky"
            />
            <SocialButton
              href="https://twitter.com/DarkmochaJP"
              icon={<Twitter className="w-5 h-5" />}
              label="Twitter"
            />
            <SocialButton
              href="darkmocha.jp@email.com"
              icon={<Mail className="w-5 h-5" />}
              label="Email"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
