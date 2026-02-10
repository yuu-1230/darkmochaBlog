import React from "react";
import Image from "next/image";
import { projects } from "@/lib/projects";
import { Download, Globe } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="h-full w-full bg-[#1e1e1e] text-[#cccccc] font-sans overflow-y-auto p-6 md:p-12 select-none scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4 relative z-0">
        <div>
          <h1 className="text-2xl font-medium text-white mb-1">Projects</h1>
          <p className="text-sm text-[#858585]">
            A collection of {projects.length} works.
          </p>
        </div>
      </div>

      {/* Projects List (Grid) */}
      <div className="flex flex-col gap-6 relative z-0">
        {projects.map((project) => (
          <div
            key={project.id}
            // ホバー時にカード全体を少し手前に、影を強調
            className="bg-[#252526] hover:bg-[#2a2d2e] border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row gap-0 transition-all duration-300 group relative h-auto hover:z-10 hover:shadow-md"
          >
            {/* --- Left: Image Area --- */}
            <div
              // カードの角丸に合わせて調整
              className="w-full md:w-80 h-64 md:h-auto shrink-0 bg-[#1e1e1e] relative flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5 p-4 rounded-t-xl md:rounded-l-xl md:rounded-tr-none group-hover:z-20 transition-all"
            >
              {project.image ?
                // 画像がある場合
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105 rounded-t-xl md:rounded-l-xl md:rounded-tr-none group-hover:shadow-md"
                />
              : <project.icon className="w-16 h-16 text-[#cccccc] opacity-50 group-hover:scale-105 transition-transform duration-500" />
              }
            </div>

            {/* --- Right: Content Area --- */}
            <div className="flex-1 min-w-0 flex flex-col p-4 md:p-6 bg-[#252526] group-hover:bg-[#2a2d2e] transition-colors rounded-b-xl md:rounded-r-xl md:rounded-bl-none relative z-0">
              {/* Header: Title & Links */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white group-hover:text-[#3794ff] transition-colors leading-tight">
                    {project.title}
                  </h2>
                  <p className="text-xs text-[#858585] font-mono mt-1">
                    {project.id}
                  </p>
                </div>

                {/* Links (Buttons) */}
                <div className="flex flex-wrap gap-2 shrink-0 relative z-10">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs font-medium flex items-center gap-1.5 transition-colors rounded-sm shadow-sm hover:shadow-md"
                    >
                      {link.label === "GitHub" || link.label === "AppStore" ?
                        <Download className="w-3.5 h-3.5" />
                      : <Globe className="w-3.5 h-3.5" />}
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#cccccc] leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-[#3c3c3c] text-[#ce9178] text-[11px] font-mono rounded-sm border border-white/5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* "What I Learned" Section */}
              <div className="pt-3 border-t border-white/5 -mx-4 -mb-4 md:-mx-6 md:-mb-6 px-4 md:px-6 pb-4 mt-auto bg-[#252526] group-hover:bg-[#2a2d2e] transition-colors rounded-b-xl md:rounded-br-xl">
                <p className="text-[11px] text-[#858585] font-mono mb-1.5">
                  <span className="text-[#4ec9b0]">const</span>{" "}
                  <span className="text-[#9cdcfe]">learned</span> =
                </p>
                <p className="text-xs text-[#a0a0a0] pl-3 border-l-2 border-[#4ec9b0]/30 italic leading-relaxed">
                  &quot;{project.learned}&quot;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
