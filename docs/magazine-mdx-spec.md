> 2026-09-23: ローカル編集の現行仕様は [誌面エディター v2](./magazine-editor-v2.md)。以下の自由配置に関する記述は旧設定との互換資料として扱う。

# マガジンMDX仕様

2026-09-23。ホームの表紙4種類、従来の本文ページ6種類と内容別featureページを共通コンポーネントで運用する。正式タイトル・SEO・既存本文・見出しIDを維持する。実装は `lib/magazine.ts`、`lib/remark-magazine.ts`、`components/magazine/layout-parts.tsx`、`app/magazine.css`。

## 執筆の流れ

1. 本文を通常のMarkdownで書き、記事に関係する写真を選ぶ。
2. 新方式では内容を安定したID付き `ArticleBlock` にまとめ、`reader.pages` で配置を参照する。従来の `Page` / `Spread` 形式も継続して使える。
3. テンプレートと必要な写真設定を選ぶ。CSS・TSXを記事ごとに書かない。
4. `pnpm dev` でプレビュー。PCの見開きとスマホの縦スクロールを確認する。
5. はみ出す場合は文章を次のページへ移すか型を変更する。文字縮小・本文切り捨てはしない。

実例：`content/posts/ja/thai-travel.mdx`。一覧サンプル：`docs/magazine-layouts.mdx`。開発サーバーの `/docs/magazine-layouts` で6ページと6種類の表紙設定を比較できる。既存docs保護に従い、本番環境では404・noindex。サンプル写真・文章はタイ旅行記の素材を使用。

## 本文と配置の分離（タイ旅行記で使用）

本文はMDXだけに保存する。`reader.pages` はID・型・写真の表示設定のみを持ち、本文を複製しない。ページの変更で本文ブロックIDを変えない。

```mdx
---
reader:
  mode: magazine
  pages:
    - id: departure
      template: feature
      layout: portrait
      blocks: [departure, hotel]
    - id: market
      template: feature
      layout: pair
      balance: text
      blocks: [market]
---

<ArticleBlock id="departure">

## 出発

出発時の本文。

<Photo src="/images/Articles/Thai/AirJapan.jpg" alt="航空機の窓から見た夕方の空港" />

</ArticleBlock>

<ArticleBlock id="hotel">

### ホテル

ホテルについての本文。

</ArticleBlock>

<ArticleBlock id="market">

## 市場

市場についての本文。

<Photo src="/images/Articles/Thai/Boat.png" alt="水上マーケットの船" />
<Photo src="/images/Articles/Thai/BoatInMarket.png" alt="船から見た水路沿いの店" />

</ArticleBlock>
```

全ブロックを本文順に一度ずつ参照する。ページ数は偶数にする。コンパイル時に不足・重複・順序変更を拒否し、統合前の `page-ブロックID` リンクも残す。見出しIDは従来どおりrehype-slugで生成する。

| feature.layout | 配置と適合条件 |
|---|---|
| portrait | 縦写真1枚を大きく、本文を横へ。次のまとまりは下段へ |
| landscape | 横写真1枚と本文。写真は元の比率を維持 |
| pair | 写真2枚と本文。balanceはphoto（写真重視）/ text（文章重視） |
| mosaic | 写真2枚以上。縦写真3枚は大1枚＋小2枚、縦横混在は元比率で並べる |
| data | 表を主役にし、補足の本文・写真を分ける |

画像の寸法は `content/image-manifest.json` を使用する。写真のキャプションはPhotoに保持する。配置を変えても本文・リンクは書き換えない。冒頭と終幕は既存opening / editorial / spotlightを再利用する。

localhostの開発環境では、記事下の「誌面の配置を編集」から設定を読み込める。写真枚数・向きに合う型、写真の全体表示／トリミングと焦点、隣ページとの境界ブロック移動を編集できる。移動時も本文順を維持し、型が合わなくなる場合は適合する型に変更する。操作後は差分を確認して保存し、「この誌面を見る」で確認する。

