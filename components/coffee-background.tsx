"use client";

import { motion } from "motion/react";

// ─────────────────────────────────────────────
// SVG パス定義 (viewBox: 0 0 600 600)
// 全て M + 8×C + Z で統一 → motion/react が滑らかにモーフィング
// ─────────────────────────────────────────────

/** 注ぎたてのミルクが広がる、抽象的な液体ブロブ */
const blobPath =
  "M 300,80 " +
  "C 380,60 460,100 500,170 " +
  "C 540,240 535,330 510,400 " +
  "C 485,470 430,510 370,520 " +
  "C 310,530 240,515 185,480 " +
  "C 130,445 85,385 75,315 " +
  "C 65,245 95,165 150,120 " +
  "C 195,82 245,68 275,76 " +
  "C 285,78 293,79 300,80 Z";

/** ラテアートのハート ♥ */
const heartPath =
  "M 300,495 " +
  "C 245,465 160,415 108,362 " +
  "C 56,309 55,235 98,183 " +
  "C 141,131 203,122 252,148 " +
  "C 273,159 292,181 300,208 " +
  "C 308,181 327,159 348,148 " +
  "C 397,122 459,131 502,183 " +
  "C 545,235 544,309 492,362 " +
  "C 440,415 355,465 300,495 Z";

/** ラテアートのリーフ（ロゼッタ）🍃 */
const leafPath =
  "M 300,95 " +
  "C 360,108 415,152 445,215 " +
  "C 475,278 472,350 448,410 " +
  "C 424,470 382,505 340,515 " +
  "C 320,520 310,520 300,518 " +
  "C 290,520 280,520 260,515 " +
  "C 218,505 176,470 152,410 " +
  "C 128,350 125,278 155,215 " +
  "C 185,152 240,108 300,95 Z";

// ─────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────
export function CoffeeBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[-1] pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ opacity: 0.14 }}
    >
      {/* ── メインのラテアートモーフィング ── */}
      <svg
        viewBox="0 0 600 600"
        width={720}
        height={720}
        className="absolute blur-[72px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* エスプレッソ層: primary カラー */}
        <motion.path
          d={blobPath}
          className="fill-primary"
          animate={{
            d: [blobPath, heartPath, blobPath, leafPath, blobPath],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* ── ミルクフォーム層: 少しオフセットして重ね ── */}
      <svg
        viewBox="0 0 600 600"
        width={520}
        height={520}
        className="absolute blur-[90px]"
        style={{ transform: "translate(120px, -80px)" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={blobPath}
          style={{ fill: "var(--coffee-blob-2)" }}
          animate={{
            d: [leafPath, blobPath, heartPath, blobPath, leafPath],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8,
          }}
        />
      </svg>

      {/* ── ダークロースト層: 左下にアシンメトリー配置 ── */}
      <svg
        viewBox="0 0 600 600"
        width={440}
        height={440}
        className="absolute blur-[80px]"
        style={{ transform: "translate(-160px, 130px)" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={heartPath}
          style={{ fill: "var(--coffee-blob-3)" }}
          animate={{
            d: [heartPath, leafPath, blobPath, leafPath, heartPath],
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 14,
          }}
        />
      </svg>
    </div>
  );
}
