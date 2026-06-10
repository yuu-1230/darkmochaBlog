# darkmocha.dev

**Yuto Nagata** のパーソナルブログ。技術・ゲーム開発・旅行を発信。

🌐 **[darkmocha.dev](https://www.darkmocha.dev)**　|　🗃 **[v1 アーカイブ](https://v1.darkmocha.dev)**

---

## 技術スタック

| カテゴリ | 採用技術 |
|----------|----------|
| フレームワーク | [Next.js 16](https://nextjs.org/) (App Router) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS v4 |
| アニメーション | Motion (Framer Motion) |
| コンテンツ | MDX（gray-matter）|
| デプロイ | Vercel |
| パッケージ管理 | pnpm |

---

## 主な機能

- **ブログ** — MDX による記事管理。カテゴリ（Tech / Unity / Life）別表示
- **Daily Notes** — 短文ログ。ハッシュタグフィルタリング対応
- **サイト内検索** — `Cmd+K` で起動。記事本文・Notes・Projects を横断検索し、マッチしたセクションへ直接ジャンプ
- **コメント** — Giscus（GitHub Discussions 連携）
- **モバイル対応** — ハンバーガーメニュー、スライドドロワー
- **目次（TOC）** — 記事内の見出しから自動生成
- **ダークモード** — システム設定に連動（Solarized Light / Everforest Dark）
- **RSS フィード** — `/feed.xml` を自動生成
- **SEO** — JSON-LD 構造化データ（BlogPosting・パンくず）、sitemap、記事ごとの OG 画像自動生成

---

## ディレクトリ構成

```
.
├── app/
│   ├── api/search/         # 全文検索 API
│   ├── blog/[slug]/        # 記事詳細ページ（OG 画像自動生成付き）
│   ├── notes-timeline/     # Daily Notes
│   ├── projects/           # 制作物一覧
│   ├── travel/             # 旅行記
│   ├── about/              # プロフィール
│   ├── feed.xml/           # RSS フィード
│   ├── sitemap.ts          # サイトマップ自動生成
│   └── robots.txt/         # robots.txt
├── components/
│   ├── mdx/                # MDX カスタムコンポーネント
│   │   ├── typography.tsx  #   見出し・段落・リスト・テーブル
│   │   ├── code.tsx        #   コードブロック
│   │   ├── media.tsx       #   画像（ImageSlider 連携）
│   │   ├── callouts.tsx    #   Tip / Warning / Info
│   │   └── links.tsx       #   リンク・InstagramLink
│   ├── site-header.tsx     # ヘッダー & ハンバーガーメニュー
│   ├── search-dialog.tsx   # 検索ダイアログ（Cmd+K）
│   ├── note-timeline.tsx   # Notes タイムライン
│   ├── PostCard.tsx        # 記事一覧カード
│   ├── HeroImage.tsx       # 記事ヒーロー画像
│   ├── MacWindowBar.tsx    # macOS 風ウィンドウバー
│   ├── PostNavigation.tsx  # 前後記事ナビゲーション
│   ├── ImageSlider.tsx     # 記事内画像スライダー（Swiper）
│   ├── TableOfContents.tsx # 目次コンポーネント
│   └── giscus-comments.tsx # コメント欄（Giscus）
├── content/
│   ├── posts/              # ブログ記事（.mdx）
│   └── notes.json          # Daily Notes データ
├── lib/
│   ├── mdx.ts              # 記事取得・readTime 自動計算
│   ├── constants.ts        # サイト URL・著者・カテゴリ定数
│   ├── blog-sections.ts    # カテゴリ別セクション生成
│   ├── toc.ts              # 目次の自動生成
│   ├── jsonld.ts           # JSON-LD（BlogPosting / パンくず）生成
│   ├── notes.ts            # Notes 取得・タグ抽出・JST 日付処理
│   ├── projects.ts         # プロジェクトデータ
│   └── search-utils.ts     # 検索ユーティリティ（セクション分割・スニペット生成）
└── public/
    └── images/             # 画像アセット
```

---

## ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/yuu-1230/darkmochaBlog.git
cd darkmochaBlog

# 依存関係インストール
pnpm install

# 開発サーバー起動
pnpm dev
```

`http://localhost:3000` でアクセス。

---

## 記事の書き方

`content/posts/` に `.mdx` ファイルを作成：

```mdx
---
title: "記事タイトル"
date: "2026-05-07"
update: "2026-05-10"    # 更新日（任意。sitemap / JSON-LD の dateModified に反映）
category: "Tech"        # Tech | Unity | Life
tags: ["Next.js", "React"]
description: "記事の説明"
image: "/images/Articles/xxx/hero.jpg"
draft: false            # true にすると本番環境で非表示
---

本文をここに書く。
```

`readTime` は省略可（本文から自動計算）。

---

## Notes の書き方

`content/notes.json` に追記：

```json
{
  "id": "7",
  "content": "今日の気づき。 #Tech #Life",
  "createdAt": "2026-05-07T10:00:00",
  "image": "photo.jpg"
}
```

- `createdAt` はタイムゾーン省略で JST として扱われる
- `image` は `public/images/Notes/` 配下のファイル名のみ指定

---

## 作者

**Yuto Nagata** — 諏訪公立大学 在学中

[![GitHub](https://img.shields.io/badge/GitHub-yuu--1230-181717?logo=github)](https://github.com/yuu-1230)
[![X](https://img.shields.io/badge/X-@DarkmochaJP-000?logo=x)](https://x.com/DarkmochaJP)
[![Bluesky](https://img.shields.io/badge/Bluesky-darkmochajapan-0285FF?logo=bluesky)](https://bsky.app/profile/darkmochajapan.bsky.social)

---

© 2026 Yuto Nagata. Built with Next.js & ☕
