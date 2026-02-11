/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://darkmocha.dev";

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
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "80px",
        position: "relative",
        backgroundColor: "#1e1e1e", // 万が一画像がない時の背景色
      }}
    >
      {/* 背景画像 */}
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

      {/* 黒グラデーション（z-indexを使わず、書いた順番で上に重ねる） */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          backgroundImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* テキスト部分 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: "bold",
            color: "white",
            margin: 0,
            marginBottom: 20,
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