保存先は同じMDXのreader.pages。例：`photos: {"/images/Articles/Thai/AirJapan.jpg": {ratio: portrait, fit: cover, focal: "40% 60%"}}`。画像の参照自体は本文から移さない。写真全体表示では焦点調整は不要。保存APIはdevelopmentかつlocalhost限定、更新競合時は上書きしない。

導入2ページと終幕、ページ増減、本文ブロック自体の分割はこの簡易エディターの対象外で、MDXで編集する。段落を自動分割する組版エンジンは未実装。初期配置は明示的に保存したものを使い、再訪時に自動で組み直さない。文字が収まらない画面では全文表示へ切り替える。写真の候補判定は寸法と枚数によるもので、実際の収まりは保存後にフォント読み込み済みの画面で確認する。

以下は従来形式にも共通する仕様。

## frontmatter

| 項目 | 内容・省略時 |
|---|---|
| title | 正式タイトル。SEO・読み上げ・共有に使用 |
| displayTitle | ホームの短い表示タイトル。省略時title |
| description | SEO用説明 |
| cardSummary | ホームの短い概要。省略時description |
| image | 代表画像。既存の画像配信設定を使用 |
| date / update | 公開日・更新日。既存形式 |
| category / tags | 既存カテゴリー・タグ |
| draft | 下書き。既存ルールを維持 |
| homeOrder | 旧設定として保持。ホームの並び順には使用しない |
| reader.mode | magazine / flow。省略時flow |

```yaml
---
title: 初めての海外ひとり旅。大学1年で7泊9日のタイへ
date: "2026-03-06"
category: Life
tags: [Diary, Travel, Thai]
description: 大学1年生の夏、初めての海外旅行でタイへ。
image: /images/Articles/Thai/Thai_night.JPG
displayTitle: 初めての、タイ。
cardSummary: ホテル選びの失敗も、長い移動も。タイをひとりで巡った記録。
cover:
  template: overlay
  title: |
    初めての、
    タイ。
  subtitle: 大学1年、7泊9日のひとり旅。
  placement: top-left
  tone: light
  focal: 62% 50%
  overlay: local
reader:
  mode: magazine
---
```

## cover：ホームの表紙

全表紙4:5。HTMLの正式な一覧タイトル・概要・日付・カテゴリーは表紙の下に置く。文字入り画像にも一覧タイトルは表示する。

| template | 表示 |
|---|---|
| overlay | 全面写真＋横書き文字 |
| vertical | 全面写真＋縦書き文字 |
| split | 全幅写真＋上下どちらかの文字帯。文章に必要な高さ以外は写真に使う |
| typographic | 写真なし。文字と色面 |

| プロパティ | 選択肢 | 初期値 |
|---|---|---|
| mode | composed / image | composed |
| template | 上記4種類 | 写真ありoverlay、なしtypographic |
| image | 画像パス | 記事のimage |
| title | 文字列、改行可 | displayTitle→title |
| subtitle / label | 文字列 | 表示しない |
| placement | top-left / top-right / center / bottom-left / bottom-right | top-left |
| titleSize | small / medium / large | medium |
| tone | light / dark | 写真上はlight、split・typographicはdark |
| background | paper / sand / rust / sage / sky / ink | paper |
| focal | 0%〜100%の横・縦位置 | 50% 50% |
| overlay | none / local | none |
| textSide | top / bottom。split限定 | bottom |
| imageFit | cover / contain。split限定 | cover |

`mode: image` は完成画像だけを表示し、題字・副題・label・グラデーションを重ねない。`split`は上下分割とし、textSideで文字領域を決め、placementを指定しても分割配置を優先する。typographicの文字色は背景色の可読性を優先。縦書きはtemplateだけで指定し、writingModeは使わない。写真自体を暗くするフィルターは適用しない。

## Spread：見開き

`id`だけを指定する。英小文字から始まる英数字・ハイフン。記事内で一意にし、公開後はなるべく変更しない。

直下に必ず2つのPage。左→右の順で記述する。ページ番号は自動。最終見開きも2ページ用意する（写真のみのページも利用可能）。

