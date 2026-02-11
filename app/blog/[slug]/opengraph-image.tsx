/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { getPost } from "@/lib/mdx";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const { title, description, image } = post.frontmatter;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://darkmocha.dev";

  // 記事の画像があればそれを使用、なければデフォルト画像
  const bgImageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/images/OG.jpg`;

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "80px",
        position: "relative",
        backgroundColor: "#1e1e1e",
      }}
    >
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
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
    },
  );
}
