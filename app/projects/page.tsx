"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { projects } from "@/lib/projects";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function ProjectsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="py-12 max-w-3xl mx-auto space-y-16"
    >
      {/* Page Header */}
      <motion.header variants={item} className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          // projects
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="text-muted-foreground text-sm">
          {projects.length}件の制作物と、そこで得た学び。
        </p>
      </motion.header>

      {/* Projects List */}
      <ul className="space-y-10">
        {projects.map((project) => (
          <motion.li
            key={project.id}
            variants={item}
            className="group border-b border-border pb-10 last:border-0 last:pb-0"
          >
            {/* Title row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </h2>
              {/* Links */}
              <div className="flex items-center gap-3 shrink-0">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">
              {project.description}
            </p>

            {/* Tech stack — comma-separated, no badges */}
            <p className="text-xs text-muted-foreground font-mono">
              {project.techStack.join("  ·  ")}
            </p>

            {/* Learned */}
            {project.learned && (
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3 italic">
                {project.learned}
              </p>
            )}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