```mdx
<Spread id="departure">

<Page template="opening" image="/images/Articles/Thai/Thai_night.JPG"
  title="初めての、タイ。" subtitle="大学1年、7泊9日のひとり旅。"
  focal="62% 50%" overlay="local">

大学1年生の夏、初めての海外旅行に出た。

</Page>

<Page template="editorial">

## ひとりで、旅に出る。

<Photo src="/images/Articles/Thai/AirJapan.jpg"
  alt="飛行機の窓から見えた夕日" placement="lead"
  caption="成田空港からAirJapanに乗り、スワンナプーム国際空港へ向かった。" />

普通のMarkdownで本文を書く。

<Photo src="/images/Articles/Thai/RiverHotel.png"
  alt="ホテルのランタン" placement="support" fit="cover" />

</Page>

</Spread>
```

## Page：ページ

| template | 内容 |
|---|---|
| opening | 全面写真＋題名・副題・導入。記事の最初のページに1回使用 |
| photo | 大写真＋キャプション。Photoを1枚 |
| editorial | 見出し→lead写真と横の説明→本文の短い2段組み→support写真 |
| text | 本文中心。写真・引用・リスト・コード・表・脚注を使用可能 |
| gallery | 複数写真。本文はPhotoのcaptionへ |
| spotlight | 色面・余白＋Photo1枚＋任意の短文 |

| プロパティ | 値・初期値 | 対象 |
|---|---|---|
| template | 上記6種類。省略時text | 全種類 |
| background | 6色。省略時paper | 全種類 |
| id | 任意の固定ページID。省略時Spreadのid-left / id-right | 全種類 |
| image / title | 画像パス・短い題名。必須 | opening |
| subtitle | 任意の副題 | opening |
| focal | 省略時50% 50% | opening |
| placement | 表紙と同じ5位置。省略時top-left | opening |
| tone | light / dark。省略時light | opening |
| overlay | none / local。省略時none | opening |
| columns | 1 / 2。省略時1。数値はcolumns={2} | text |
| layout | bleed / inset。省略時inset | photo |
| layout | photo-left / photo-right。省略時photo-left | editorial |
| layout | pair / stack / one-plus-two。省略時pair | gallery |

photo-leftは画像が左・説明が右。photo-rightはその逆。どちらもDOMでは写真→説明→本文の順。editorialはlead写真を1枚、supportを最大1枚、Page直下に置く。leadより前は見出し等、後は本文。段組みの細かなタグは不要。supportは本文の最後に配置する。

galleryはpair・stackで2枚、one-plus-twoで3枚。写真の順序が読む順序。paperはテーマ連動。他の色は編集意図を保つ固定色。

## Photo：写真

| プロパティ | 選択肢 | 初期値 |
|---|---|---|
| src | 画像パス。必須 | — |
| alt | 画像の説明。必須（純装飾は空文字） | — |
| caption | キャプション | なし |
| shape | rect / circle | rect |
| size | small / medium / large | medium |
| fit | contain / cover | contain |
| ratio | original / square / portrait / landscape | original |
| focal | 横・縦の% | 50% 50% |
| placement | 下表 | ページの型に従う |
| wrap | none / around | none |

| Page | Photo.placement |
|---|---|
| editorial | lead / support。必須 |
| text | inline / left / right。省略時inline |
| spotlight | center / top-left / top-right / bottom-left / bottom-right。省略時center |
| photo / gallery | 指定不要。layoutに従う |

sizeの基本幅はsmall32%、medium65%、large100%。photo・gallery・editorialでは誌面の役割がサイズに優先する。ratioはsquare=1:1、portrait=4:5、landscape=3:2。originalは画像寸法情報を使用、未登録画像は4:3枠で全体表示する。円形は正方形の枠とcoverを優先する。画像寸法を `content/image-manifest.json` に登録すると元の比率を正確に予約できる。

wrap=aroundはtextの1段本文でplacement=left/rightを指定した場合だけ使用可能。PCでは写真を避けて文章を流し、スマホでは段落間へ戻す。2段組み中央の円形回り込みは今回の対象外。

