import React from "react";
import Image from "next/image";
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

export default function AboutPage() {
  // 画像パス (publicフォルダ内)
  const profileImageSrc = "/images/About/profile.jpg";
  const coverImageSrc = "/images/About/WinterNight.jpg";

  return (
    <div className="min-h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans pb-20 select-none">
      <div className="w-full h-64 md:h-80 relative bg-[#252526]">
        {/* 画像があれば表示 */}
        <Image
          src={coverImageSrc}
          alt="Cover"
          fill
          className="object-cover opacity-80 object-[center_90%]"
        />

        {/* プレースホルダー: グリッド背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3794ff]/20 to-[#ce9178]/20">
          <div className="absolute inset-0 bg-grid-white/[0.05]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-[#1f1f1f]/60 to-transparent" />
      </div>

      {/* --- Main Content (Overlapping the Header) --- */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-16">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#1e1e1e] border-[6px] border-[#1e1e1e] relative overflow-hidden shadow-2xl shrink-0">
            <Image
              src={profileImageSrc}
              alt="Yuto Nagata"
              fill
              // 変更点: select-none (選択不可) と pointer-events-none (クリックイベント無効化) を追加
              className="object-cover select-none pointer-events-none"
              // 変更点: ドラッグ&ドロップ禁止、右クリックメニュー禁止、iOS長押し保存メニュー禁止を追加
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              style={{ WebkitTouchCallout: "none" }}
            />
            <div className="w-full h-full flex items-center justify-center bg-[#252526]">
              <Coffee className="w-12 h-12 md:w-16 md:h-16 text-[#565656]" />
            </div>
          </div>

          {/* Name & Title */}
          <div className="space-y-2 flex-1 pb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              Yuto Nagata
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-[#858585]">
              <span className="flex items-center gap-1.5 bg-[#1f1f1f]/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
                <MapPin className="w-4 h-4" /> Nagano, Japan
              </span>
              <span className="flex items-center gap-1.5 bg-[#1f1f1f]/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/5">
                <LinkIcon className="w-4 h-4" /> Suwa Tokyo Univ. of Science
              </span>
            </div>
            <p className="text-[#a0a0a0] leading-relaxed max-w-xl mt-2 text-base md:text-lg drop-shadow-sm">
              University Student in Japan. <br />
              Enjoying <span className="text-[#3794ff] font-medium">
                Code
              </span>, <span className="text-[#4ec9b0] font-medium">Games</span>{" "}
              & <span className="text-[#ce9178] font-medium">Travel</span>.
            </p>
          </div>
        </div>

        {/* --- Content Sections --- */}
        <div className="space-y-12">
          {/* Bio Section */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-[#333] pb-2">
              <span className="w-1 h-6 bg-[#3794ff] rounded-full" />
              Bio
            </h2>
            <div className="space-y-4 text-[#cccccc] leading-8 text-[16px]">
              <p>
                長野（Nagano）出身の大学生。
                <br />
                主にWebフロントエンド（Next.js、Reactなど）とUnityを勉強しています。
                <br />
                趣味は音楽・アニメ・ゲーム・テニスです。
              </p>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-[#333] pb-2">
              <span className="w-1 h-6 bg-[#ce9178] rounded-full" />
              Tech Stack
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Web Dev */}
              <div className="bg-[#252526]/40 p-6 rounded-xl border border-white/5 hover:bg-[#252526]/60 transition-colors">
                <div className="flex items-center gap-3 mb-4 text-[#3794ff]">
                  <Code2 className="w-6 h-6" />
                  <span className="font-bold text-lg">Web Development</span>
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
              <div className="bg-[#252526]/40 p-6 rounded-xl border border-white/5 hover:bg-[#252526]/60 transition-colors">
                <div className="flex items-center gap-3 mb-4 text-[#ce9178]">
                  <Gamepad2 className="w-6 h-6" />
                  <span className="font-bold text-lg">Game Development</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <SkillBadge name="Unity" color="bg-white/10 text-white" />
                  <SkillBadge
                    name="C#"
                    color="bg-[#9b4f96]/20 text-[#d075ca]"
                  />
                  <SkillBadge
                    name="C++"
                    color="bg-[#00599c]/20 text-[#5e97d0]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Connect */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-[#333] pb-2">
              <span className="w-1 h-6 bg-[#4ec9b0] rounded-full" />
              Connect
            </h2>
            <div className="flex flex-wrap gap-3">
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
                href="mailto:darkmocha.jp@email.com"
                icon={<Mail className="w-5 h-5" />}
                label="Email"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
