# Tech Stack & Architecture

## 🚀 Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
  - 最新のReact機能とSSG/SSRを活用。
- **Language**: [TypeScript](https://www.typescriptlang.org/)
  - 型安全性のため必須。
- **Deployment**: [Vercel](https://vercel.com/)
  - デプロイ、ホスティング、CI/CD。

## UI & Design

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - CSSフレームワーク。
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/)
  - 再利用可能なコンポーネント集（Button, Card etc.）。
  - インストールコマンド: `pnpm dlx shadcn@latest init`
- **Icons**: [Lucide React](https://lucide.dev/)
  - アイコンライブラリ。`import { IconName } from 'lucide-react'` で使用。
- **Font**: Geist (Next.js Default) / Noto Sans JP (予定)

## Content Management

- **Format**: MDX (`.mdx`)
  - Markdownの中にReactコンポーネントを埋め込める形式。
  - 記事データはリポジトリ内の `content/posts/` で管理。
- **Writer**: [Obsidian](https://obsidian.md/)
  - ローカルでの執筆環境。Gitでコンテンツを同期。
- **MDX Processor**: `next-mdx-remote` (予定)
  - MDXファイルをHTML/Reactコンポーネントに変換するライブラリ。

## Features & Libraries (Planned)

- **Syntax Highlighting**: [Shiki](https://shiki.style/) (予定)
  - コードブロックを美しく色付けする。
- **Comments**: [Giscus](https://giscus.app/) (予定)
  - GitHub Discussionsを利用したコメントシステム。
- **Analytics**: [Umami](https://umami.is/) (予定)
  - プライバシー重視のアクセス解析。
- **Date Formatting**: `date-fns`
  - 日付操作用。

## Project Structure Idea
```text
.
├── app/ # Next.js App Router
├── components/
│ ├── ui/ # shadcn/ui components
│ └── mdx/ # MDXで使用するカスタムコンポーネント (Map, YouTube etc.)
├── content/
│ └── posts/ # 記事ファイル (.mdx)
├── lib/ # ユーティリティ関数
└── public/ # 静的画像
```