```mdx
<Spread id="quiet-moment">

<Page template="text">

## 旅を振り返る

ここに本文を書く。

<Photo src="/images/Articles/Thai/AirJapan.jpg"
  alt="飛行機から見た夕日" shape="circle" size="small"
  placement="left" wrap="around" />

続きを書く。段落の順番はそのまま保たれる。

</Page>

<Page template="spotlight" background="rust">

<Photo src="/images/Articles/Thai/RiverHotel.png"
  alt="ホテルのランタン" shape="circle" size="small" placement="center" />

</Page>

</Spread>
```

## 色・文字・余白

| 色 | 値 | 本文色 |
|---|---|---|
| paper | ライト#f8f6ef、ダーク#242622 | テーマ連動 |
| sand | #e7dfd0 | #302b24 |
| rust | #873e29 | #fff5e6 |
| sage | #dce2d6 | #203830 |
| sky | #d3e5ea | #20343d |
| ink | #24302c | #f5f2e9 |

日本語本文は既存のNoto Serif JP系、PC18px・行間1.95、短い段組み17px。スマホ17px・行間1.95。PC誌面内の左右余白42px、スマホ22px。テンプレートは写真の主題と文字の空間を分け、色面と円形は一部の見開きに使って変化をつける。

## 検証・互換性

- remarkで設定名・選択肢・ページ数・写真数・配置の組み合わせ・重複IDを検証。不正なMDXはプレビュー／ビルドでエラーにする。設定は文字列または数値のリテラルで記述し、式・属性展開は使用しない。
- 見開きは幅1024px以上かつ高さ600px以上。前後操作で2ページずつ切り替える。紙面内スクロールは禁止。本文14px・行間1.8を基本とする。内容超過時は本文を切らず全文表示へ退避する。完全な固定誌面にする場合はMDXでページを分ける。
- 全本文はサーバーでHTML化。未表示ページの高解像度画像は初期一括取得しない。写真領域の寸法は先に予約する。
- Markdownの見出しIDを維持。Spreadへのhashはその左ページへ、見出しhashは所属ページへ移動。戻る・進む・再読み込みもhashで復元。
- reader.mode=flowでもSpread/Pageを記述でき、初期表示だけ縦スクロールにする。従来の通常MDXも維持。
- 旧MagazinePage等は互換用に残す。新規記事はSpread/Page/Photoを使う。旧reader.title等は互換用で、新規記事の題名・写真はPageに指定する。
- コード・表のある記事はtextの1段を基本にする。コード・表の内部スクロールは許容し、ページ全体を横に伸ばさない。
- スマホは左→右の順に縦スクロール。写真に重なる導入文を下へ移す。文字拡大時も本文を切らず、PCも収まらない場合は全文表示で読む。

## 今回の確認結果

- PC 1536×1024：6ページのテンプレート見本、円形196×196px、rust色面、写真集、全面写真、最終ページのボタン無効化を確認。
- 実記事：日本語は本文21ページに写真のみの末尾ページを追加して22ページ、英語は24ページ。全見開きを最後まで操作でき、本文・元の写真参照・正式メタデータ・Markdown見出しを移行前と照合した。
- ホーム1122px幅：表紙6件は330×412pxで同寸。splitの文字領域と文字サイズを日英で調整。
- スマホ390×844：全ページ表示、本文1段、写真集1列、回り込み解除、導入写真360px、ページ全体の横スクロールなしを確認。
- 属性に移したキャプション・誌面用題名も検索対象に含める。「ひとり旅を勧めて」で元の文章が検索結果に表示されることを確認。
- 70テスト、ESLint、本番ビルド（TypeScript検証を含む）が成功。コミット・公開・デプロイはしていない。
- 実機、200%文字拡大、すべての色・位置の組み合わせは未検証。枠の超過は全文表示へ退避する実装を維持。2段本文中央の円形回り込みは未実装。

## ホームでの表紙レビュー

