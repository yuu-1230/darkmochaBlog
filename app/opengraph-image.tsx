/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const isDev = process.env.NODE_ENV === "development";
  const baseUrl = isDev ? "http://localhost:3000" : "https://www.darkmocha.dev";

  // サイト全体用の背景画像（プロフ画像や風景など）
  const bgImageUrl = `${baseUrl}/images/OG.jpg`;

  const title = "Darkmocha Blog";
  const description = "Engineer and Everyday life Blog by Yuto Nagata";

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative", // 大枠は相対配置のみ（パディングは入れない）
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* 第1層: 背景画像 */}
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

      {/* 第2層: 黒グラデーション */}
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

      {/* 第3層: テキスト部分（ここにだけ絶対配置とパディングを設定して余白を作る） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // 下寄せ
          padding: "80px", // テキスト用の余白
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            marginBottom: 20,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p style={{ fontSize: 36, color: "#e5e7eb", margin: 0 }}>
          {description}
        </p>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
