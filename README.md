# ☕ Darkmocha Blog

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Visual Studio Code（VS Code）** のUI/UXを忠実に再現した、エンジニア向けのポートフォリオブログです。
Next.js（App Router）とMDXを採用し、**「IDE風ポートフォリオブログ」** としてアーキテクチャを継続的に改善しています。（Updated: 2026-04）

## 🎨 コンセプト・デザイン

テーマコンセプトは **"VS Code IDE Style（Zen Mode）"**。
エンジニアにとって最も馴染み深いIDEのレイアウト（Activity Bar、Sidebar、Tab Bar、Status Bar）をWeb上で再現しています。

- **本物に近いUI**: `globals.css` にVS Code（Dark+）の配色変数を定義し、リアルな没入感を実現。
- **タイポグラフィ**: コードやエディタ部分に `JetBrains Mono` を採用し、可読性と雰囲気を両立。
- **インタラクション**: Activity Barによるサイドバーの開閉や、ルーティングに連動したタブ表示など、SPAならではの動作を実装。
- **モバイル対応**: スマートフォン閲覧時はエクスプローラーをドロワーメニュー化し、ステータスバーを最適化するなど、レスポンシブデザインに完全対応。

## 🛠️ 技術スタック・アーキテクチャ

### コア

- **フレームワーク**: [Next.js 16 (App Router)](https://nextjs.org/)
- **言語**: [TypeScript](https://www.typescriptlang.org/)
- **デプロイ**: [Vercel](https://vercel.com/)
- **パッケージマネージャー**: [pnpm](https://pnpm.io/)
- **アナリティクス**: [Vercel Analytics](https://vercel.com/analytics)、[Vercel Speed Insights](https://vercel.com/docs/speed-insights)

### UIとスタイリング

- **スタイリング**: [Tailwind CSS v4](https://tailwindcss.com/)
  - **カラー**: `#1E1E1E`（エディター背景）、`#252526`（サイドバー）、`#007ACC`（ステータスバーブルー）
- **フォント**: `Inter`（UI）、`JetBrains Mono`（コード・エディター）、`Yomogi`（手書き風）
- **アイコン**: [Lucide React](https://lucide.dev/)、[React Icons](https://react-icons.github.io/react-icons/)

### 🚀 パフォーマンスとセキュリティ

- **高パフォーマンス**: `fs.promises` とReactの `cache()` を活用した完全非同期のデータフェッチにより、Node.jsのI/Oブロッキングを排除し、高速なページロード（TTFB最適化）を実現。
- **クリーンアーキテクチャ**: 肥大化しやすいMDXコンポーネント群を独立ファイルに分離（`mdx-components.tsx`）し、保守性と再利用性を高めた堅牢なコード設計。
- **セキュリティ重視**:
  - `path.basename` によるパストラバーサル（LFI）攻撃の防止。
  - JSON-LD出力時の `<` エスケープ処理によるXSS（クロスサイトスクリプティング）対策。
  - `next.config.ts` での強固なセキュリティヘッダー（HSTS、X-Frame-Options、X-Content-Type-Optionsなど）の適用。

### 🤖 SEO・AEO（AI Engine Optimization）戦略

見た目はVS Codeでありながら、クローラーやAI（Perplexity、ChatGPTなど）が完全に解析できる構造を裏側に構築しています。

- **セマンティックHTML**: `<nav role="tablist">`、`<aside>`、`<article>`、`<time>` や `aria-label` などのアクセシビリティタグを徹底的に活用。
- **構造化データ（JSON-LD）**: `Person` および `BlogPosting` スキーマを動的に生成し、AI検索エンジンへスキルや記事の文脈を直接伝える仕組みを実装。
- **サイトマップとRobots**: 全静的・動的ルートの `sitemap.xml` と `robots.txt` を自動生成。
- **動的OGP画像**: `opengraph-image.tsx` により記事ごとに最適化されたOGP画像を動的生成。SNSシェア時の視認性とクリック率を向上。

## 📂 プロジェクト構成

```text
.
├── app/                  # Next.js App Router
│   ├── blog/
│   │   └── [slug]/       # 記事詳細ページ（Markdownレンダリング）
│   │       ├── page.tsx  # 記事本体（async/await最適化済み）
│   │       └── opengraph-image.tsx # 動的OGP生成
│   ├── globals.css       # VS Code Dark+ 配色定義
│   ├── layout.tsx        # ルートレイアウト & Person JSON-LD
│   ├── opengraph-image.tsx # サイト全体用OGP（デフォルト）
│   ├── page.tsx          # トップページ（カテゴリ & タイムライン）
│   ├── sitemap.ts        # 動的サイトマップ生成
│   └── robots.txt/       # robots.txt 生成
├── components/
│   ├── layout/           # セマンティックIDE UIコンポーネント
│   │   ├── activity-bar.tsx # サイドバー開閉トグル
│   │   ├── main-layout.tsx  # クライアント状態管理 & レスポンシブ
│   │   ├── sidebar.tsx      # 再帰的ファイルツリー表示
│   │   └── ...
│   ├── mdx-components.tsx   # MDXカスタムコンポーネント群
│   ├── note-timeline.tsx    # ノートタイムラインUI
│   ├── TableOfContents.tsx  # 目次生成UI
│   └── ui/                  # 共通UIコンポーネント
├── content/
│   ├── posts/            # ブログ記事ファイル（.mdx）
│   └── notes/            # 短いノートファイル（.mdx）
├── lib/
│   ├── file-tree.ts      # ファイルツリー構造の定義
│   ├── projects.ts       # プロジェクト実績データ
│   ├── notes.ts          # ノートデータ取得ロジック
│   └── mdx.ts            # 記事取得・キャッシュロジック（fs.promises）
└── public/
    └── images/           # 静的アセット & アプリアイコン
```

## 🗺️ 開発ロードマップ

### Phase 1: 記事を表示する（完了 ✅）
- [x] プロジェクト作成 & 初期設定
- [x] MDX環境のセットアップ・Frontmatter定義

### Phase 2: デザイン刷新 - VS Code化（完了 ✅）
- [x] 全体レイアウトのIDE化（`h-screen`、画面分割）
- [x] コンポーネント分割（`ActivityBar`、`Sidebar`、`TabBar` など）
- [x] モバイルレスポンシブ対応

### Phase 3: SEO・AEO最適化（完了 ✅）
- [x] セマンティックHTML & 構造化データ（JSON-LD）
- [x] 動的OGP生成 & サイトマップ / robots.txt

### Phase 4: パフォーマンス・セキュリティ・機能拡張（完了 ✅）
- [x] カテゴリ別記事一覧 & タイムライン実装（`app/page.tsx`）
- [x] 目次（TOC）の自動生成機能
- [x] 非同期ファイルI/O（`fs.promises`）と `React.cache()` による高速化
- [x] パストラバーサル・XSS対策およびセキュリティヘッダーの導入
- [x] MDXコンポーネントの分離によるコード設計の改善

### Phase 5: コンテンツ拡充 & さらなる進化（進行中 🚧）
- [ ] **About Me（AEO強化）**: AI検索に引用されやすい「Q&A形式」の自然言語セクションを追加
- [ ] **コンテンツ**: Next.jsやUnityに関する技術解説記事の執筆

## 👤 作者

**Yuto Nagata**

- Webデベロッパー（Next.js / React）
- ゲームクリエイター（Unity）
- 諏訪公立大学 在学中

---

© 2026 Darkmocha Blog. Built with Code & Coffee.