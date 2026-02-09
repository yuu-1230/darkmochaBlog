# 🛠️ Tech Stack & Architecture (Updated: 2026-02-09)

このブログで使用している技術スタックとライブラリのメモ。
Next.js + MDX を採用し、**「Darkmocha」テーマ（カフェ・温かみのあるデザイン）** を基調としたモダンなブログアーキテクチャを構築中。

## Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/) (予定)
- **Package Manager**: [pnpm](https://pnpm.io/)
  - `npm` との競合を解消し、`pnpm` に統一完了。

## UI & Design (Updated!)

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - **Theme**: **Darkmocha** (Custom)
    - Base Color: Warm Brown / Coffee tones (`oklch` color space)
    - Features: Dark Mode 対応, CSS Variables による動的テーマ変更
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) ✅
  - 使用コンポーネント: `button`, `card`, `separator`
- **Icons**:
  - [Lucide React](https://lucide.dev/) ✅ (UI汎用アイコン)
  - **[React Icons](https://react-icons.github.io/react-icons/) (Simple Icons)** ✅ (New!)
    - GitHub, X (Twitter), Bluesky, Instagram などのブランドアイコン表示に使用。
- **Animations**:
  - **[react-typed](https://github.com/ssbeefeater/react-typed)** ✅ (New!)
    - タイプライター風のアニメーション効果（導入済み、実装待ち）。
  - **Custom CSS Animations**:
    - `animate-blink`: カーソルの点滅アニメーション（`tailwind.config` / CSS Variables に追加）。

## Content Management

- **Format**: MDX (`.mdx`)
- **Frontmatter Parser**: [`gray-matter`](https://github.com/jonschlinkert/gray-matter) ✅
  - **Schema Update**:
    - `image`: サムネイル画像のパスを追加（例: `/images/post.jpg`）。
    - `tags`: 配列形式 `['Tag1', 'Tag2']` に修正完了。
- **Assets**:
  - `public/images/`: 記事のサムネイル画像を管理。

## Current Project Structure

```text
.
├── app/                  # Next.js App Router
│   ├── blog/
│   │   └── [slug]/       # 記事詳細ページ
│   ├── globals.css       # Tailwind v4 設定 & Darkmochaテーマ定義 ✅
│   ├── layout.tsx        # Sticky Footer対応済み ✅
│   └── page.tsx          # トップページ (横長カードレイアウト) ✅
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── site-header.tsx   # ヘッダー (Blinking cursor, Blur effect) ✅
│   ├── site-footer.tsx   # フッター (Social Icons, Copyright) ✅
│   └── typewriter.tsx    # タイプライターコンポーネント (New!)
├── content/
│   └── posts/            # 記事ファイル (.mdx)
├── lib/
│   └── mdx.ts            # 記事取得ロジック (Frontmatter型定義更新済み)
└── public/
    └── images/           # ブログ用画像格納フォルダ ✅
```

---

# Blog Development Roadmap

## Phase 1: 記事を表示させる (Done)

- [x] プロジェクト作成 & 初期設定
- [x] MDX環境のセットアップ
- [x] 記事データの取得ロジック実装 (`getAllPosts`, `getPost`)
- [x] 記事詳細ページの作成
- [x] **Frontmatterの型定義修正 (Tags, Image)**

## Phase 2: トップページを作る (Done)

- [x] 記事一覧の取得・表示
- [x] **記事カードのデザイン刷新**
  - [x] 横長リストレイアウト (Flexbox)
  - [x] サムネイル画像の表示 (`next/image`)
  - [x] 画像がない場合のフォールバック表示 (`bg-muted`)
  - [x] ホバーエフェクト (画像の拡大, テキスト色の変化)
- [x] **ヘッダーの作成**
  - [x] ロゴデザイン (Gradient / Monospace + Blinking Cursor)
  - [x] ナビゲーションリンク
- [x] **フッターの作成**
  - [x] 最下部固定 (Sticky Footer)
  - [x] SNSリンク設置 (React Icons)

## Phase 3: デザインとブランディング (In Progress)

- [x] **テーマカラーの刷新 (Darkmocha)**
  - [x] `globals.css` の変数を茶色ベースに書き換え
  - [x] ライト/ダークモードのカラーパレット調整
- [ ] **トップページの演出強化**
  - [ ] `react-typed` を使った自己紹介エリアの実装 👈 **Next!**
- [ ] **記事の中身のデザイン (`@tailwindcss/typography`)**
  - [ ] 見出し、リスト、リンクなどのスタイル調整

## Phase 4: ブログ機能の拡充

- [ ] タグ/カテゴリページの実装 (`/tags/[tag]`)
- [ ] ページネーション (記事数が増えたら)
- [ ] OGP画像の自動生成
- [ ] `shiki` によるコードブロックのシンタックスハイライト調整

## Phase 5: デプロイ

- [ ] Vercelへのデプロイ
- [ ] Analytics導入
