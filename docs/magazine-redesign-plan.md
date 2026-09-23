# Darkmocha Blog：表紙グリッドと見開き読書の設計

> 更新：誌面の正式な執筆仕様は [マガジンMDX仕様](./magazine-mdx-spec.md)。旧テンプレート名を含む説明より新仕様を優先します。

更新日：2026-09-23。試作ブランチ：`codex/magazine-redesign-design`。起点：`codex/r2-image-delivery` の `0bde579`。

**実装状況**：実画像を使ったホーム6件と記事詳細をローカル実装済み。タイ旅行記は日本語21ページ・英語24ページ。今回の実装API・執筆方法・ブラウザ検証結果は[試作の実装・確認記録](./magazine-prototype.md)を参照する。以下の調査表は試作前の記録、後半の型・コンポーネント例は設計案であり、実装済みAPIとの相違は同記録を優先する。

## 結論と今回の範囲

**Next.js・MDX・R2を維持して実現する。ホームは4:5の表紙を等幅3列に並べ、記事は十分な幅と高さがあるPCで1見開きずつ読む。スマホ・長文・文字拡大には全文の縦スクロールを用意する。**

今回の添付画像と確定要件で旧設計を置き換えた。ホームの大小混在や独立したおすすめ・新着・目次は廃止。記事は明示的なMDXページ区切りと共通テンプレートを基本にする。ホームの仕様と記事の仕様を一貫させ、推定値と確認済みの事実を以下で分ける。

9月22日は設計書・ワイヤーフレームまで作成した。9月23日の依頼で実装とローカル確認へ進んだ。既存の正式タイトル・本文・URLを維持し、表紙と誌面用データを追加した。コミット・push・デプロイは行っていない。

## 1. 試作前の構成と制約（9月22日の調査）

### 確認済みの構成

