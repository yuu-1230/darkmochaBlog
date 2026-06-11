import fs from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function loadPublicImageAsDataUri(
  publicPath: string,
): Promise<string> {
  const filePath = path.join(process.cwd(), "public", publicPath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] ?? "image/jpeg";
  const data = await fs.readFile(filePath);
  return `data:${mimeType};base64,${data.toString("base64")}`;
}

/** OG画像に描画する文字だけを含む Noto Sans JP サブセットを取得する */
export async function loadJapaneseFontSubset(
  text: string,
): Promise<ArrayBuffer> {
  const uniqueChars = Array.from(new Set(text)).join("");
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(uniqueChars)}`;
  const css = await (await fetch(cssUrl)).text();
  const fontUrl = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  )?.[1];

  if (!fontUrl) {
    throw new Error("Failed to resolve font subset URL from Google Fonts");
  }

  return (await fetch(fontUrl)).arrayBuffer();
}
