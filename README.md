# 🛠️ Tech Stack & Architecture (Updated: 2026-01-31)

このブログで使用している技術スタックとライブラリのメモ。
Next.js + MDX を採用し、コンテンツとデザインの完全なコントロール権を持つモダンなブログアーキテクチャを構築中。

## Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
  - 最新のReact機能とSSG/SSRを活用。
- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - 型安全性のため必須。
- **Deployment**: [Vercel](https://vercel.com/)
  - デプロイ、ホスティング、CI/CD。

## UI & Design

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - CSSフレームワーク。
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) ✅
  - 再利用可能なコンポーネント集（Button, Card etc.）。
  - 設定: Style=`New York`, Base Color=`Zinc`
  - インストール済み: `button`, `card`, `separator`
- **Icons**: [Lucide React](https://lucide.dev/) ✅
  - アイコンライブラリ。`import { IconName } from 'lucide-react'` で使用。
- **Font**: Geist (Next.js Default) / Noto Sans JP (予定)

## Content Management

- **Format**: MDX (`.mdx`)
  - Markdownの中にReactコンポーネントを埋め込める形式。
  - 記事データはリポジトリ内の `content/posts/` で管理。
- **Writer**: [Obsidian](https://obsidian.md/)
  - ローカルでの執筆環境。Gitでコンテンツを同期。
- **MDX Engine**: [`next-mdx-remote-client`](https://github.com/ipikuka/next-mdx-remote-client) ✅
  - `next-mdx-remote` の後継。MDXをRSC (React Server Components) で安全にレンダリングする。
- **Frontmatter Parser**: [`gray-matter`](https://github.com/jonschlinkert/gray-matter) ✅
  - サーバーサイド(`fs`)でファイルを読み込んだ際、メタデータ（タイトル、日付など）を解析するために使用。

## Features & Libraries

- **Syntax Highlighting**: [`shiki`](https://shiki.style/) ✅
  - コードブロックを美しく色付けする。
- **Comments**: [`@giscus/react`](https://giscus.app/) ✅
  - GitHub Discussionsを利用したコメントシステム。
- **Date Formatting**: `date-fns` ✅
  - 日付操作用。

## Current Project Structure

```text
.
├── app/                  # Next.js App Router
│   ├── blog/
│   │   └── [slug]/       # 記事詳細ページ (実装中)
│   └── page.tsx          # トップページ
├── components/
│   ├── ui/               # shadcn/ui components (Button, Card...)
│   └── mdx/              # MDXで使用するカスタムコンポーネント
├── content/
│   └── posts/            # 記事ファイル (.mdx)
│       └── hello.mdx     # テスト記事
├── lib/                  # ユーティリティ関数
│   └── mdx.ts            # 記事取得ロジック (fs, gray-matter)
└── public/               # 静的画像
```

# Blog Development Roadmap

## Phase 1: 記事を表示させる (Now!)

- [x] プロジェクト作成 & 初期設定 (Next.js, Tailwind, TypeScript)
- [x] UIライブラリ導入 (shadcn/ui, Lucide)
- [x] MDX環境のセットアップ (next-mdx-remote-client, gray-matter)
- [x] 記事データの取得ロジック実装 (単体取得: `getPost`)
- [ ] **記事データの取得ロジック実装 (全件取得: `getAllPosts`)** 👈 次はココ！
- [ ] 記事詳細ページの作成 (`app/blog/[slug]/page.tsx`)
- [ ] 記事のデザイン調整 (`@tailwindcss/typography` 導入)

## Phase 2: トップページを作る

- [ ] 記事一覧を取得して表示する (`app/page.tsx`)
- [ ] 記事カードコンポーネントのデザイン (shadcn/ui `Card` 使用)
- [ ] ヘッダーとフッターの作成

## Phase 3: ブログとしての機能を強化

- [ ] コードブロックのシンタックスハイライト実装 (`shiki`)
- [ ] タグ/カテゴリ機能の実装
- [ ] ページネーション実装 (記事が増えてきたら)
- [ ] OGP画像の自動生成 (SNSシェア用)

## Phase 4: デプロイ & 運用

- [ ] Vercelへのデプロイ
- [ ] 独自ドメインの設定 (もしあれば)
- [ ] Analytics導入 (Umami / Vercel Analytics)