| 項目 | 現状と設計への影響 | 根拠 |
| --- | --- | --- |
| フレームワーク | Next.js 16.1.6、React 19.2.1、TypeScript。App Routerを使用。移行は不要。 | [package.json](/Users/darkmocha/Projects/Web/darkmochaBlog/package.json)、[locale layout](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/layout.tsx:90) |
| スタイル | Tailwind CSS v4、CSS変数、各コンポーネント内のutility class。実インストールはTailwind 4.1.18。 | [globals.css](/Users/darkmocha/Projects/Web/darkmochaBlog/app/globals.css:1)、[PostCard](/Users/darkmocha/Projects/Web/darkmochaBlog/components/PostCard.tsx:7) |
| 言語・URL | 日本語は `/blog/{slug}`、英語は `/en/blog/{slug}`。言語切替・翻訳なし案内がある。 | [routing.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/i18n/routing.ts:3)、[記事ページ](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/blog/[slug]/page.tsx:115) |
| 記事管理 | `content/posts/ja/*.mdx`・`en/*.mdx`をGit管理。gray-matterでfrontmatterを読み、MDXRemoteのRSC版で描画。CMSは使っていない。 | [mdx.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/mdx.ts:31)、[mdx-document.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/mdx-document.tsx:14) |
| 記事数 | 追跡済みMDXは日本語7本・英語6本。別に未追跡の日本語draftが2本ある。公開対象判定上は13ファイル・7種類の記事。 | [日本語記事](/Users/darkmocha/Projects/Web/darkmochaBlog/content/posts/ja)、[英語記事](/Users/darkmocha/Projects/Web/darkmochaBlog/content/posts/en)、Git一覧とfrontmatterを集計 |
| ホーム | pinnedと直近5本を抽出し、Client Componentへ渡す。本文データも含むPostDataを渡している。自己紹介とターミナル風の表が中心。 | [ホーム](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/page.tsx:16)、[home-client.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/home-client.tsx:41) |
| 記事一覧 | `/blog`はTech / Unity / Life別。64×48pxの小さなサムネイル、1行に省略したタイトルを使用。 | [一覧ページ](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/blog/page.tsx:28)、[blog-sections.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/blog-sections.ts:15)、[PostCard](/Users/darkmocha/Projects/Web/darkmochaBlog/components/PostCard.tsx:13) |
| 記事生成 | generateStaticParamsで実在記事を列挙。本文に見出しID、コードハイライト、GFMを適用。目次・関連記事・前後移動を組み立てる。 | [記事ページ](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/blog/[slug]/page.tsx:104)、[MDX設定](/Users/darkmocha/Projects/Web/darkmochaBlog/components/mdx-document.tsx:19) |
| 画像 | MDXの`/images/...`を表示時に`images.darkmocha.dev`へ解決。現在ローカルのpublic画像はfaviconの`icon.png`のみ。記事以外のプロフィール・OG等もリモートへ向く。 | [image-url.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/image-url.ts:13)、[next.config.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/next.config.ts:28)、[README](/Users/darkmocha/Projects/Web/darkmochaBlog/README.md:123) |
| 最適化 | next/image、AVIF/WebP、30日キャッシュ、deviceSizesは640〜1280。旧画像URLのリダイレクトあり。 | [next.config.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/next.config.ts:11) |
| デプロイ・CI | README上はVercel。CIはNode 22 / pnpm 11.13.1でtypecheck・lint・test・build。push起動対象はmain・feat/**なのでcodex/**のpushだけでは起動しない。main向けPRは対象。 | [README](/Users/darkmocha/Projects/Web/darkmochaBlog/README.md:9)、[ci.yml](/Users/darkmocha/Projects/Web/darkmochaBlog/.github/workflows/ci.yml:3) |

### 大きく変える必要がある部分

- **全ページの幅**：親のmainが`max-w-4xl`、ホームが`max-w-2xl`、記事は`max-w-3xl`と多重に狭い。写真だけを大きくしても外側で制限される。[layout:155](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/layout.tsx:155)
- **画像パーツ**：通常のMarkdown画像もImageSliderへ変換。最大幅は300 / 420 / 560px、角丸・枠・影があり、全画像に600×450の寸法を指定している。実写真と縦横比が違う場合のずれを検証する必要がある。複数枚はautoHeightのSwiper。[media.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/mdx/media.tsx:6)、[ImageSlider:35](/Users/darkmocha/Projects/Web/darkmochaBlog/components/ImageSlider.tsx:35)
- **記事の骨格**：メイン画像→Mac風タイトルバー→情報・タイトル→著者・いいね→目次→本文という順序。写真と文章の幅を変える誌面には、記事を囲う枠から再設計する必要がある。[記事ページ:168](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/blog/[slug]/page.tsx:168)
- **文字とテーマ**：Yomogi / JetBrains Mono / Playfair Displayを読み込んでいる。現行実装はダークが既定、システム追従は無効。カテゴリでhtml全体の色も切り替える。READMEの「システム設定に連動」と実装は異なるため、実装を根拠とした。[layout:20](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/layout.tsx:20)、[providers.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/providers.tsx:5)、[globals.css:211](/Users/darkmocha/Projects/Web/darkmochaBlog/app/globals.css:211)
- **執筆ガイドのずれ**：現在のガイドには旧ディレクトリと「画像最大300px」が残る。実装時に言語別の保存場所・新パーツ・実寸管理まで更新する。[writing-guide.md](/Users/darkmocha/Projects/Web/darkmochaBlog/docs/writing-guide.md:25)

### 維持する機能・境界

| 維持対象 | 移行時の扱い・根拠 |
| --- | --- |
| slug・記事本文・公開日 | ファイル名と既存URLを保持。見た目だけの変更で公開日・更新日を一括書換しない。[mdx.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/mdx.ts:54) |
| SEO | title・description・canonical・翻訳が存在する言語だけのhreflang・OG/Twitter・BlogPosting/Breadcrumb・sitemap・RSSを保持。[記事metadata](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/blog/[slug]/page.tsx:49)、[jsonld.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/jsonld.ts:7)、[sitemap.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/app/sitemap.ts:18)、[feed.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/feed.ts:20) |
| 検索・見出しリンク | 記事・Notes・Projects横断検索と章へのジャンプを維持。抽出は現在正規表現中心なので、新MDXパーツ内の本文・キャプションを検証する。[search route](/Users/darkmocha/Projects/Web/darkmochaBlog/app/api/search/route.ts:21)、[search-utils.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/search-utils.ts:9)、[toc.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/toc.ts:11) |
| カテゴリ・タグ | Tech / Unity / Lifeと`/blog/tags/{tag}`を保持。カテゴリ専用URLは現状ない。カテゴリー導線は既存の記事一覧に集約し、ホームに独立目次を追加しない。[tags.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/tags.ts:13) |
| travel等の既存ページ | `/travel`は現在TravelタグではなくLife全体を表示している。表示範囲は今回のデザイン変更では維持。Notes・Projects・About・旧サイトへのリンクも残す。[travel:35](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/travel/page.tsx:35)、[site-header](/Users/darkmocha/Projects/Web/darkmochaBlog/components/site-header.tsx:14)、[site-footer](/Users/darkmocha/Projects/Web/darkmochaBlog/components/site-footer.tsx:24) |
| いいね・コメント | いいねのpostIdはslug、Giscusはpathnameを使用する。配置変更後も同じID・URLで接続し、保存先やデータは移行しない。[ArticleEngagement](/Users/darkmocha/Projects/Web/darkmochaBlog/components/blog/ArticleEngagement.tsx:18)、[記事ページ:244](/Users/darkmocha/Projects/Web/darkmochaBlog/app/[locale]/blog/[slug]/page.tsx:244)、[Giscus:31](/Users/darkmocha/Projects/Web/darkmochaBlog/components/giscus-comments.tsx:31) |
| 公開制御 | draftはproductionで除外。`/docs`もproductionで404/noindex。プレビュー用デプロイもproductionモードならdraftは表示されない。[mdx.ts:90](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/mdx.ts:90)、[proxy.ts:26](/Users/darkmocha/Projects/Web/darkmochaBlog/proxy.ts:26) |
| 操作 | 検索のキーボード操作、言語・テーマ切替、共有、画像操作、目次、コード・表・Tip・脚注・チェックリストを保持。pinned記事の進捗は記事内等で引き継ぎ、ホームの独立セクションにはしない。 |

### 確認範囲の限界

設計段階では開発サーバーのホームとタイ旅行記をデスクトップで閲覧した。現在のビルド・テスト・画面確認結果は[試作の実装・確認記録](./magazine-prototype.md)に記載。本番との一致、モバイル実機、Neonへの保存、Giscus投稿、現在のVercel設定・利用枠・計測値は未確認。

R2を使う構成は現在のコード・READMEから確認した。管理画面のバケット設定を調べたわけではない。元のタイ夜景画像はブラウザで**1920×1440px**と確認できた。これだけで他の写真の解像度や速度は判断しない。

## 2. 今回の画像を基準にした変更

### 閲覧した資料と観察事実

2026-09-22に添付された3枚をすべて閲覧した。画像の寸法はファイルから確認した。以下の構図は観察事実、後述のCSS値・書体名・表示条件は設計上の初期値であり、画像から取得した実装値ではない。

| 添付資料 | 観察できる特徴 | 採用範囲 |
| --- | --- | --- |
| 暗いホーム：`codex-clipboard-c1532bb7-fbfb-4c2d-be1f-8f89b2072952.png`、1024×1536 | 等幅3列・2段、縦長表紙、明るい細身の文字、暗い背景、控えめな暖色のカテゴリー、細いフッター罫線。題字は左寄せ。 | ダークテーマの色・文字の印象。ヘッダー位置は明るい画像に統一する。 |
| 明るいホーム：`codex-clipboard-a14c0534-28b6-4df5-ac21-5c80f72cf265.png`、1122×1402 | 中央の大きな題字、左右の控えめな情報、等幅3列・2段、行ごとに整列した表紙、表紙下の明朝風タイトル・短い概要・小さな日付。カードの外枠はない。 | ホームの構造・密度・余白・文字の強弱の基準。 |
| 記事見開き：`codex-clipboard-f5cb3523-d995-4710-a56f-88a4309e1c4a.png`、1536×1024 | 同じ外寸の左右ページ。左は全面写真と白い大見出し、右は紙色の背景と見出し・写真・側面キャプション・短い段組み・小写真。中央に細い溝。上にサイトヘッダー、下にページ送り。 | PCの記事導入と見開きの基本構造。続きのページは同じ写真配置に固定しない。 |

明るい画像の表紙は目視で約330×420pxに見える。暗い画像はそれより細長く見えるが、**ユーザー指定の4:5を両テーマ共通の確定値**とする。厳密な境界測定・元の書体特定はしていない。画像の「余白」、架空の記事・日付・SNSは採用しない。以前のStandart写真は背景資料に下げ、今回の画像と指示を優先する。

### 旧設計との差分

| 項目 | 旧設計 | 今回の確定・推奨設計 |
| --- | --- | --- |
| ホーム冒頭 | おすすめ3本を6 / 3 / 3で強弱付け | 最初から等幅3列。強調は掲載順のみ |
| ホーム構造 | おすすめ、新着、カテゴリー目次、進捗・著者 | ヘッダー → 単一の記事グリッド → フッター |
| 表紙 | 3:4・完成画像の制作を中心に検討 | 4:5・写真＋HTML/CSSが基本。完成画像も選択可能 |
| 概要 | 60〜100字、3〜5行を許容 | PC約2行を目指して短く編集。省略や固定高で隠さない |
| ヘッダー・テーマ | 左寄せ中心、テーマ間の構図は未確定 | Darkmochaを中央に大きく配置。明暗で構図・順序・比率を共通化 |
| 記事PC | 本文と写真を縦スクロール | 十分な幅・高さがあれば、左右2ページを1見開きとしてページ送り |
| 記事スマホ | 1列の縦スクロール | 維持。左ページ → 右ページ → 次の見開きの順に再配置 |
| 執筆 | 単写真・横並び等の誌面パーツ | 共通パーツに明示的なページ境界とページテンプレートを追加 |
| 初回検証 | ホーム一部＋代表記事の導入中心 | ホーム6件以上・全体、記事3見開き以上・末尾まで、長い技術記事も検証 |

## 3. ホームの確定仕様

### 構成・読む順番

1. **ヘッダー**：中央のDarkmochaと控えめなナビ。記事一覧・検索・About、言語・テーマ切替を配置。他の既存リンクはメニュー／フッターにまとめる。スマホは題字の下にナビを折り返す。独立した紹介セクションは設けない。
2. **単一の記事グリッド**：PC3列、タブレット2列、スマホ1列。左から右、上から下のDOM順で読む。カードは「4:5表紙 → 正式タイトル → 短い概要 → 日付・カテゴリー」。優先掲載も同じ大きさ。
3. **フッター**：細い罫線、Darkmocha、既存ページ・RSS・既存SNS等の必要なリンク。進捗は該当記事内に残す。カテゴリーへは既存の一覧ページから到達する。

掲載順は任意の`homeOrder`昇順 → 未指定を公開日降順 → 同日はslug順。指定しない場合は現行pinnedを先頭扱いにする互換規則を設ける。言語間で同じslugには同じ順位を使う。テーマ切替は配列に影響しない。当面は公開記事を全件表示し、件数が増えた時点で同じグリッドのページ分割を検討する。

表紙と正式タイトルを同じ記事URLへのリンクにまとめ、リンク名は正式タイトルから取得する。カテゴリーの導線はその外に置き、リンクを入れ子にしない。ホームの進捗枠を廃止しても、チェックリスト本文と進捗計算は維持する。

### 共通デザイントークン（試作用の推定値）

| 要素 | 初期値・規則 |
| --- | --- |
| 明色 | 背景`#F3F2EC`、文字`#203A32`、補助文字`#52605B`、罫線`#89918A` |
| 暗色 | 背景`#1D1E1B`、文字`#F0EEE6`、補助文字`#B8BAB2`、補助アクセント`#C4A17A`、罫線`#666B63` |
| 書体 | 題字の欧文は既存Playfair Display、和文タイトル・概要・記事本文はNoto Serif JP 400を第一候補、見出し500。UIは既存system sans、コードはJetBrains Mono。最終採用は実文章で比較する |
| ホーム幅 | 最大1320px。PC左右は`clamp(32px, 3.4vw, 48px)`。タブレット32px、スマホ20px、320px幅では16px |
| 列 | 1024px以上3列、768〜1023px2列、767px以下1列。`repeat(n, minmax(0, 1fr))`。段差を作るmasonryは使わない |
| 列・行間隔 | PC列28px、タブレット24px。行間40pxを起点に検証。次の行は前の行の最も高い記事の下から始まる |
| 表紙 | 外寸4:5を予約。画像がなくても同じ外寸。表紙内文字の安全余白は幅の6〜8%。角丸・カード背景・影なし |
| 題字 | PC52〜64px、スマホ34〜40px。明暗で位置・サイズを変えない |
| 表紙下タイトル | PC26〜28px、スマホ24px、行間1.5。全文折返し。長い英単語は`overflow-wrap:anywhere` |
| 概要 | PC15〜16px・行間1.75、約35〜50和文字から編集。画面幅によって3行以上でもよい。line-clamp・固定高なし |
| メタ情報 | 12〜13px・行間1.7。日付とカテゴリーを小さく並べる。カテゴリーは色だけで識別しない |
| 垂直余白 | 表紙→題名16px、題名→概要8px、概要→メタ12px、ヘッダー罫線→グリッド28〜32px、グリッド→フッター40px |

カード自身は`min-width:0`、本文域は可変高。200%文字拡大でも表紙の下の文章を切らず、行を高くする。表紙内の題字が入りきらない場合は、短い表紙題名へ変更、文字主体テンプレートへ変更、または重ね文字を表紙外へ移す拡大時ルールを使う。正式タイトルは常に残す。

写真全体への暗色フィルターは使わない。表紙文字の白／濃色は写真ごとに指定し、サイトの明暗切替で反転させない。局所的なグラデーションは必要な表紙だけに使用する。

### 表紙テンプレート

| 型 | 使用場面 | 調整できる項目 |
| --- | --- | --- |
| `photo` | 写真中心。全面写真＋短い題字＋小さなカテゴリー | 焦点座標、文字位置、横書き／短い縦書き、文字色、局所グラデーション |
| `inset` | ゲーム画面・図版・低解像度写真 | 4:5面の中に元比率で画像を配置。文字は画像外の余白に置く |
| `type` | 写真なし／技術記事 | 短い題名、カテゴリー、細い罫線と余白。無関係なストック写真で埋めない |
| 完成画像 | 既に文字を含む表紙 | `mode: image`。HTMLの題字・カテゴリーを表紙上へ重ねない。下の正式タイトルは表示 |

## 4. 記事の見開き読書体験

### 実現可否・追加の制約

**同じ技術構成で実現可能。ただしCSSだけの変更ではなく、記事構造の解析と読書状態を管理する小さなClient Componentが必要。CMS移行やページめくりライブラリは不要。**

| 現在の実装 | 必要な対応と根拠 |
| --- | --- |
| MDXを記事全体で1回描画 | この原則を維持し、ページ境界を認識する処理を加える。ページごとにMDXを独立コンパイルしない。[mdx-document.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/mdx-document.tsx:14) |
| 目次・検索は別々に正規表現で解析 | 全文を解析する共通インデックスを設け、見出しID→ページIDを追加。現在のIDと比較して互換性を検証。[toc.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/toc.ts:11)、[search-utils.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/search-utils.ts:9) |
| 初期hashへ80ms後にスクロール | 見開きの表示確定後に移動する仕組みへ統合。既存処理と二重にスクロールさせない。[anchor-scroll.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/anchor-scroll.tsx:11) |
| 画像は主にSwiper | 既存記事のスライダーは継続可能。明示的誌面では静止Figureを基本にして高さを予測可能にする。[ImageSlider.tsx](/Users/darkmocha/Projects/Web/darkmochaBlog/components/ImageSlider.tsx) |
| frontmatterを型キャストで取得 | 新項目には実行時検証を追加。未指定の記事は従来の全文表示。[mdx.ts](/Users/darkmocha/Projects/Web/darkmochaBlog/lib/mdx.ts:69) |

### PCの表示条件・寸法

初期条件は画面幅1280px以上・高さ900px以上。さらに実際のヘッダー・操作部を除いた領域で、**1ページ幅520px以上、高さ650px以上を確保し、全ページが指定の本文サイズで収まること**を条件にする。幅だけで判定しない。

ページの初期比率は4:5（参考画像の1ページの縦横比に近い推定値）。利用可能高さをH、利用可能横幅をW、中央溝をgとして、ページ幅を`min((W-g)/2, H×0.8)`、高さを幅÷0.8とする。文字はこの計算で縮小しない。ヘッダー、下部操作、外側余白の実測からHを求める。

1280×720やスマホ横向きは通常表示。1536×1024は参考画像に近い比較対象。ブラウザの文字拡大・フォント読み込み後に収まらなければ通常表示へ切り替える。画像の高さに合わせて本文を小さくしない。

- 左右は同じ外寸。中央溝2〜6px・薄い陰影のみ。左・右ページそれぞれにページ番号を置く。
- 誌面の上：Darkmocha、既存ナビ。ホームと共通の書体・色・罫線。記事のヘッダーは読書面を確保するため高さを抑える。
- 誌面の下：一覧へ戻る、前の見開き、現在位置「01–02 / 全14ページ」、次の見開き。補助操作として目次・全文表示。総ページ数は記事データから求める。
- 1回の前後操作で2ページ進む。最初は「前」を無効化、最後は「次」を無効化して「記事末尾へ」を表示。奇数ページなら最後の右面は装飾的な空白とし、本文ページ数に数えない。
- いいね・共有・関連記事・前後の記事・コメントは誌面の下の末尾領域へ。最終見開きから到達でき、目次・`#comments`等からも直接到達できる。記事間移動と見開き移動は別のラベルにする。

### ページテンプレートと読む順序

| テンプレート | PC | スマホ・通常表示 |
| --- | --- | --- |
| `cover` | 全面写真、カテゴリー、正式h1、短いリード。主題を避けて配置 | 写真と文字が安全に重なる範囲は維持。長い題名／拡大時は題名とリードを写真の下に置く |
| `editorial` | 見出し → 中写真とキャプション → 本文 → 小写真。導入右ページに使用 | 同じ順に1列。キャプションは対応写真の直後 |
| `text` | 写真なしの文章中心。必要時に短い2段組み | 見出し・本文を通常の1列として続ける |
| `photo` | 写真を大きく配置＋説明。縦横比に応じcover/containを選択 | 元比率を基本に表示。説明を直後に置く |
| `mixed` | 本文と1〜2枚の写真。左右配置を変えて変化を作る | DOM順に本文と写真。CSSで意味上の順番を逆転させない |

共通パーツは`Figure`、`PhotoPair`、`Caption`、`PullQuote`。段組みはページ内の短いまとまりに限定し、見開き全体をCSS columnsにしない。日本語1段につき15字以上の行長を確保できる幅だけ2段にする。見出しと直後の段落、写真とキャプションは一緒に扱う。

### 読むための初期値（画像の文字サイズをそのまま縮尺コピーしない）

| 要素 | 推奨初期値 |
| --- | --- |
| 本文 | PC18px・行間1.9、スマホ17px・行間1.9。和文明朝400。紙面内の本文は約22〜32字/行、短い段組みは15〜18字/行 |
| 通常表示 | 本文最大36em、英語最大65ch。画面の左右20px、320px幅では16px |
| 正式タイトル | PC40〜60px・行間1.4、スマホ30〜36px・行間1.5。全文表示 |
| 章見出し | PC26〜32px、スマホ24〜28px・行間1.5 |
| キャプション | 13〜14px・行間1.7。明朝を維持しつつ小さくしすぎない |
| 紙面内余白 | 40〜56px。中央側にも同程度の安全余白。段落間1em、写真と本文の間24〜32px |

通常表示ではページ外寸・固定高さ・溝を解除し、全ページが左→右→次の見開きの順に縦へ流れる。ページごとの不要な大きな空白を詰める。モバイルに前後操作を必須にしない。画像は拡大表示でき、図やコードの可読性を優先する。

## 5. ページ分割方式の比較と推奨

| 方式 | 誌面再現性 | 執筆負担 | 幅・フォント・翻訳への耐性 | 既存記事 |
| --- | --- | --- | --- | --- |
| 1. MDXで明示的なページ境界・型を指定 | 高い。写真と文章の関係を編集できる | ページ単位の確認が必要 | 収まり検証が必要。英訳は別に区切れる | 全記事のページ分けが必要なら負担大 |
| 2. 文字量や計測で完全自動分割 | 低〜中。内容の切れ目を保証しにくい | 初期執筆は軽いが例外修正が増える | フォント・画面差で分割位置とページ番号が変動 | 導入しやすく見えるがコード・表・脚注・画像の扱いが複雑 |
| 3. 明示的な境界＋通常表示へのフォールバック | 新記事は高い。既存本文も維持 | 見開き化する記事だけ編集 | 収まらない端末・言語は全文表示で読める | frontmatter未追加でも従来どおり読める |

**3を推奨。最初から自動ページ分割エンジンを作らない。** 写真記事は執筆者が区切り、長文技術記事や既存記事は通常表示のままでもよい。将来自動化するなら、執筆プレビューで「この段落から次ページへ」という候補を出す補助に限定する。公開画面で毎回本文を組み直す方式は採用しない。

ページIDは安定した意味名、ページ番号は表示順から計算。途中にページを追加しても古いページへのリンクはIDで維持する。日英でページ数・区切りは別に持ち、共通の意味IDがある場合だけ同じ場所に言語切替する。

## 6. 記事データ・MDXの提案

以下は**未実装のAPI設計例**。既存記事ファイルは今回変更しない。SEO用`title`・`description`・`image`、slug、日付は維持する。

### frontmatter

```yaml
# 既存項目はそのまま
cardSummary: "ホテル選びの失敗も、長い移動も。初めてのタイをひとりで巡った記録。"
homeOrder: 1
cover:
  mode: composed
  template: photo
  image: /images/Articles/Thai/Thai_night.JPG
  title: "初めての、タイ。"
  focal: { x: 55, y: 50 }
  placement: top-left
  writingMode: horizontal
  textTone: light
  overlay: local-gradient
reader:
  mode: magazine
  version: 1
lead: "大学1年生の夏、初めての海外旅行に出た。行き先はタイ。同行者はいない。"
```

- `cover.mode`は`composed | image`。`composed`は`photo | inset | type`。`type`だけ画像なしを許可する。
- 完成表紙は`cover: { mode: image, image: /images/... }`とし、合成用title・overlay等は指定不可にする。元比率が4:5でなければ自動トリミングせず、4:5面内にcontainで置きプレビューで警告する。
- `focal`は0〜100、`placement`はtop-left/top-right/bottom-left/bottom-right、`textTone`はlight/dark。任意CSS文字列を記事に書かせない。
- `cover`未指定なら既存imageから合成表紙、画像なしならtype。長い正式題名を自動で短く切らず、短題名を編集するまで表紙の題字を省く選択も可能。
- `cardSummary`未指定ならdescription、なければ本文先頭のプレーンテキストを省略せず使用。公開前に短い概要を編集する。概要とSEO説明は別用途。
- `reader`未指定ならcontinuous。magazine指定の記事はページを1枚以上持ち、全本文をページ内に収める。未配置の段落を検出したらビルド時エラーにして捨てない。
- 画像のwidth/height/altは画像マニフェストから参照。新規画像では登録を必須にし、同じ画像を各ページで再入力しない。

### MDX本文例：既存タイ記事の一部を6ページへ配置

写真と章名は既存記事のもの。以下は構文を示す抜粋で、実際の移行では省いた段落・画像・表・リンクもすべて配置し、6ページを超えればページを追加する。写真の焦点・文字位置は仮値であり、原写真の確認後に決める。

```mdx
<MagazinePage id="opening" template="cover">
  <CoverIntro
    image="/images/Articles/Thai/Thai_night.JPG"
    focal={{ x: 55, y: 50 }}
    placement="top-left"
    textTone="light"
    overlay="local-gradient"
    titleSource="frontmatter"
    leadSource="frontmatter"
  />
</MagazinePage>

<MagazinePage id="budget" template="editorial">

## 7泊9日で使った金額

<Figure src="/images/Articles/Thai/AirJapan.jpg" fit="contain">
  <Caption>成田空港からタイへ向かったAirJapan。</Caption>
</Figure>

旅費は合計146,000円。大学1年生の初ひとり旅としては、今思うと結構ぜいたくだった。

</MagazinePage>

<MagazinePage id="departure" template="text">

## Day1　安い航空券でタイへ

### 成田空港からスワンナプーム空港へ

成田空港からAirJapanに乗り、スワンナプーム国際空港へ向かった。

</MagazinePage>

<MagazinePage id="market" template="mixed">

## Day2　「往復3時間なら歩ける」と思っていた

このとき泊まっていたP18ホテルから、チャトゥチャック・ウィークエンドマーケットまで歩いた。

<Figure
  src="/images/Articles/Thai/weekendMarket.jpg"
  fit="cover"
  ratio="4:3"
  focal={{ x: 50, y: 50 }}
>
  <Caption>週末だけ開かれるウィークエンドマーケット。</Caption>
</Figure>

</MagazinePage>

<MagazinePage id="tour" template="photo">

## Day3　ひとり旅で、あえてツアーに参加する

<Figure src="/images/Articles/Thai/Boat.png" fit="contain">
  <Caption>ボートから眺めた水上マーケット。</Caption>
</Figure>

</MagazinePage>

<MagazinePage id="ruins" template="mixed">

### 写真より静かだったアユタヤ遺跡

アユタヤ遺跡では、木の根に包まれた仏頭を見ることができた。

<PhotoPair>
  <Figure src="/images/Articles/Thai/AyutthayaRuins2.png" fit="contain" />
  <Figure src="/images/Articles/Thai/AyutthayaRuins.png" fit="contain" />
</PhotoPair>

</MagazinePage>
```

`CoverIntro`は同じ文書コンテキストから正式title・lead・categoryを取得し、h1を一度だけ描画する。著者・公開日・更新日・読了時間も既存データから導入に表示する。リードに移した本文先頭は二重掲載せず、全文の内容照合では一度だけ数える。キャプションはchildrenのHTMLとして検索インデックスにも入れる。本文はMarkdownのまま、記事別TSX/CSSやimport記述は不要にする。

## 7. URL・全文・ページ送りの整合性

### 共通の本文解析

記事全体を一度ASTとして読み、全見出し・脚注にIDを割り当ててからページを関連付ける。`headingId → pageId → spreadIndex`と、検索用全文・目次・ページ順を生成する。ページごとにSluggerをリセットすると重複見出しIDが衝突するため禁止する。

既存のrehype-slugで得られるID一覧を移行前の基準にする。現行の正規表現由来の目次・検索との不一致も実データで比較し、既に公開されたIDは削除せず必要なら旧アンカーを別名として残す。GFMの脚注ID・戻りリンクも全文を通して一意にする。

### 読書位置の契約

| 操作 | URL・表示・フォーカス |
| --- | --- |
| 通常のURLで開く | 最初の見開き。画面条件が不足すれば全文表示 |
| 前後ボタン | 先頭ページの安定IDを`#page-departure`等として履歴に追加。表示状態も同時に更新 |
| 既存の見出しリンク・検索・目次 | 従来の`#見出しID`を保持。対応する見開きを先に開き、見出しへ移動 |
| 戻る・進む | `popstate`と`hashchange`から同じ解決処理を実行。新しい履歴は追加しない |
| 再読み込み | hashから復元。未知／削除済みIDは最初へ安全に戻し、本文は残す |
| スマホ／全文表示へ切替 | 同じページIDまたは見出しIDを保ち、その位置へスクロール。全ページはDOM順 |
| 翻訳切替 | 同じ意味のpageIdが翻訳先にあれば対応箇所へ。なければ翻訳記事先頭。ページ番号をそのまま流用しない |
| 共有 | 既定は従来のcanonical記事URL。「この位置を共有」だけhash付き。いいねslug・Giscus pathnameは変更しない |

Next.js内部のhistory stateを上書きせず既存値を保持して更新する。pushState自体ではhashchangeが発火しないため、ボタン操作時には読書状態も明示更新する。[MDN: pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState)

最初の試作ではURLを唯一の読書位置とし、ローカルストレージへの自動位置保存は加えない。読書モードの手動選択はセッション内で保持し、画面拡大を戻しただけで勝手に見開きへ戻さない。

### 全文の取得・検索と画像ロード

- サーバーHTMLに記事全文・見出し・キャプション・脚注を1回ずつ含める。クライアントに現在2ページ分だけ渡す設計にはしない。検索・RSS・JSON-LDは表示モードから独立させる。
- JavaScriptなしでは全ページを普通に縦読みできる。印刷も全文表示。本文を二重に用意するSEO用コピーは作らない。
- 見開きはプログレッシブ拡張。非表示ページを操作対象・読み上げ順から外し、表示した左→右だけを読めるようにする。常に「全文表示」を提供する。
- ブラウザ内全文検索は**全文表示で保証**。見開き時は対応ブラウザの`hidden="until-found"`と`beforematch`で検索箇所を開く補助を検証するが、未対応環境の唯一の導線にはしない。通常のhiddenが検索・読み上げまで隠す点に注意する。[MDN: hidden](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden)
- 検索UIは非表示ページも含めた全文インデックスを使う。キーワードがコードだけに存在する場合も到達できるよう、現行のコード除去処理と分けてコードテキストも保持する。
- 初期見開きの画像のみ通常のimg/next/imageを出力。他ページは寸法・alt・キャプションと遅延画像用データを持ち、表示時にsrc/srcsetを設定する。単に全画像にlazyを付けるだけで一括取得防止を保証しない。
- JavaScriptなし用の画像はnoscriptで元比率・lazyを指定。全文表示へ切替後は全画像を通常のlazy画像にする。初期HTMLに全文があることと、全高解像度写真を先読みすることを分離する。
- 初期hashが途中の場合はその見開きの画像を優先する。次の1見開きの先読みは初回表示後・低優先度で検討し、Save-Data時は行わない。過去ページ画像は再訪時のキャッシュを利用する。

## 8. 長文・特殊内容・アクセシビリティ

| 内容・問題 | 処理方針 |
| --- | --- |
| 長い段落・見出し | 自動で文字を切らない。執筆時に意味の区切りで次ページを追加。見出しだけをページ末尾に残さない。実行時に収まらなければ記事全体を通常表示へ |
| コード | 既存のシンタックスハイライトを維持。コード途中の自動改ページなし。長いものは通常表示。横幅だけの超過はラベル付きコード枠の中で横スクロール、ページ全体は横に流さない |
| 表 | ヘッダーと行を維持。大表は通常表示。狭い画面では表だけ横スクロール。表の内容を画像化しない |
| リスト・引用・脚注 | 要素の途中で切らず、必要なら作者がページ境界を調整。番号付きリスト継続はstartを保持。脚注への移動と戻りも対応見開きを開く |
| 横長／縦長写真 | 写真はfocalで調整可能。図版はcontainを基本。縦写真は単ページのphoto、横写真は余白付きのphotoやmixedで使う |
| 写真が少ない／ない | textとmixed中心。技術記事は通常表示を既定にできる。同じ写真を無理に繰り返さない |
| 英語・翻訳 | 言語別の本文でページ区切りと短題名を調整。CSSで和文の改行を英語へ強制しない。意味IDは可能な範囲で共有 |
| 文字拡大・低い画面 | 200%文字拡大／400%ズーム相当の狭い表示を確認。最小文字サイズを下げず、通常表示へ切り替えて全内容を保持 |

### 執筆時の検出

開発環境だけに誌面検証モードを設ける。公開サイトの操作には技術的な設定を露出しない。

1. AST検証：重複ページID、未配置本文、不正テンプレート、画像寸法・altの欠落、完成画像と重ね題字の併用を検出。
2. フォント読み込み後に、非表示ページも同じ外寸で一時計測し、`scrollHeight/clientHeight`・`scrollWidth/clientWidth`と要素矩形を比較。測定用の本文コピーを常設してIDを重複させない。画像は寸法だけで計測可能にする。
3. 本文・キャプションのはみ出し、意図しない写真との重なりを、ページID・対象要素付きで表示。画像上に重ねるタイトルは例外として扱い、安全領域を確認する。
4. 写真の主題は自動理解できた扱いにしない。必要なら執筆用subjectRectを指定して文字領域との交差を警告し、写真と文字の対比は人が原写真で確認する。
5. `ResizeObserver`とフォントの読込完了で再判定。収まらない公開表示は、内容をクリップする前に通常表示へ移行する。変更ループを避け、手動で戻すまで通常表示を維持する。[MDN: ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

### 操作・読みやすさ

- ボタンはnative button、Tab/Shift+TabとEnter/Spaceで操作。矢印キーは読書操作部にフォーカスがある場合だけ使い、コード・入力欄・Giscusの操作を奪わない。
- ページ送り後は操作ボタンのフォーカスを維持し、現在位置を短くaria-liveで通知。「本文を読む」で現在ページへ移動できるようにする。目次選択は選んだ見出しへフォーカスを移す。
- DOM順は左→右。見た目の位置だけで読み順を変えない。非表示のリンクへTab移動しない。
- 短い見開き切替で十分。reduced-motionでは即時切替・自動スムーズスクロールなし。ページめくりアニメーションは追加しない。
- 本文・補助文字・写真上の文字のコントラストを実際の背景で検証する。通常文字4.5:1を目標。写真の主題を隠す全面フィルターで解決しない。
- タッチ操作は44px程度の範囲を確保。画像だけをリンク名にせず、正式タイトルをリンクのアクセシブル名にする。

## 9. コンポーネントと変更対象

以下は将来の実装対象。今回変更するのはこの設計書と会話内ワイヤーフレームだけ。

| 対象 | 役割・変更 |
| --- | --- |
| `app/[locale]/layout.tsx`、`app/globals.css` | 幅制限をページ別に変更。共通書体・明暗トークン。Notesやローカルdocsへの意図しない適用を防ぐ |
| `components/site-header.tsx`、`site-footer.tsx` | 既存リンク・言語・テーマ機能を保った題字・ナビ・罫線 |
| `app/[locale]/page.tsx`、`components/home-client.tsx` | 単一グリッド・掲載順。記事全文をホームのClient propsへ送る構成を縮小 |
| 新規 `components/magazine/ArticleGrid.tsx`、`ArticleCoverCard.tsx`、`ArticleCover.tsx` | 3/2/1列、4:5表紙、正式タイトル・概要・メタ。完成画像／合成表紙の分岐 |
| 新規 `components/magazine/Figure.tsx`、`PhotoPair.tsx`、`Caption.tsx`、`PullQuote.tsx` | 再利用する誌面パーツ。自然寸法・alt・caption・トリミング |
| 新規 `components/magazine/reader/MagazinePage.tsx`、`CoverIntro.tsx` | サーバーで本文全体を描画するページと導入。テンプレート別の配置 |
| 新規 `components/magazine/reader/MagazineReader.tsx`、`ReaderControls.tsx`、`DeferredImage.tsx` | 見開き状態、前後操作、全文表示、ページ計測、画像の遅延有効化。Client境界はこの操作層に限定 |
| 新規 `lib/article-document.ts`、`lib/magazine-schema.ts` | 全文AST・ID・ページ対応表、データ検証。MDX本文をページごとに別コンパイルしない |
| `lib/mdx.ts`、`components/mdx-document.tsx`、`components/mdx/index.tsx` | frontmatter追加とパーツ登録。ローカルdocsは既存モードを継続 |
| `app/[locale]/blog/[slug]/page.tsx` | 通常記事／見開きの分岐、h1・メタ情報・末尾UI。既存SEO生成を維持 |
| `lib/toc.ts`、`lib/search-utils.ts`、`components/anchor-scroll.tsx`、検索・目次UI | 全文インデックスとページをまたぐリンクの統合 |
| 新規 `content/image-manifest.json`、画像寸法検査スクリプト | R2キー・寸法・altの登録。記事表示ごとのリモート寸法取得は行わない |
| `next.config.ts`、`lib/image-url.ts` | 既存R2変換を維持。配信サイズ追加が必要な場合だけ設定変更 |
| `content/posts/ja/*.mdx`、`en/*.mdx`、`docs/writing-guide.md` | 選定記事だけ追加項目・ページ区切りを設定。段階的移行と執筆例 |
| `messages/ja.json`、`messages/en.json` | 読書操作・表示切替・ページ数の翻訳。実装時に既存のキー構造へ合わせる |

既存PostCardは他の一覧でも使うため一括で表紙カードへ置換しない。関連・前後記事の選定、slug、投稿日、いいね、コメントの保存先は再利用する。

### 配信性能とビルド

ホームは表紙4:5、本文は実画像寸法で領域を予約してCLSを抑える。R2＋next/imageを継続し、列幅に合うsizesを指定する。sizesを省くと過大な画像を選ぶ場合がある。[Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)

最初のLCP候補1枚だけを優先し、2行目以降はlazy。現行最大1280pxは大きな写真を高DPRで見ると不足する可能性があるため、原写真を確認して1600/1920候補を評価する。ホームでは大きな原画像を直接配信しない。日本語フォントは1書体・必要なウェイトに絞り、読み込み前後の改行差を検証する。

記事全文はServer Componentで描画し、全文をクライアントで再コンパイルしない。ページ構造の抽出はビルド／サーバーで実施。hashによる読書状態なので、URLのためだけに静的記事生成を動的レンダリングへ変更しない。Vercelの画像変換回数・配信量は現行実績未確認のため、試作のNetwork計測後に評価する。

## 10. 簡易ワイヤーフレーム

### ホーム：同じ順序の3 / 2 / 1列

```text
PC（3列）
                 Darkmocha                記事一覧 / 検索 / メニュー
──────────────────────────────────────────────────────────────
[   表紙1 4:5   ]    [   表紙2 4:5   ]    [   表紙3 4:5   ]
 正式タイトル         正式タイトル         正式タイトル
 短い概要             短い概要             短い概要
 日付・カテゴリー      日付・カテゴリー      日付・カテゴリー

[   表紙4 4:5   ]    [   表紙5 4:5   ]    [   表紙6 4:5   ]
 正式タイトル         正式タイトル         正式タイトル
 短い概要             短い概要             短い概要
 日付・カテゴリー      日付・カテゴリー      日付・カテゴリー
──────────────────────────────────────────────────────────────
Darkmocha                         既存リンク / RSS / copyright

タブレット（2列）             スマホ（1列）
       Darkmocha                 Darkmocha
       ナビ                      ナビ
 [表紙1]  [表紙2]                [表紙1]
 題名等    題名等                  題名 → 概要 → メタ
 [表紙3]  [表紙4]                [表紙2]
 題名等    題名等                  題名 → 概要 → メタ
 [表紙5]  [表紙6]                 …表紙6まで
 ──フッター──                   ──フッター──
```

### 記事：最初の見開きと続き

```text
Darkmocha                                 記事一覧 / 検索 / メニュー
┌──────────────────────┬──────────────────────┐
│ 01 全面写真            │ 02 紙色のページ         │
│ 小さなカテゴリー        │ 小見出し                │
│                       │                        │
│ 正式タイトル           │ 中写真      キャプション │
│ 短い導入文             │                        │
│                       │ 本文        本文         │
│ 著者・日付             │             小写真       │
└──────────────────────┴──────────────────────┘
一覧へ戻る    前の見開き    01–02 / 全ページ数    次の見開き
                         目次 / 全文表示

次へ：03 text ／ 04 mixed → 次へ：05 photo ／ 06 mixed → …末尾
末尾：いいね・共有 → 関連／前後の記事 → コメント

スマホ・低い画面・拡大時
ヘッダー → 01 写真・タイトル・導入 → 02 見出し・写真・本文
→ 03 本文 → 04 本文と写真 → 05 写真 → 06 本文と写真 → …末尾
```

会話内ワイヤーフレームは配置・読む順・3見開きの操作を示す。写真は代替領域、文章は既存記事の抜粋であり、完成デザインや記事全文の実装ではない。

## 11. 試作計画・合格条件・規模

### 段階1：ホーム6件以上を全体で試作（目安2〜3日）

次の既存6件を同じグリッドに並べる。概要は既存本文に基づく編集案で、本文は変更しない。

| 記事slug | 検証する条件 |
| --- | --- |
| `thai-travel` | 写真＋HTML題字の基本表紙、長めの正式タイトル |
| `2026-07-25-unity-reflection` | ゲーム画面を切らないinset表紙 |
| `2026-07-27-unity-reflection2` | 長いタイトル・同シリーズの統一感 |
| `2026-06-11-ml-study` | 写真が少ない技術記事のtype表紙 |
| `2026-06-12-ml-study` | 英単語を含む長い正式タイトル |
| `graduation-bucket-list` | 画像なし、pinned互換。ホームに進捗セクションは作らない |

3列×2段を最小とし、実装時の公開記事は全件表示する。6件限定は比較用fixtureとする。完成表紙モードは同じ記事を一時的に差し替えて検証し、題字が二重にならないことを見る。

合格条件：

- 1122px幅で明るい参考画像、1024px幅で暗い参考画像と比較。**同じ画面幅・DPR・ズームでスクリーンショットを取得**し、ヘッダーからフッターまでを見る。
- 表紙の外寸、列間隔、左右余白、行間隔、文字サイズ、1画面の情報密度を表に記録。原画像の境界位置もこの段階で測定する。暗色参考の左題字・細長い表紙との差は、共通レイアウトと4:5を優先した意図的な差として記録する。
- 全表紙が4:5。同じ行の幅・高さ・上端が揃う。明暗切替で順序・矩形位置・ヘッダー配置が変わらない。画像への全体フィルターなし。
- 768/834pxは2列、320/390pxは1列。200%文字拡大でも記事間が重ならず、ページ全体の横スクロールなし。タイトル全文を読める。
- 概要は標準PCで約2行に編集。長題名による行高の増加は許容し、参考画像へ合わせるために本文を隠さない。

### 段階2：記事データと3見開き以上の試作（目安4〜6日）

タイ旅行記を使う。導入のcover/editorial、本文のtext/mixed、写真のphoto/mixedという**最低3見開き・6ページ**を作り、前後操作を実装する。元記事は旅費表・Tip・外部リンク・19個のh2/h3見出し・多数の写真を含むため、6ページに押し込まず、残りの本文から旅の結びまで必要なページを追加する。

合格条件：

- 1536×1024で3枚目の参考画像と比較。左右外寸、中央溝、写真占有率、文字・余白・上下の操作位置を記録する。参考画像の小さい本文に合わせて18pxから縮小しない。
- 最初→中間→最後を読め、前後ボタンの端状態・ページ番号が正しい。全見開きが同じ写真配置ではない。
- 途中の見出しURLへ直接アクセス、検索・目次、戻る・進む、再読込、脚注往復が正しい見開きへ到達する。
- JA/EN、1536×1024、1280×900、1366×768、390px、文字拡大、フォント読込前後を確認。収まらないとき通常表示になり、同じ読書位置を保つ。
- サーバーHTML／検索データに末尾まで本文があり、DOM本文が重複しない。初回Networkで後半全ページの高解像度画像を取得していない。

### 段階3：長文・互換性・運用（目安3〜5日）

Unity後編の日本語・英語を長文とC#コードの検証に使う。scikit-learn記事は表・Pythonコード・英単語を含む題名、バケットリストは写真なし・チェックリストの検証に使う。既存記事に足りない脚注や重複見出しはテスト専用fixtureで確認し、実記事へ架空の文章を追加しない。

- 元MDXと新構造の段落・見出し・コード・表セル・リンク・画像一覧を照合し、本文欠落ゼロ。編集したリードとキャプションの差は明示する。
- 長いコード・表が収まらない場合の通常表示を確認。ブラウザ検索、選択・コピー、印刷、JavaScriptなしでも本文を取得できる。
- キーボードのみ、読み上げ順、コントラスト、reduced-motion、フォーカス移動を確認。
- URL・canonical・hreflang・JSON-LD・RSS・sitemap・検索、いいねID・Giscus pathname、翻訳なし案内、既存一覧やローカルdocsの表示を回帰確認。
- 実装時にはtypecheck・lint・test:ci・buildを実施。ページ解決、履歴、本文完全性、はみ出し退避、画像遅延を重点的にテストする。
- 同条件で試作前後のLCP・CLS・画像転送量を比較。初期目標LCP 2.5秒以内・CLS 0.1以下。現在の実測値・達成は未確認。

目安は1人で合計9〜14作業日。写真選定・表紙調整・日本語フォント・全文のページ分けにより増減する。最大のリスクは、固定誌面と可変文字量の両立、全文検索／アンカーと非表示ページの整合性、日英それぞれの編集負担。通常表示への退避を先に作り、後から誌面テンプレートを増やす順序で抑える。

## 12. 未決事項と今回の検証範囲

設計を止める質問はない。次の点は試作で決める。

- 初回テーマ：既存のダーク既定と保存済み設定は維持する案。明るい画像をレイアウト基準にすることと、初回テーマの変更は分ける。
- 書体：Noto Serif JPの実際の和文・英数字・読込量を評価し、本文だけゴシックにする比較も可能。確定したグリッドや4:5は比較対象に戻さない。
- 写真と短題名：原写真の主題・解像度を確認し、6記事の表紙設定と概要を編集。完成表紙画像を使う記事は個別に選ぶ。
- 見開き化する記事の範囲：最初はタイ旅行記のみを推奨。技術記事をすべてページ分割する運用にはしない。

今回の成果は設計書とワイヤーフレーム。アプリの見開き機能、画像最適化の新実装、記事データ移行は未実施。アプリのビルド・テスト・実機・本番の確認結果ではない。参考画像との完成画面比較は上記の実装後検証として残す。

資料自体の確認：設計書のMDXコンパイルと既存ファイルへのリンク検査を実施。ワイヤーフレームはブラウザで6枚の表紙が同寸4:5・行ごとに整列すること、明暗で外寸が変わらないこと、834pxの2列・390pxの1列、3見開きの前後操作と端の無効状態を確認した。記事のスマホ図は01〜06の順で、幅390pxに対する横方向のはみ出しなし。ブラウザのコンソールエラーなし。これは簡易図の確認であり、実装後の200%文字拡大や実写真の速度検証の代わりではない。
