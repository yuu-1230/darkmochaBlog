"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ImageSlider({
  images = "",
  alt,
}: {
  images?: string;
  alt?: string;
}) {
  // カンマ区切りの文字列を配列に変換
  const imageArray =
    typeof images === "string" ?
      images
        .split(",")
        .map((src) => src.trim())
        .filter(Boolean)
    : [];

  if (imageArray.length === 0) {
    return null;
  }

  // 全ての画像に共通で使う「美しい枠」と「横幅固定・高さ自動」のクラス
  const frameClass =
    "my-8 w-full max-w-[300px] mx-auto rounded-2xl overflow-hidden border border-[#333] shadow-md bg-[#1e1e1e]";
  const imgClass = "block w-full h-auto object-cover";

  // パターン1：画像が「1枚」だけの場合（スライダー機能はオフにして枠だけ統一！）
  if (imageArray.length === 1) {
    return (
      <div className={frameClass}>
        <Image
          src={imageArray[0]}
          alt={alt || "ブログ画像"}
          width={600}
          height={450}
          sizes="300px"
          className={imgClass}
        />
      </div>
    );
  }

  // パターン2：画像が「複数枚」の場合（スライダー機能オン！）
  return (
    <div className={frameClass}>
      <div
        className="w-full"
        style={
          {
            "--swiper-theme-color": "#ffce79",
            "--swiper-navigation-size": "24px",
            "--swiper-pagination-bullet-inactive-color": "#858585",
            "--swiper-pagination-bottom": "12px", // ドットの位置を少し調整
          } as React.CSSProperties
        }
      >
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0} // 画像間の隙間をなくし、枠にピタッとくっつける
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          // ここが最強の魔法！「画像の高さに合わせて枠が自動で伸縮する」設定
          autoHeight={true}
          className="w-full"
        >
          {imageArray.map((src, index) => (
            <SwiperSlide key={index}>
              <Image
                src={src}
                alt={alt ? `${alt} ${index + 1}` : `スライド画像 ${index + 1}`}
                width={600}
                height={450}
                sizes="300px"
                className={imgClass}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
