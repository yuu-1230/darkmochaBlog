# 多言語化（日本語 / 英語）設計

darkmocha.dev を日英2言語で配信するための設計。実装前の合意用ドキュメント。

## 1. ゴールと非ゴール

**ゴール**

- 英語話者が `/en` 配下でサイト全体（UI・記事）を英語で読める
- ヘッダーの言語スイッチャーで日英を切り替えられる
- 既存の日本語URL（`/blog/xxx` など）は**変わらない** — 被リンク・検索順位を落とさない
- 英訳がまだ無い記事があっても破綻しない（翻訳は少しずつ進める前提）

**非ゴール**

- 全記事の即時英訳（記事翻訳は継続タスクとして切り離す）
- ノート（つぶやき）の英訳 → §6 で扱いを決める
- 機械翻訳の自動組み込み

## 2. 現状の棚卸し

| 項目 | 現状 |
|---|---|
| フレームワーク | Next.js 16.1.6 / App Router / React 19 |
| i18nライブラリ | 未導入 |
| ルーティング | `app/` 直下にフラット配置（`[locale]` セグメント無し） |
| `<html lang>` | [layout.tsx:88](../app/layout.tsx#L88) で `"ja"` 固定 |
| `proxy.ts` | **存在しない**（新規作成が必要）。Next.js 16 で `middleware.ts` から `proxy.ts` にリネームされた（破壊的変更） |
| 記事 | `content/posts/*.mdx` 7本、すべて日本語 |
| ノート | `content/notes.json`、日本語のつぶやき |
| UI文字列 | 24ファイルに直書き（辞書ファイル無し）。UI表示される日本語は**約85箇所** |
| クライアントコンポーネント | `home-client` / `about` / `projects` / `search-dialog` / `site-header` / `site-footer` が `"use client"` |

> 補足: `grep` で日本語がヒットするのは150行あるが、その多くはコメントと**正規表現の文字クラス**（`lib/mdx.ts` の読了時間計算、`lib/notes.ts` のタグ抽出、`lib/search-utils.ts`）。これらは翻訳対象外で、むしろ**そのまま残す必要がある**。

## 3. 技術選定

**next-intl 4.13.x を採用する。**

- peerDeps が `next: ^16.0.0` を明示的にサポート済み（確認済み）
- Server Component / Client Component の両方で同じ辞書を扱える。このリポジトリはクライアントコンポーネントが多く、辞書を props でバケツリレーするのは現実的でない
- `localePrefix: "as-needed"` により「日本語はプレフィックス無し・英語は `/en`」が標準機能で実現できる（§4 の要件に直結）
- ロケール対応の `Link` / `useRouter` / `usePathname` が提供され、言語スイッチャーの実装が数十行で済む

自前辞書でも作れるが、`as-needed` プレフィックス・cookie 永続化・静的レンダリング（`setRequestLocale`）を自作するコストの方が高い。

## 4. ルーティング設計

### URL 構造

```
日本語（デフォルト・プレフィックス無し）      英語
/                                            /en
/blog                                        /en/blog
/blog/thai-travel                            /en/blog/thai-travel
/blog/tags/Unity                             /en/blog/tags/Unity
/about /projects /travel /notes-timeline     /en/about /en/projects /en/travel
/feed.xml                                    /en/feed.xml
```

**なぜ `/ja` を付けないか**: 既に公開・インデックス済みのサイトで、全URLを `/ja/...` に移すと 301 が全ページに発生し、外部リンク（Zenn/Qiita/X からの流入）も一段挟まる。得るものが「対称性」だけなので割に合わない。

### ディレクトリ構造

```
app/
  [locale]/                  ← 既存ページをすべてこの下へ移動
    layout.tsx               ← <html lang={locale}>, metadata, Providers
    page.tsx
    not-found.tsx
    blog/
      page.tsx
      [slug]/
        page.tsx
        opengraph-image.tsx
      tags/[tag]/page.tsx
    about/ projects/ travel/ notes-timeline/
    opengraph-image.tsx
    feed.xml/route.ts        ← ja/en 両方をここで生成
  api/search/route.ts        ← [locale] の外。?locale= で切替
  sitemap.ts                 ← [locale] の外。両ロケールを1本に集約
  robots.txt/route.ts        ← [locale] の外
  globals.css
proxy.ts                     ← 新規（Next 16 での middleware.ts の後継）
i18n/
  routing.ts                 ← locales, defaultLocale, localePrefix
  request.ts                 ← next-intl の getRequestConfig
  navigation.ts              ← createNavigation の re-export
messages/
  ja.json
  en.json
```

### routing 設定の要点

```ts
// i18n/routing.ts（イメージ）
export const routing = defineRouting({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  localePrefix: "as-needed",
  localeDetection: false,   // ← 意図的に OFF
});
```

**`localeDetection: false` にする理由**: `Accept-Language` による自動リダイレクトを有効にすると、日本語話者が英語版に飛ばされたり、SNS で共有された `/blog/xxx` が閲覧者ごとに違う言語になったりする。切り替えは**ユーザーの明示的な操作のみ**とし、選択は next-intl が `NEXT_LOCALE` cookie に保存して次回以降維持する。

初回訪問の英語話者への導線が欲しくなったら、後から「English version available」の控えめなバナーを足せばよい（リダイレクトより安全）。

## 5. コンテンツ（MDX）設計

### ディレクトリ分割方式を採用

```
content/posts/
  ja/
    thai-travel.mdx
    graduation-bucket-list.mdx
    ...（既存7本を git mv）
  en/
    thai-travel.mdx        ← 英訳できたものから置く
```

**同一 slug で日英を対応付ける。** `translationOf` のような frontmatter フィールドは不要。

サフィックス方式（`thai-travel.en.mdx`）と比較して、

- 翻訳の進捗が `ls content/posts/en` で一目で分かる
- ファイル名から slug をそのまま取れる（`.en` を剥がす特殊処理が不要）
- 3言語目を足しても構造が壊れない

file move は7本のみなので初期コストは無視できる。

### `lib/mdx.ts` の変更

```ts
getPost(slug, locale)      // content/posts/{locale}/{slug}.mdx
getAllPosts(locale)        // 該当ロケールのディレクトリのみ読む
hasTranslation(slug, locale)  // 言語スイッチャーの出し分け用（新規）
```

`calcReadTime` は日英混在を既に想定した実装（日本語400字/分 + 英語200語/分）なのでそのまま流用できる。`calcProgress` も言語非依存。

### 翻訳が無い記事の扱い（重要）

| ケース | 挙動 |
|---|---|
| `/en/blog` の一覧 | **英訳済み記事のみ**表示。未訳は出さない |
| `/en/blog/{未訳slug}` に直接アクセス | 404 にせず、日本語版へのリンクを添えた案内を出す（または `/blog/{slug}` へ 307） |
| hreflang | 英訳が存在する記事にのみ `alternates.languages.en` を張る。無い記事に張ると Google 側で「翻訳漏れ」扱いになる |
| 言語スイッチャー | 記事詳細では英訳の有無を判定し、無ければ `/en/blog`（一覧）へフォールバック |

未訳記事を「日本語本文のまま英語UIで出す」案は、英語ユーザーの体験が悪く SEO 的にも不利なので採らない。

## 6. データ・その他コンテンツの扱い

| 対象 | 方針 |
|---|---|
| `lib/projects.ts` (14箇所の日本語) | `description` / `learned` の型を `Record<Locale, string>` に変更。データはデータのまま持ち、辞書には移さない（プロジェクト追加時に1ファイルで完結させるため） |
| `content/notes.json`（つぶやき） | **翻訳しない。** 英語版ではナビから `notes-timeline` を外す。1〜2行のつぶやきを都度英訳する運用は続かない |
| `lib/blog-sections.ts` の `SECTION_TITLES` | 既に英語（`Web / Tech` 等）。そのまま両言語で使う |
| `lib/constants.ts` の `CATEGORIES` / タグ | 翻訳しない。タグは URL の一部でもあり、言語をまたいで同一のキーとして扱う |
| `docs/writing-guide.md` | 翻訳不要（執筆者向け） |

## 7. UI辞書設計

`messages/{ja,en}.json` にページ単位のネームスペースで格納する。

```
common      nav（blog/notes/travel/project/about）, skipLink, theme, menu, footer
home        ヒーロー文言, Pinned, Recent Posts
blog        一覧見出し, 件数, 空状態
post        更新, Back to Home, Thanks for reading, 目次, 関連記事, シェア
tags        タグ別一覧の見出し・件数
notes       タイムライン見出し
travel      見出し, 「旅行記事は準備中です」
projects    見出し, 「学んだこと」ラベル
about       セクション見出し, GitHub草グラフのラベル
search      プレースホルダ, 結果件数, 空状態, キーボードヒント（14箇所と最多）
notFound    404 文言
```

規模は**約85キー**。ファイル別の内訳（多い順）:

| ファイル | 箇所 |
|---|---|
| [lib/projects.ts](../lib/projects.ts) | 14（データ、§6の方針で別扱い） |
| [components/search-dialog.tsx](../components/search-dialog.tsx) | 14 |
| [components/github-contribution-graph.tsx](../components/github-contribution-graph.tsx) | 7 |
| [components/note-timeline.tsx](../components/note-timeline.tsx) / [app/travel/page.tsx](../app/travel/page.tsx) / [app/blog/tags/[tag]/page.tsx](../app/blog/tags/[tag]/page.tsx) | 各5 |
| その他18ファイル | 各1〜3 |

多くのファイルは `aria-label` が1〜2個あるだけで、機械的な置換で済む。

## 8. 言語スイッチャー（ヘッダー）

`components/language-switcher.tsx`（client component）を新規作成し、[site-header.tsx](../components/site-header.tsx) の `<SearchDialog />` と `<ThemeToggle />` の間に置く。

- next-intl の `usePathname()` はロケールを除いたパスを返すので、`router.replace(pathname, { locale: "en" })` で**同じページの別言語**へ遷移できる
- UI: `Languages` アイコン（lucide-react、導入済み）+ 小さなドロップダウンで `日本語 / English`。既存の `ThemeToggle` と同じ `p-1.5 rounded-md` のスタイルに揃える
- モバイル: ヘッダーが既に「検索・テーマ・ハンバーガー」で埋まっているため、**ドロワー内のフッター部**（現在 `© Yuto Nagata 2026` がある位置）に配置する
- 記事詳細ページでは、サーバー側で判定した英訳の有無を props で受け取り、無ければ `/en/blog` へフォールバック（§5）

## 9. SEO・配信まわり

| 項目 | 対応 |
|---|---|
| `<html lang>` | `[locale]/layout.tsx` で `lang={locale}` |
| hreflang | 各ページの `generateMetadata` で `alternates.languages: { ja, en, "x-default": ja }`。記事は英訳がある場合のみ `en` を張る |
| OpenGraph | `locale: "ja_JP" / "en_US"` を出し分け |
| JSON-LD | [lib/jsonld.ts](../lib/jsonld.ts) に `inLanguage` を追加 |
| sitemap | [app/sitemap.ts](../app/sitemap.ts) を両ロケール対応に。各エントリに `alternates.languages` を付ける（`MetadataRoute.Sitemap` がサポート） |
| RSS | [app/feed.xml/route.ts](../app/feed.xml/route.ts) の生成ロジックを `lib/feed.ts` に切り出し、`/feed.xml`（`<language>ja</language>`）と `/en/feed.xml`（`en`）の2本を出す |
| OG画像 | [lib/og-image.ts](../lib/og-image.ts) の `loadJapaneseFontSubset` は、英語タイトルなら**不要**。ロケールで分岐すればビルド時の Google Fonts fetch を削減できる |
| 検索API | `/api/search?locale=en` でインデックスを分ける。日本語記事が英語検索に混ざらないように |
| Giscus | [components/giscus-comments.tsx](../components/giscus-comments.tsx) の `lang` prop に locale を渡す |
| ビルド | `generateStaticParams` に locale が加わり、静的生成ページ数が最大2倍（現状規模では問題なし） |

## 10. 段階的な実装計画

| Phase | 内容 | 目安 | 状態 |
|---|---|---|---|
| 0 | next-intl 導入、`i18n/`・`proxy.ts` 作成、`app/[locale]/` へ移設、`<html lang>` 対応 | 0.5〜1日 | ✅ 完了 |
| 1 | `messages/{ja,en}.json` を作り、約85箇所のUI文言を差し替え | 0.5〜1日 | ✅ 完了 |
| 2 | 言語スイッチャー実装（ヘッダー＋モバイルドロワー） | 0.25日 | ✅ 完了 |
| 3 | `content/posts/{ja,en}/` へ移行、`lib/mdx.ts` の locale 対応、未訳記事のフォールバック | 0.5日 | 未着手 |
| 4 | hreflang / sitemap / feed / OG画像 / 検索API / JSON-LD | 0.5日 | 未着手 |
| 5 | `lib/projects.ts` の多言語化、英語版ナビから notes を除外 | 0.25日 | 未着手 |
| — | **記事の英訳**（継続） | 1本あたり0.5〜1時間 | 未着手 |

**基盤の実装は合計2.5〜4日。** Phase 0〜2 まで終えれば「英語UI + 日本語記事」の状態でデプロイでき、そこから記事を1本ずつ英訳して育てられる。

### Phase 0〜2 実装時の補足

- **canonical はスコープ外だったが対応した。** 各ページの `alternates.canonical` が `${SITE_URL}/about` 固定のままだと、`/en/about` が「正規URLは日本語版」と宣言してしまい Google に英語版を無視される。Phase 4 を待たずに壊れるため、`lib/locale-url.ts` を追加して locale 込みの canonical を返すようにした。**hreflang（`alternates.languages`）は Phase 4 のまま未対応。**
- **辞書化の線引き**: UIラベル・ボタン・見出し・aria-label・ページ説明文は英訳した。一方、about ページの Bio 3段落と [lib/projects.ts](../lib/projects.ts) の説明文は**日本語のまま** `en.json` に入れてある（本人の紹介文なので後で推敲する前提）。
- **未対応で残っている日本語**: `lib/projects.ts`（Phase 5）、`content/notes.json`、記事本文（Phase 3）。それ以外のソース中の日本語はコメントと正規表現の文字クラスのみ。

## 11. 決めておきたいこと

1. 記事の英訳は**全記事**を目指すか、**技術記事（Tech/Unity）のみ**にするか。旅行記・バケットリストは日本語のままでも良いのでは
2. Phase 0〜2 完了時点（英語UI・記事は日本語のみ）を一度デプロイするか、記事翻訳が数本揃うまで伏せるか
3. 英語版のサイト説明文（`Engineer and Everyday life Blog by Yuto Nagata` は既に英語なのでそのまま使える）
