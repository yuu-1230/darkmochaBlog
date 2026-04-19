import React from "react";
import { scanAppExplorerRoutes } from "@/lib/app-explorer";
import {
  JsonIcon,
  MDIcon,
  InfoIcon,
  TSXIcon,
  type FileNode,
} from "@/lib/file-tree";

function iconForAppRoute(segment: string): React.ReactNode {
  if (segment === "about") return <InfoIcon />;
  if (segment === "projects") return <JsonIcon />;
  if (segment === "notes") return <JsonIcon />;
  if (segment === "notes-timeline") return <MDIcon />;
  return <TSXIcon color="blue" />;
}

function buildAppExplorerNodes(): FileNode[] {
  return scanAppExplorerRoutes().map((r) => ({
    name: r.explorerLabel,
    type: "file" as const,
    path: r.routePath,
    icon: iconForAppRoute(r.segment),
  }));
}

/** サーバー専用（layout からのみ import）。`fs` を使う app 走査を含む */
export function generateFileTree(
  posts: { slug: string; frontmatter: { title: string; category?: string } }[],
): FileNode[] {
  const techPosts = posts.filter((p) => p.frontmatter.category === "Tech");
  const unityPosts = posts.filter((p) => p.frontmatter.category === "Unity");
  const lifePosts = posts.filter((p) => p.frontmatter.category === "Life");

  const createNodes = (filteredPosts: typeof posts) =>
    filteredPosts.map((post) => ({
      name: `${post.slug}.mdx`,
      type: "file" as const,
      path: `/blog/${post.slug}`,
      icon: <MDIcon />,
    }));

  return [
    ...buildAppExplorerNodes(),
    {
      name: "Tech_Articles",
      type: "folder",
      isOpen: true,
      children: createNodes(techPosts),
    },
    {
      name: "Unity_Dev",
      type: "folder",
      isOpen: true,
      children: createNodes(unityPosts),
    },
    {
      name: "Life_and_Travel",
      type: "folder",
      isOpen: true,
      children: createNodes(lifePosts),
    },
  ];
}
