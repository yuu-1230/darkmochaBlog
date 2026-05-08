export interface OgpData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

function extractMeta(html: string, property: string): string | undefined {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m?.[1]) return m[1];
  }
}

export async function fetchOgp(url: string): Promise<OgpData> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DarkmochaBlog/1.0; +https://www.darkmocha.dev)",
        Accept: "text/html",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return { url };

    const html = await res.text();
    const origin = new URL(url).origin;

    const rawImage = extractMeta(html, "og:image");
    const resolvedImage = rawImage
      ? rawImage.startsWith("http")
        ? rawImage
        : `${origin}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`
      : undefined;

    return {
      url,
      title:
        extractMeta(html, "og:title") ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim(),
      description:
        extractMeta(html, "og:description") || extractMeta(html, "description"),
      image: resolvedImage,
      siteName: extractMeta(html, "og:site_name"),
    };
  } catch {
    return { url };
  }
}

export function extractUrls(text: string): string[] {
  const matches = text.match(/https?:\/\/[^\s]+/g);
  return matches ? [...new Set(matches)] : [];
}
