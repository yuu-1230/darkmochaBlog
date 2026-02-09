# 🛠️ Tech Stack & Architecture (Updated: 2026-02-09)

このブログで使用している技術スタックとライブラリのメモ。
Next.js + MDX を採用し、**「VS Code (Visual Studio Code)」のUIを再現した IDE風ポートフォリオブログ** へとアーキテクチャを刷新。

## Core

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Deployment**: [Vercel](https://vercel.com/) (予定)
- **Package Manager**: [pnpm](https://pnpm.io/)

## UI & Design (Major Update! 🎨)

- **Theme Concept**: **VS Code IDE Style**
  - **Base Colors**:
    - `#1E1E1E` (Editor Background - Dark+)
    - `#252526` (Sidebar - Dark+)
    - `#007ACC` (Status Bar Blue)
  - **Layout**: 実際のIDE同様、`Activity Bar`, `Sidebar`, `Tab Bar`, `Status Bar` に分割されたグリッドレイアウト。
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - **CSS Variables**: `globals.css` にVS Codeの配色変数を定義し、エリアごとに適用。
- **Fonts**:
  - **UI**: `Inter` (Google Fonts)
  - **Code / Editor**: `JetBrains Mono` (Google Fonts) - エンジニアらしい等幅フォントを採用。
- **Icons**:
  - **[Lucide React](https://lucide.dev/)** ✅: ファイルアイコン、UIパーツに使用。
  - **[React Icons](https://react-icons.github.io/react-icons/)** ✅:
    - `VscVscode` (VS Code公式ロゴ) を使用。
- **State Management**:
  - **Sidebar Toggle**: `useState` を使用し、Activity Barのアイコンクリックでサイドバーの開閉を制御。

## Architecture & Logic

- **File Tree System**:
  - `lib/file-tree.ts`: サイドバーの表示内容とタブバーの表示名を一元管理する「Single Source of Truth」を実装。
  - URLパス (`usePathname`) とツリー定義を照合し、現在のファイル名（例: `About_me.md`）を動的に特定。
- **Componentization**:
  - `layout.tsx` を「司令塔」とし、各UIパーツ（Header/Footer等）を `components/layout/` 配下に独立化。

## Current Project Structure

```text
.
├── app/                  # Next.js App Router
│   ├── blog/
│   │   └── [slug]/       # 記事詳細ページ
│   ├── globals.css       # VS Code Dark+ 配色定義 ✅
│   ├── layout.tsx        # MainLayoutを使用したルートレイアウト ✅
│   └── page.tsx          # トップページ (記事一覧 / エディタ風表示)
├── components/
│   ├── layout/           # IDE UI Components (New!) ✅
│   │   ├── activity-bar.tsx # 左端のアイコンバー (サイドバー開閉トリガー)
│   │   ├── main-layout.tsx  # クライアントサイドの状態管理 (Sidebar Toggle)
│   │   ├── sidebar.tsx      # エクスプローラー (ファイルツリー表示)
│   │   ├── status-bar.tsx   # 最下部の青いバー (Gitブランチ情報など)
│   │   ├── tab-bar.tsx      # エディタ上部のタブ (ファイル名連動)
│   │   └── title-bar.tsx    # 最上部のウィンドウ枠 (メニューバー)
│   ├── ui/               # shadcn/ui components
│   └── typewriter.tsx    # タイプライターコンポーネント
├── content/
│   └── posts/            # 記事ファイル (.mdx)
├── lib/
│   ├── file-tree.ts      # ファイルツリー構造の定義データ (New!) ✅
│   └── mdx.ts            # 記事取得ロジック
└── public/
    └── images/           # アセット
```

---

# Blog Development Roadmap

## Phase 1: 記事を表示させる (Done)

- [x] プロジェクト作成 & 初期設定
- [x] MDX環境のセットアップ
- [x] 記事データの取得ロジック実装
- [x] Frontmatterの型定義修正

## Phase 2: デザイン刷新 - VS Code化 (Completed!)

- [x] **全体レイアウトのIDE化**
  - [x] `h-screen`, `overflow-hidden` によるアプリ風挙動の実装
  - [x] 画面分割 (ActivityBar / Sidebar / Editor / StatusBar)
- [x] **コンポーネント分割**
  - [x] `TitleBar`: ウィンドウ操作ボタン、メニューバーの再現
  - [x] `ActivityBar`: サイドバー開閉トグルの実装 (`useState`)
  - [x] `Sidebar`: 再帰的なファイルツリー表示、開閉アニメーション
  - [x] `TabBar`: URLに連動したファイル名・アイコンの自動切り替え
  - [x] `StatusBar`: Gitブランチ名、Prettier等のステータス表示
- [x] **アセット管理の強化**
  - [x] `lib/file-tree.ts` による仮想ファイル構造の一元管理
  - [x] `JetBrains Mono` フォントの導入

## Phase 3: コンテンツ拡充 (In Progress)

- [ ] **記事一覧 (Editor) のデザイン調整**
  - [ ] 記事カードをVS Codeの「拡張機能一覧」のようなデザインに調整予定
- [ ] **自己紹介 (`About_me.md`) の実装**
  - [ ] `react-typed` を使ったターミナル風自己紹介
- [ ] **Unityプロジェクト連携**
  - [ ] WebGLビルドの埋め込み、またはダウンロードリンクの整備

## Phase 4: 機能強化

- [ ] タグ/カテゴリ機能 (ファイルツリー上のフォルダ分けとして表現)
- [ ] `shiki` によるコードブロックのVS Codeテーマ適用
- [ ] OGP画像の自動生成
