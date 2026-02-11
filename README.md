# ☕ Darkmocha Blog

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Visual Studio Code (VS Code)** のUI/UXを忠実に再現した、エンジニアのためのポートフォリオブログです。
Next.js (App Router) + MDX を採用し、**「IDE風ポートフォリオブログ」** へとアーキテクチャを刷新しました。(Updated: 2026-02-11)

## 🎨 Concept & Design

テーマコンセプトは **"VS Code IDE Style (Zen Mode)"**。
エンジニアにとって最も馴染み深いインターフェースであるIDEのレイアウト（Activity Bar, Sidebar, Tab Bar, Status Bar）をWeb上で再現しています。

- **Authentic UI**: `globals.css` にVS Code (Dark+) の配色変数を定義し、リアルな没入感を実現。
- **Typography**: コードやエディタ部分には `JetBrains Mono` を採用し、可読性と雰囲気を両立。
- **Interactive**: Activity Barによるサイドバーの開閉や、ルーティングに連動したタブ表示など、SPAならではの挙動を実装。
- **Mobile Friendly**: スマホ閲覧時はエクスプローラーをドロワーメニュー化し、ステータスバーを最適化するなど、レスポンシブにも完全対応。

## 🛠️ Tech Stack & Architecture

### Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/) (予定)
- **Package Manager**: [pnpm](https://pnpm.io/)

### UI & Styling

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - **Colors**: `#1E1E1E` (Editor Background), `#252526` (Sidebar), `#007ACC` (Status Bar Blue)
- **Fonts**: `Inter` (UI), `JetBrains Mono` (Code/Editor)
- **Icons**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)

### Architecture & Logic

- **File Tree System (`lib/file-tree.ts`)**:
  サイドバーの表示内容とタブバーの表示名を一元管理する「Single Source of Truth」を実装。URLパスとツリー定義を照合し、現在のファイル名を動的に特定。
- **Custom MDX Components**:
  VS Codeのシンタックスハイライト風にテキストを装飾できる専用コンポーネント `<C c="color">` を実装し、記事執筆のDXを向上。

### 🤖 SEO & AEO (AI Engine Optimization) Strategy

見た目はVS Codeでありながら、クローラーやAI（Perplexity, ChatGPT等）が完璧に解析できる裏側を構築しています。

- **Semantic HTML**: `<nav role="tablist">`, `<aside>`, `<article>`, `<time>` や `aria-label` 等のアクセシビリティタグを徹底。
- **Structured Data (JSON-LD)**: `Person` および `BlogPosting` スキーマを動的に生成し、AI検索エンジンへの直接的な自己紹介（スキルや記事の文脈）を実装。
- **Dynamic Metadata**: 記事ごとの動的OGPルーティング生成、および前後記事への回遊リンク(`Next/Prev`)によるクロールバジェットの最適化。

## 📂 Current Project Structure

```text
.
├── app/                  # Next.js App Router
│   ├── blog/
│   │   └── [slug]/       # 記事詳細ページ (Markdown Rendering & JSON-LD)
│   ├── globals.css       # VS Code Dark+ 配色定義
│   ├── layout.tsx        # Root Layout (MainLayout & Person JSON-LD)
│   └── page.tsx          # トップページ (Dashboard / Article List)
├── components/
│   ├── layout/           # Semantic IDE UI Components
│   │   ├── activity-bar.tsx # サイドバー開閉トグル (nav)
│   │   ├── main-layout.tsx  # クライアント状態管理 & レスポンシブ制御
│   │   ├── sidebar.tsx      # 再帰的ファイルツリー表示 (ul/li lists)
│   │   ├── status-bar.tsx   # Git・エラー情報 (footer)
│   │   ├── tab-bar.tsx      # 動的タブバー (tablist)
│   │   └── title-bar.tsx    # ウィンドウヘッダー & アプリアイコン
│   └── ui/               # Common UI Components
├── content/
│   └── posts/            # 記事ファイル (.mdx)
├── lib/
│   ├── file-tree.ts      # ファイルツリー構造の定義データ
│   ├── projects.ts       # プロジェクト実績データ
│   └── mdx.ts            # 記事取得・前後の記事判定ロジック
└── public/
    └── images/           # Static Assets & App Icons
```

## 🚀 Getting Started

```bash
# Clone the repository
git clone [https://github.com/your-username/darkmocha-blog.git](https://github.com/your-username/darkmocha-blog.git)

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗺️ Blog Development Roadmap

### Phase 1: 記事を表示させる (Done ✅)

- [x] プロジェクト作成 & 初期設定
- [x] MDX環境のセットアップ
- [x] 記事データの取得ロジック実装
- [x] Frontmatterの型定義修正

### Phase 2: デザイン刷新 - VS Code化 (Done ✅)

- [x] **全体レイアウトのIDE化** (`h-screen`, 画面分割)
- [x] **コンポーネント分割** (`TitleBar`, `ActivityBar`, `Sidebar`, `TabBar`, `StatusBar`)
- [x] **アセット管理の強化** (仮想ファイル構造、フォント)
- [x] **Mobile Responsiveness**: スマホ閲覧時のレイアウト最適化・ドロワーメニュー実装

### Phase 3: SEO & AEO 最適化 (Done ✅)

- [x] **Semantic HTML**: 全UIコンポーネントのWeb標準・アクセシビリティ対応
- [x] **Structured Data**: JSON-LD（Person, BlogPosting）の動的埋め込み
- [x] **Metadata**: 記事ごとの動的OGP生成と、トップページのリード文最適化
- [x] **Crawling**: 記事最下部への「前後記事リンク」実装

### Phase 4: コンテンツ拡充 & 本番公開 (In Progress 🚧)

- [x] **Projects Page**: 拡張機能マーケットプレイス風の実績一覧ページ
- [x] **Markdown Style**: MDXカスタムコンポーネント (`<C>`) による文字色装飾機能
- [ ] **About Me (AEO強化)**: AI検索に引用されやすい「Q&A形式」の自然言語セクションを追加
- [ ] **SEO Tools**: `sitemap.xml` と `robots.txt` の自動生成
- [ ] **Content**: Next.jsやUnityに関する技術解説記事の執筆
- [ ] **Deployment**: Vercelへの本番デプロイとカスタムドメイン設定

## 👤 Author

**Yuto Nagata**

- Web Developer (Next.js / React)
- Game Creator (Unity)
- Student at Public University of Science, Suwa

---

© 2026 Darkmocha Blog. Built with Code & Coffee.
