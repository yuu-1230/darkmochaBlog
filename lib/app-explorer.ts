import fs from "fs";
import path from "path";

const APP_DIR = path.join(process.cwd(), "app");

/** エクスプローラーに出さない app 直下ディレクトリ（動的ルートや API など） */
const EXCLUDED_TOP_LEVEL = new Set([
  "blog",
  "api",
  "robots.txt",
  "sitemap.xml",
]);

export type AppExplorerRoute = {
  /** URL パス（例: /notes-timeline） */
  routePath: string;
  /** サイドバーに出すラベル（app 構成を反映） */
  explorerLabel: string;
  /** ディレクトリ名（ルートは空文字） */
  segment: string;
};

/**
 * app 直下の各フォルダ内 page.tsx から静的ルートを列挙（ルート page と、除外以外の直下のみ）
 */
export function scanAppExplorerRoutes(): AppExplorerRoute[] {
  const routes: AppExplorerRoute[] = [];

  if (fs.existsSync(path.join(APP_DIR, "page.tsx"))) {
    routes.push({
      segment: "",
      routePath: "/",
      explorerLabel: "Home.tsx",
    });
  }

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(APP_DIR, { withFileTypes: true });
  } catch {
    return routes;
  }

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const name = ent.name;
    if (name.startsWith("_") || name.startsWith("(") || name.startsWith(".")) {
      continue;
    }
    if (EXCLUDED_TOP_LEVEL.has(name)) continue;

    const pageFile = path.join(APP_DIR, name, "page.tsx");
    if (!fs.existsSync(pageFile)) continue;

    routes.push({
      segment: name,
      routePath: "/" + name,
      explorerLabel: name + ".tsx",
    });
  }

  routes.sort((a, b) => {
    if (a.segment === "") return -1;
    if (b.segment === "") return 1;
    return a.segment.localeCompare(b.segment);
  });

  return routes;
}
