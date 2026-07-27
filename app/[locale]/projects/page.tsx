"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { projects } from "@/lib/projects";
import { ImageLightbox } from "@/components/image-lightbox";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

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
          {"// projects"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <p className="text-muted-foreground text-sm">
          {t("count", { count: projects.length })}
        </p>
      </motion.header>

      {/* Projects List */}
      <ul className="space-y-12">
        {projects.map((project) => (
          <motion.li
            key={project.id}
            variants={item}
            className="group border-b border-border pb-12 last:border-0 last:pb-0"
          >
            {/* Thumbnail + Content */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Thumbnail */}
              <div
                className={`w-full sm:w-40 shrink-0 aspect-video relative rounded-lg overflow-hidden border border-border bg-muted ${project.image ? "cursor-zoom-in" : ""}`}
                onClick={() => project.image && setLightbox({ src: project.image, alt: project.title })}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 160px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <project.icon className="w-8 h-8 opacity-40" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title + Links */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-3 shrink-0 flex-wrap">
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
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {project.description}
                </p>

                {/* Tech stack */}
                <p className="text-xs text-muted-foreground font-mono">
                  {project.techStack.join("  ·  ")}
                </p>

                {/* Learned */}
                {project.learned && (
                  <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-3 italic">
                    {project.learned}
                  </p>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </motion.div>
  );
}
