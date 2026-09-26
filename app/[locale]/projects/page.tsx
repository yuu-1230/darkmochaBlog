"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import { projects } from "@/lib/projects";
import type { Locale } from "@/i18n/routing";
import { ImageLightbox } from "@/components/image-lightbox";
import { resolveImageUrl } from "@/lib/image-url";
import { EditorialPageHeader } from "@/components/magazine/EditorialPageHeader";

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const locale = useLocale() as Locale;
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="editorial-index">
      <EditorialPageHeader
        title="Projects"
        description={locale === "ja" ? "これまでにつくったものと、そこから学んだこと。" : "Things I have made and what they taught me."}
        meta={t("count", { count: projects.length })}
      />

      <ul className="editorial-project-grid">
        {projects.map((project) => (
          <li
            key={project.id}
            className="editorial-project-card group"
          >
            {project.image ? (
              <button
                type="button"
                className="editorial-project-image"
                onClick={() => setLightbox({ src: project.image!, alt: project.title })}
                aria-label={`${project.title} image`}
              >
                  <Image
                    src={resolveImageUrl(project.image)}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, 42vw"
                  />
              </button>
            ) : (
              <div className="editorial-project-image editorial-project-placeholder">
                <project.icon className="w-8 h-8" />
              </div>
            )}

              <div className="editorial-project-copy">
                <div className="editorial-project-heading">
                  <h2>
                    {project.title}
                  </h2>
                  <div className="editorial-project-links">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>

                <p className="editorial-project-description">
                  {project.description[locale]}
                </p>

                <p className="editorial-project-stack">
                  {project.techStack.join("  ·  ")}
                </p>

                {project.learned[locale] && (
                  <p className="editorial-project-learned">
                    {project.learned[locale]}
                  </p>
                )}
              </div>
          </li>
        ))}
      </ul>

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