開発環境のホームはレビュー一覧を初期表示する。横書きO1〜O5、縦書きV1〜V5、上下分割S1〜S2、文字主体T1〜T5、画像のみI1の計18パターン。上部の共通設定で既存記事素材・背景6色・題名3サイズ・文字色・局所グラデーション・トリミング位置・副題・カテゴリーの有無を切り替える。全組み合わせの同時展開ではなく、配置全種類を同時表示して設定を一括比較する。通常の記事一覧にも画面内のボタンで戻れる。本番ホームと記事データには影響しない。


### splitのレビュー反映

S1は写真が上・文字が下（textSide: bottom）、S2は文字が上・写真が下（textSide: top）。左右に分割せず、写真を全幅にする。文字帯は内容に応じた高さで、短い題名なら写真が表紙の約7割を占める。splitでは題名中の改行を空白に置換し、横幅を使って自然に折り返す。

`cover.imageFit` はsplit限定でcover / contain（初期値cover）。旅行写真はcoverで空白なく配置。ゲーム画面・図版は既存内容の欠落を避けるためcontainを明示する。containでは元画像との比率差による余白が残る。

## localhostで表紙を編集する

`pnpm dev`で起動し、localhostのホームで「表紙の編集モード」をONにする。記事を選択すると、MDXから最新の設定を読み込む。写真・文字・配置・色を調整すると、選択記事のプレビューと下の混在した記事一覧に即時反映される。「全テンプレートを比較」で従来の比較画面も利用できる。

- 画像欄の候補は選択記事の本文・表紙・代表画像から抽出。別の既存画像は `/images/…` または設定済み画像配信元のURLを入力する。アップロードは行わない。
- 写真位置は横・縦の0〜100%スライダーで調整する。画像のドラッグ操作は未実装。
- 「保存前の差分を確認」→「この内容をMDXに保存」で、現在の言語の記事の `cover` / `displayTitle` / `cardSummary` のみ更新する。翻訳先には自動コピーしない。
- 「変更を取り消す」は最後に読み込んだ／保存した設定へ戻す。未保存の間は記事切替と編集終了を無効にし、ページ離脱時に警告する。
- 保存後にファイルが外部編集されていた場合は409で拒否する。変更を控え、取り消して記事を再選択すると最新版を読み込める。
- 本文・正式タイトル・SEO等の他の項目は保持。ファイルは一時ファイルから置換し、同時保存を直列化する。
- UIとAPIは `NODE_ENV=development` かつHostがlocalhost/127.0.0.1/[::1]の場合のみ有効。保存は同一OriginのJSONリクエスト限定。本番・LANアドレス・外部ホストには出さない。
- API: `GET /api/local/cover?locale=ja&slug=…`、`PUT /api/local/cover`。レスポンスはno-store / noindex。

「1列で比較」は一覧の並びを確認する機能。実際のスマートフォンのメディアクエリ確認はブラウザの表示幅変更も併用する。完成画像モードではHTML題字を表示しない。

### 写真の拡大率・文字サイズ

表紙編集で `imageZoom`（100〜250%、初期値100）を調整できる。focalを拡大の中心にも使い、写真領域の内側で切り抜く。containでも拡大すると画像の端が切れる場合がある。

`titleFontSize`（16〜64）、`subtitleFontSize`（10〜28）、`labelFontSize`（10〜24）は基準pxで指定する。表示はremへ換算しブラウザの文字拡大を妨げない。数値指定はテンプレートの自動サイズより優先。「自動に戻す」で指定を削除する。文字入り完成画像の文字サイズは変更できない。大きい文字は長い題名や縦書きで収まりをプレビュー確認する。

### 保存後の一覧反映

保存APIの成功後に `revalidatePath('/', 'layout')` で言語別の記事・一覧のキャッシュを無効化し、編集画面側の `router.refresh()` で現在のルーターキャッシュも更新する。更新中は編集終了や記事切替を無効化する。記事一覧は最新のサーバーpropsを使い、保存直後の補完データは新しいpropsが届くまでだけ使用する。編集モードを閉じた一覧では編集中のdraftを重ねない。

回帰確認：保存→編集終了→記事→「記事一覧へ」、ブラウザの戻る、再読み込み。ファイル保存だけでなく最新propsの再描画もテストする。

