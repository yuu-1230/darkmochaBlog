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

// ── OG画像用フォント ────────────────────────────────────────────
// ビルド時に Google Fonts を叩くため、記事数×ロケール数だけ外部リクエストが
// 発生する。ここが落ちるとデプロイ全体が失敗するので、次の3段構えにしている。
//   1. CJKを含まないテキストは共通のASCIIサブセット1回に集約する
//   2. 同じ文字集合はプロセス内でキャッシュし、リトライとタイムアウトを付ける
//   3. それでも失敗したら null を返す。呼び出し側は fonts を省略し、
//      @vercel/og 同梱の Noto Sans (latin) で描画してビルドを通す

/** 半角スペース〜チルダまでの印字可能ASCII。英語タイトルはすべてこれで賄える */
const PRINTABLE_ASCII = Array.from({ length: 95 }, (_, i) =>
  String.fromCharCode(32 + i),
).join("");

const CJK_PATTERN = /[　-鿿豈-﫿]/;

const FETCH_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;

/** 文字集合をキーにしたプロセス内キャッシュ。同一ビルド内で再取得しない */
const fontCache = new Map<string, Promise<ArrayBuffer | null>>();

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Google Fonts responded with ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }
  throw lastError;
}

async function fetchSubset(chars: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(chars)}`;
  const css = await (await fetchWithRetry(cssUrl)).text();
  const fontUrl = css.match(
    /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
  )?.[1];

  if (!fontUrl) {
    throw new Error("Failed to resolve font subset URL from Google Fonts");
  }

  return (await fetchWithRetry(fontUrl)).arrayBuffer();
}

/**
 * OG画像に描画する文字を含む Noto Sans JP サブセットを返す。
 * 取得できなかった場合は null を返す（ビルドは落とさない）。
 */
export async function loadOgFontSubset(
  text: string,
): Promise<ArrayBuffer | null> {
  // 英数字だけのタイトルは共通サブセットに寄せて、全英語ページで1回に集約する
  const chars = CJK_PATTERN.test(text)
    ? Array.from(new Set(text + PRINTABLE_ASCII)).sort().join("")
    : PRINTABLE_ASCII;

  let cached = fontCache.get(chars);
  if (!cached) {
    cached = fetchSubset(chars).catch((error) => {
      console.warn(
        "[og-image] フォント取得に失敗したため既定フォントで描画します:",
        error,
      );
      return null;
    });
    fontCache.set(chars, cached);
  }
  return cached;
}

/** ImageResponse の options に展開するフォント指定。null なら @vercel/og の既定フォント */
export function ogFontOptions(fontData: ArrayBuffer | null) {
  if (!fontData) return {};
  return {
    fonts: [
      {
        name: "Noto Sans JP",
        data: fontData,
        style: "normal" as const,
        weight: 700 as const,
      },
    ],
  };
}
