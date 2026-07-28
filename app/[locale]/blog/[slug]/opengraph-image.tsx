import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/mdx";
import {
  loadPublicImageAsDataUri,
  loadOgFontSubset,
  ogFontOptions,
} from "@/lib/og-image";
import { routing, type Locale } from "@/i18n/routing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const params: { locale: Locale; slug: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale);
    params.push(...posts.map((post) => ({ locale, slug: post.slug })));
  }
  return params;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string; locale: Locale }>;
}) {
  const { slug, locale } = await params;
  // 未訳ロケールでは存在する言語版のOG画像にフォールバックする
  const post =
    (await getPost(slug, locale)) ??
    (await getPost(slug, routing.defaultLocale));
  if (!post) {
    notFound();
  }
  const { title, description, image } = post.frontmatter;

  // 記事の画像があればそれを使用、なければデフォルト画像
  const bgImageUrl = await loadPublicImageAsDataUri(image ?? "/images/OG.jpg");
  const fontData = await loadOgFontSubset(`${title}${description ?? ""}`);

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative", // 大枠を相対配置に
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* 第1層: 背景画像（パディングなしの絶対配置） */}
      <img
        src={bgImageUrl}
        alt="Background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          objectFit: "cover",
        }}
      />

      {/* 第2層: 黒グラデーション（パディングなしの絶対配置） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* 第3層: テキストコンテンツ（ここにだけパディングを入れる） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px", // ここで内側の余白を確保
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 32,
              color: "#e5e7eb",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>,
    {
      ...size,
      ...ogFontOptions(fontData),
    },
  );
}