ホームは公開日（date）の降順。左上から右へ、次の行へと新しい記事順に並べる。同日はslug順。draftは非表示とし、homeOrder・pinnedでは順序を変えない。

## 誌面の直接編集（2026-09-23）

localhostのPCで記事を開き、ページ送りの下の「誌面を直接編集」から開始する。
対象は `reader.pages` + `ArticleBlock` 形式の記事の `opening`・`editorial`・`feature` ページ。1ページ目は全面写真の焦点・誌面題名・副題・文字位置・文字色・局所グラデーション、2ページ目は写真枠と本文の回り込みを編集できる。終幕は従来通りMDXで編集する。

1. 編集するページと写真を選ぶ。編集時は対象の1ページと右側の操作パネルを表示する。
2. 写真をドラッグして左右・上下位置を変更する。右下のつまみで枠の幅を変える。「比率を固定」を外すと高さも変えられる。
3. スライダーで幅・高さ・比率・本文との間隔を調整する。写真枠と画像の切り抜きは別設定。Alt＋ドラッグ、または写真内の位置スライダーで焦点を変える。
4. 本文はその場で折り返す。「差し込む位置」で既存本文パーツ間に写真を移し、「文章との関係」で左右の回り込み／上下配置を選ぶ。
5. 「変更を保存」→「編集を終了」。ファイル保存前は下書きのみ。取り消すと最後の保存状態に戻る。

本文領域の幅は、写真を含む組版領域の幅を60〜100%で調整する。はみ出しはフォント読み込み後の実寸で検出し、解消するまで保存を無効にする。ページ内スクロールや文字の自動縮小で収めない。

保存先は既存のMDX frontmatter `reader.pages[].composition`。本文・見出し・リンク・写真ソースは `ArticleBlock` に一度だけ保持する。例：

```yaml
composition:
  textWidth: 100
  frames:
    - source: /images/example.jpg # このページの既存Photoのsrc
      side: right                # left / right / block
      width: 44                  # 組版領域に対する割合、20〜100%
      ratio: 0.8                 # 枠の幅÷高さ、0.25〜4
      inset: 0                   # 選んだ側からの距離、0〜80%。幅と合計100%以内
      offset: 0                  # 差し込み位置から下へ0〜500px
      gap: 18                    # 本文との間隔、0〜48px
      anchor: 0                  # 既存本文パーツの何個目の後に置くか
      fit: contain               # contain / cover
      focalX: 50                 # 画像内の横位置、0〜100%
      focalY: 50                 # 画像内の縦位置、0〜100%
```

`frames` はページ内のPhotoと同じ順序・枚数。写真の参照が変わった場合はコンパイル／保存で検出する。テンプレート選択・ブロック移動を従来エディターで行うと、対象ページのcompositionをリセットする。移動後に直接編集し直す。

現在はページ内の左／右の矩形への回り込みと上下配置に対応。本文幅・写真配置は連動するが、紙面中央の写真の両側への回り込み、複雑な輪郭、ページをまたぐ自動文字送りは未対応。ブロック間移動は従来の配置エディターを使う。

スマホ・全文表示では同じ本文と写真をDOM順で縦に表示し、PCの固定枠・回り込み・オフセットを解除する。写真は元の比率で全体を表示する。保存APIは既存のlocalhost制限・変更競合検出を利用する。

検証：1122×800で写真ドラッグ、リサイズ、比率変更、本文の追従、保存・終了・再読込・再編集を確認。高さを増やしてはみ出した場合は保存不可。390×844では回り込みが解除され、全16ページ表示・横スクロールなし。操作確認用に保存した配置は検証後に取り除き、既存の誌面を維持。

### 編集と通常表示の寸法一致

編集時も見開きの1ページと同じ内寸を使う。単ページ枠の左右の罫線を含めて幅を補正し、写真の寸法計算は小数ピクセルを保持する。ページ送りで非表示になった際の幅0は採用しない。保存後はサーバーの表示更新が完了するまで編集終了を待つ。

