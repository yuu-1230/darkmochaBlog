"use client";

import { motion } from "motion/react";

// ブロブの定義: 位置・サイズ・アニメーションをすべてここで管理
const blobs = [
  {
    // エスプレッソ: 左上コーナーから流れ込む
    colorVar: "var(--coffee-blob-1)",
    style: { width: 700, height: 700, top: "-25%", left: "-25%" },
    animate: {
      scale: [1, 1.35, 1.1, 1.5, 1],
      x: [0, 120, 60, 180, 0],
      y: [0, 80, 160, 40, 0],
    },
    transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const },
  },
  {
    // スチームミルク: 右下コーナーから混ざり合う
    colorVar: "var(--coffee-blob-2)",
    style: { width: 600, height: 600, bottom: "-20%", right: "-20%" },
    animate: {
      scale: [1, 1.4, 0.9, 1.2, 1],
      x: [0, -100, -180, -60, 0],
      y: [0, -60, -130, -30, 0],
    },
    transition: { duration: 25, repeat: Infinity, ease: "easeInOut" as const, delay: 3 },
  },
  {
    // ミディアムロースト: 右上に非対称に配置
    colorVar: "var(--coffee-blob-3)",
    style: { width: 450, height: 450, top: "10%", right: "-15%" },
    animate: {
      scale: [1, 1.5, 1.2, 0.9, 1],
      x: [0, -80, -40, -120, 0],
      y: [0, 100, 200, 80, 0],
    },
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const, delay: 6 },
  },
  {
    // ミルクの滴: 左下にアクセント
    colorVar: "var(--coffee-blob-2)",
    style: { width: 350, height: 350, bottom: "5%", left: "-10%" },
    animate: {
      scale: [1, 1.6, 1.1, 1.4, 1],
      x: [0, 60, 120, 30, 0],
      y: [0, -80, -30, -120, 0],
    },
    transition: { duration: 20, repeat: Infinity, ease: "easeInOut" as const, delay: 10 },
  },
];

export function CoffeeBackground() {
  return (
    <>
      {/* SVG Gooey フィルター定義（非表示） */}
      <svg
        aria-hidden
        className="absolute w-0 h-0 overflow-hidden"
        style={{ position: "fixed" }}
      >
        <defs>
          <filter id="gooey-coffee">
            {/* ブロブをぼかして隣接するブロブと融合させる */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            {/* alphaを急激に上げることで「液体が融合する」輪郭を作る */}
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 背景コンテナ: 全体を極低opacityに抑えて可読性を確保 */}
      <div
        aria-hidden
        className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
        style={{ opacity: 0.15 }}
      >
        {/* Gooeyフィルターが適用されるラッパー */}
        <div
          className="absolute inset-0"
          style={{ filter: "url(#gooey-coffee)" }}
        >
          {blobs.map((blob, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                ...blob.style,
                background: blob.colorVar,
              }}
              animate={blob.animate}
              transition={blob.transition}
            />
          ))}
        </div>
      </div>
    </>
  );
}
