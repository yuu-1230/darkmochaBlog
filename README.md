# ☕ Darkmocha Blog

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Visual Studio Code (VS Code)** のUI/UXを忠実に再現した、エンジニアのためのポートフォリオブログです。
Next.js (App Router) + MDX を採用し、**「IDE風ポートフォリオブログ」** へとアーキテクチャを刷新しました。(Updated: 2026-02-09)

## 🎨 Concept & Design (Major Update!)

テーマコンセプトは **"VS Code IDE Style (Zen Mode)"**。
エンジニアにとって最も馴染み深いインターフェースであるIDEのレイアウト（Activity Bar, Sidebar, Tab Bar, Status Bar）をWeb上で再現しています。

- **Authentic UI**: `globals.css` にVS Code (Dark+) の配色変数を定義し、リアルな没入感を実現。
- **Typography**: コードやエディタ部分には `JetBrains Mono` を採用し、可読性と雰囲気を両立。
- **Interactive**: Activity Barによるサイドバーの開閉や、ルーティングに連動したタブ表示など、SPAならではの挙動を実装。

## 🛠️ Tech Stack & Architecture

### Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/) (予定)
- **Package Manager**: [pnpm](https://pnpm.io/)

### UI & Styling

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - **Colors**:
    - `#1E1E1E` (Editor Background - Dark+)
    - `#252526` (Sidebar - Dark+)
    - `#007ACC` (Status Bar Blue)
- **Fonts**:
  - **UI**: `Inter` (Google Fonts)
  - **Code / Editor**: `JetBrains Mono` (Google Fonts)
- **Icons**:
  - **[Lucide React](https://lucide.dev/)**: ファイルアイコン、UIパーツに使用。
  - **[React Icons](https://react-icons.github.io/react-icons/)**: `VscVscode` (VS Code公式ロゴ) を使用。

### Architecture & Logic

- **File Tree System (`lib/file-tree.ts`)**:
  サイドバーの表示内容とタブバーの表示名を一元管理する「Single Source of Truth」を実装。URLパス (`usePathname`) とツリー定義を照合し、現在のファイル名（例: `About_me.md`）を動的に特定します。
- **Componentization**:
  `layout.tsx` を「司令塔」とし、各UIパーツ（Header/Footer等）を `components/layout/` 配下に独立化。
- **SEO & AEO Strategy**:
  - **Next.js Metadata API**: 各ページに適切な `title`, `description`, `OGP` を設定。
  - **Semantic HTML**: `main`, `h1`, `article` タグを適切に使用し、クローラーに構造を伝達。

## 📂 Current Project Structure

```text
.
├── app/                  # Next.js App Router
│   ├── blog/
│   │   └── [slug]/       # 記事詳細ページ (Markdown Rendering)
│   ├── globals.css       # VS Code Dark+ 配色定義
│   ├── layout.tsx        # Root Layout (MainLayout)
│   └── page.tsx          # トップページ (Dashboard / Editor)
├── components/
│   ├── layout/           # IDE UI Components
│   │   ├── activity-bar.tsx # サイドバー開閉トグル
│   │   ├── main-layout.tsx  # クライアント状態管理 (Sidebar State)
│   │   ├── sidebar.tsx      # 再帰的ファイルツリー表示
│   │   ├── status-bar.tsx   # Gitブランチ情報・Prettierステータス
│   │   ├── tab-bar.tsx      # 動的タブバー
│   │   └── title-bar.tsx    # シンプルなウィンドウヘッダー
│   └── ui/               # Common UI Components
├── content/
│   └── posts/            # 記事ファイル (.mdx)
├── lib/
│   ├── file-tree.ts      # ファイルツリー構造の定義データ
│   ├── projects.ts       # プロジェクト実績データ
│   └── mdx.ts            # 記事取得ロジック
└── public/
    └── images/           # Static Assets
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

- [x] **全体レイアウトのIDE化**
  - [x] `h-screen`, `overflow-hidden` によるアプリ風挙動の実装
  - [x] 画面分割 (ActivityBar / Sidebar / Editor / StatusBar)
- [x] **コンポーネント分割**
  - [x] `TitleBar`: メニューバーを排除し、ロゴとタイトルのみのシンプル構成へ変更
  - [x] `ActivityBar`: サイドバー開閉トグルの実装 (`useState`)
  - [x] `Sidebar`: 再帰的なファイルツリー表示、開閉アニメーション
  - [x] `TabBar`: URLに連動したファイル名・アイコンの自動切り替え
  - [x] `StatusBar`: Gitブランチ名、Prettier等のステータス表示
- [x] **アセット管理の強化**
  - [x] `lib/file-tree.ts` による仮想ファイル構造の一元管理
  - [x] `JetBrains Mono` フォントの導入

### Phase 3: コンテンツ拡充 (In Progress 🚧)

- [x] **Projects Page**: 拡張機能マーケットプレイス風の実績一覧ページ (New!)
- [x] **Markdown Style**: 記事プレビューのハイコントラスト化 (VS Code Style)
- [ ] **About Me**: ターミナル風自己紹介ページの実装
- [ ] **Mobile Responsiveness**: スマホ閲覧時のレイアウト最適化
- [ ] **Unity Integration**: WebGLビルド成果物の埋め込み

## 👤 Author

**Yuto Nagata**

- Web Developer (Next.js / React)
- Game Creator (Unity)
- Student at Public University of Science, Suwa

---

© 2026 Darkmocha Blog. Built with Code & Coffee.

```

```