1122×800・1440×900で、編集時と保存後の写真枠・本文の誌面内座標と寸法が一致することを確認。ページ送り後の復帰も確認。スマホ・全文表示は既存方針通り縦スクロール用に再配置する。

導入ページも「編集するページ」に表示する。本文・写真ソース・ページID・型は保持し、1ページ目の正式タイトルとSEOは変更しない。2ページ目のcompositionも既存のPhotoを参照し、キャプションを含めて表示する。

### 文章のまとまりを直接編集する

「誌面を直接編集」→ 対象ページ →「文章の配置を調整」で、既存の `ArticleBlock` ごとに操作できる。左端のつまみをドラッグすると左右位置・上の余白が変わり、別のまとまりに重ねて離すと読む順序を変更する。「文章を前へ／後ろへ」でも並べ替えられる。

- 文章の幅：30〜100%。左右位置と合計して100%を超えない。
- 左右位置：本文領域の左端からの割合。幅に応じて操作範囲を制限する。
- 上の余白：0〜300px。本文がはみ出した場合は保存を止める。
- 元へ戻す：選択した文章の幅・位置だけ、または全まとまりの順序・配置を戻せる。

配置は `reader.pages[].composition.textGroups` に保存する。配列の順序が誌面・全文表示・スマホでの表示順になる。本文のMDX、見出しID、リンクは書き換えない。すべてのブロックIDを一度ずつ参照することを保存時に検証する。

```yaml
textGroups:
  - { id: journey-05, width: 90, inset: 5, offset: 12 }
  - { id: journey-06, width: 100, inset: 0, offset: 0 }
```

写真は既存の差し込み位置に置かれ、文章枠の幅に合わせて回り込みが変わる。絶対座標で文章を重ねる方式ではなく、本文の流れを保った配置調整とする。スマホ／全文表示では幅・左右位置・上の余白を通常の1列へ戻し、設定した読む順序を維持する。

対象は feature・editorial・text の本文ページ。導入の全面写真ページは題名・副題の専用設定を使う。ページをまたぐ移動は従来のブロック移動機能を使う。まとまりをより小さくしたい場合は、MDXで `ArticleBlock` を分ける。文章は編集用JSONへ複製しない。

### 段落（p）単位での編集

新しい直接編集では「段落の配置を調整」を使う。保存済みのセクション配置がある場合は「段落単位の編集に切り替える」で順序・幅を引き継ぐ。上の余白は各セクションの先頭要素に引き継ぐ。

MDXのArticleBlock直下にある各段落を独立した枠として扱い、幅・左右位置・上の余白・読む順序を保存できる。見出しも独立しており、段落だけを動かして見出しを残せる。表・コード・リスト・引用・カスタムコンポーネントは内部を分割せず一つの要素として保持する。既存のMDXのpマッピングはdivを返すが、識別はレンダリング前の段落ノードを基準に行う。

`composition.textUnit: paragraph` と `textGroups` に内容から生成した参照ID・配置だけを保存し、本文は複製しない。IDは前後への別の段落の追加では変わらず、同文の段落には出現番号を付ける。本文自体を書き換えた段落は新しいIDになるため、そのページの段落配置を再作成する（MDX編集時には古いtextUnit/textGroupsを外す）。保存APIは実際のMDXを解析し、参照の欠落・重複・未知のIDを検出してファイル更新前に拒否する。

### 元に戻す・やり直す

直接編集の現在のページで、Command/Ctrl＋Zで元に戻し、Command/Ctrl＋YまたはShift＋Command/Ctrl＋Zでやり直す。ボタンも併設する。写真・段落・導入設定を共通の履歴で扱い、選択変更やはみ出し計測は履歴に含めない。ドラッグ開始から終了までは1操作にまとめ、最大100操作を保持する。

履歴はページ切替・編集終了でリセットされる。保存は履歴を消さないが、保存済みファイルを戻すには、取り消し操作後に再度保存する。入力欄での文字編集にはブラウザ標準のUndoを優先する。保存・反映中は誌面のUndo/Redoを停止する。
