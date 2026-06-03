# ブログ執筆ガイド

`content/posts/` に `.mdx` ファイルを作成すればブログ記事として公開されます。  
このドキュメントでは、フロントマターの書き方からカスタムコンポーネントまで、使える構文・機能を網羅しています。

---

## 目次

1. [ファイルの作成](#1-ファイルの作成)
2. [フロントマター](#2-フロントマター)
3. [基本 Markdown 記法](#3-基本-markdown-記法)
4. [文字色の変更](#4-文字色の変更-c-コンポーネント)
5. [画像](#5-画像-imageslider)
6. [リンク](#6-リンク)
7. [外部サイトの埋め込み](#7-外部サイトの埋め込み)
8. [コールアウト（Tip）](#8-コールアウトtip)
9. [脚注](#9-脚注)
10. [テーブル](#10-テーブル)
11. [コードブロック](#11-コードブロック)
12. [その他の要素](#12-その他の要素)

---

## 1. ファイルの作成

```
content/posts/your-article-slug.mdx
```

- ファイル名がそのまま URL の slug になる（例: `thai-travel.mdx` → `/blog/thai-travel`）
- ケバブケース（小文字 + ハイフン）推奨
- 画像は `public/images/Articles/記事名/` に置く

---

## 2. フロントマター

ファイル先頭の `---` で囲まれたブロックがメタデータです。

```yaml
---
title: "記事タイトル"
date: "2026-05-07"
category: "Tech"
tags: ["Next.js", "React"]
description: "記事の概要。OGP・検索結果に使用される。"
image: "/images/Articles/your-article/hero.jpg"
update: "2026-05-10"
draft: false
---
```

| フィールド    | 必須 | 値                          | 説明                                          |
| :------------ | :--: | :-------------------------- | :-------------------------------------------- |
| `title`       |  ✅  | 文字列                      | 記事タイトル。ブラウザタブ・OGPに使用         |
| `date`        |  ✅  | `"YYYY-MM-DD"`              | 公開日。記事一覧の並び順に使用                |
| `category`    |  ✅  | `"Tech"` / `"Unity"` / `"Life"` | カテゴリフィルタに使用                    |
| `tags`        |      | `["tag1", "tag2"]`          | タグ。複数指定可                              |
| `description` |      | 文字列                      | サマリー。OGP・検索スニペットに表示           |
| `image`       |      | `/images/Articles/.../file` | ヒーロー画像。OG イメージにも使用            |
| `update`      |      | `"YYYY-MM-DD"`              | 最終更新日                                    |
| `readTime`    |      | 文字列（例 `"5 min read"`） | 省略時は本文から自動計算                      |
| `draft`       |      | `true` / `false`            | `true` にすると本番環境（Vercel）で非表示     |

> **Tips**: `draft: true` にすると開発環境では見えるが Vercel デプロイ後には表示されない。書きかけの記事に使う。

---

## 3. 基本 Markdown 記法

### 見出し

```markdown
## セクション見出し（目次に表示される）

### サブ見出し（目次に表示される）

#### 以下の深さは目次に出ない
```

> `##`（h2）と `###`（h3）のみ目次（TOC）に自動反映される。

### 段落と改行

```markdown
これは1つの段落です。

空行で段落を分けます。

行末にバックスラッシュ `\` で強制改行。\
こんな感じ。

行末に半角スペース2つでも改行できます。  
こんな感じ。
```

### テキスト装飾

```markdown
**太字**
*イタリック*
~~打ち消し線~~
**_太字イタリック_**
```

### 水平線

```markdown
---
```

---

## 4. 文字色の変更（C コンポーネント）

`<C c="色名">テキスト</C>` で文字色を変えられます。

```mdx
<C c="red">赤いテキスト</C>
<C c="blue">**青い太字**</C>
<C c="green">緑色</C>
```

**使えるカラー名：**

| 名前      | 表示色         |
| :-------- | :------------- |
| `red`     | ローズ 500     |
| `blue`    | ブルー 500     |
| `green`   | エメラルド 500 |
| `orange`  | オレンジ 400   |
| `yellow`  | イエロー 400   |
| `purple`  | パープル 500   |
| `comment` | スレート 400   |
| `gray`    | スレート 400   |

名前以外に CSS カラー値も直接指定できます：

```mdx
<C c="#ff6b6b">カスタムカラー</C>
```

---

## 5. 画像（ImageSlider）

画像は必ず `public/images/Articles/記事名/` に置き、MDX 内では `/images/Articles/記事名/` から始まるパスで参照します。

### 1枚表示

```mdx
<ImageSlider images="/images/Articles/your-article/photo.jpg" />
```

### 複数枚スライダー

カンマ区切りで複数パスを渡すとスライダーになります。

```mdx
<ImageSlider images="/images/Articles/your-article/photo1.jpg, /images/Articles/your-article/photo2.jpg, /images/Articles/your-article/photo3.jpg" />
```

- 画像は最大幅 300px・縦横比そのまま・角丸フレームで表示される
- 複数枚の場合はナビゲーションボタンとページドットが付く
- 対応拡張子：`.jpg` / `.jpeg` / `.png` / `.gif` / `.webp`

> **推奨**: 画像はあらかじめ圧縮してからアップロードする。目安は 1 枚あたり 300KB 以下。

---

## 6. リンク

### 外部リンク

```markdown
[リンクテキスト](https://example.com)
```

外部リンクは自動的に `target="_blank" rel="noopener noreferrer"` が付く（新しいタブで開く）。

### 内部リンク（サイト内）

```markdown
[ブログ一覧](/blog)
[記事へ](/blog/your-article-slug)
```

### アンカーリンク（見出しへジャンプ）

見出しの ID は見出しテキストを GitHub slugger でスラッグ化したものになります。

```markdown
[セクション名へ](#section-name)
[Day1 へ](#day1-日本からタイへ)
```

> 日本語見出しもアンカー対応。スペースはハイフンに変換される。

---

## 7. 外部サイトの埋め込み

### Instagram リンクカード

Instagram の投稿・ハイライトをカード形式で表示します。

```mdx
<InstagramLink
  href="https://www.instagram.com/p/xxxxxxxxx/"
  title="投稿のキャプション（省略可）"
/>
```

- `title` を省略すると `"Instagramで動画を見る"` がデフォルト表示される
- クリックで Instagram へ遷移（新しいタブ）

### 通常の外部リンク（カードなし）

OGP カードが不要な場合は、通常の Markdown リンクをそのまま使う：

```markdown
参考：[記事タイトル](https://example.com/article)
```

---

## 8. コールアウト（Tip）

折りたたみ式のコールアウトボックスです。クリックで開閉できます。

### Tip（ヒント・黄色）

```mdx
<Tip type="tip" title="ここに見出し">
  ヒントの内容をここに書きます。**Markdown** も使えます。
</Tip>
```

### Warning（警告・オレンジ）

```mdx
<Tip type="warning" title="注意事項">
  注意したほうがよい内容をここに書きます。
</Tip>
```

### Info（情報・青）

```mdx
<Tip type="info" title="補足情報">
  補足情報をここに書きます。テーブルも書けます。

  | 列1 | 列2 |
  | --- | --- |
  | 値  | 値  |
</Tip>
```

- `title` を省略すると、type に応じたデフォルトタイトル（`TIPS` / `WARNING` / `INFO`）が使われる
- 内部では通常の Markdown とカスタムコンポーネントが使える

---

## 9. 脚注

remark-gfm が有効なので、GitHub Flavored Markdown の脚注記法が使えます。

```markdown
これは本文です[^1]。複数の脚注も使えます[^note]。

[^1]: これが脚注の内容です。
[^note]: こちらは名前付き脚注。記事末尾に自動的にまとめて表示されます。
```

---

## 10. テーブル

remark-gfm が有効なため GFM テーブルが使えます。

```markdown
| 左揃え   | 中央揃え | 右揃え   |
| :------- | :------: | -------: |
| データ1  | データ2  | データ3  |
| **太字** | *斜体*   | `code`   |
```

- ヘッダ行は自動的にスタイルが変わる
- モバイルでは横スクロール対応

---

## 11. コードブロック

### インラインコード

```markdown
`const x = 1` のように書く。
```

### フェンスコードブロック

````markdown
```javascript
const greet = (name) => {
  console.log(`Hello, ${name}!`);
};
```
````

対応言語名（シンタックスハイライト）：`javascript`, `typescript`, `tsx`, `jsx`, `python`, `bash`, `json`, `yaml`, `css`, `html`, `markdown`, `mdx` など。

---

## 12. その他の要素

### 引用（blockquote）

```markdown
> これは引用です。
> 複数行にまたがって書けます。
>
> 段落を分けることもできます。
```

### 箇条書きリスト

```markdown
- 項目1
- 項目2
  - ネストした項目
- 項目3
```

### 番号付きリスト

```markdown
1. 最初
2. 次
3. 最後
```

---

## 付録：よくある書き方のパターン

### 記事テンプレート

```mdx
---
title: "記事タイトル"
date: "2026-05-07"
category: "Tech"
tags: ["タグ1", "タグ2"]
description: "この記事の概要。"
image: "/images/Articles/your-article/hero.jpg"
draft: true
---

リード文をここに書く。記事の概要を 2〜3 文程度でまとめる。

## セクション1

本文...

### サブセクション

本文...

## セクション2

<ImageSlider images="/images/Articles/your-article/photo.jpg" />

<Tip type="tip" title="補足">
  補足情報をここに書く。
</Tip>
```

### 画像の置き場所

```
public/
└── images/
    └── Articles/
        └── your-article/      ← 記事名フォルダを作る
            ├── hero.jpg       ← image: フロントマターに指定
            ├── photo1.jpg
            └── photo2.png
```
