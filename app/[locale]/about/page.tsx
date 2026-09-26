"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  MapPin,
  Github,
  Twitter,
  Mail,
  ExternalLink,
} from "lucide-react";
import { FaBluesky } from "react-icons/fa6";
import { resolveImageUrl } from "@/lib/image-url";

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
  const t = useTranslations("about");

  return (
    <div className="editorial-index editorial-about">
      <header className="editorial-about-hero">
        <div className="editorial-profile-image">
          <Image
            src={resolveImageUrl("/images/About/profile.jpg")}
            alt="Yuto Nagata"
            width={112}
            height={112}
            className="object-cover w-full h-full select-none pointer-events-none"
            draggable={false}
          />
        </div>

        <div className="editorial-about-intro">
          <p className="editorial-kicker">About Darkmocha</p>
          <h1>Yuto Nagata</h1>
          <div className="editorial-about-meta">
            <span>
              <MapPin className="w-3.5 h-3.5" />
              Nagano, Japan
            </span>
            <span>
              <ExternalLink className="w-3.5 h-3.5" />
              Suwa Tokyo Univ. of Science
            </span>
          </div>
          <p className="editorial-about-lead">
            University Student in Japan.
            Enjoying{" "}
            Code, Games & Travel.
          </p>
        </div>
      </header>

      <section className="editorial-section editorial-about-bio">
        <h2>Bio</h2>
        <div className="editorial-prose">
          <p>{t("bio1")}</p>
          <p>{t("bio2")}</p>
          <p>{t("bio3")}</p>
        </div>
      </section>

      <section className="editorial-section">
        <h2>Tech Stack</h2>
        <div className="editorial-skill-list">
          {techCategories.map((cat) => (
            <div key={cat.label}>
              <span>
                {cat.label}
              </span>
              <p>
                {cat.skills.join("  ·  ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <h2>Connect</h2>
        <ul className="editorial-social-list">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <span>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
