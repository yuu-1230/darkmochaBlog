# darkmocha.dev ブログ市場比較・改善ロードマップ

最終調査日: 2026-08-30

## 結論

darkmocha.dev は、独自ドメイン、MDX/Git管理、多言語、全文検索、関連記事、RSS、構造化データ、コメント、匿名いいねまで揃っており、個人ブログの基盤としてはすでに強い。次に優先すべきなのは、機能を無差別に増やすことではなく、次の循環を完成させることである。

> 検索・SNSから記事へ流入 → 記事を読み切る → 関連記事やシリーズを読む → RSS/メールで再訪する → 反応が次の記事改善に使われる

優先順位は次のとおり。

1. **P0: プライバシーと計測の整備** — GA4、Vercel Analytics、Giscus、Neon、1年間の匿名Cookieを利用していることを説明し、収集目的と保存先を明確にする。
2. **P0: RSSの可視化とコンテンツ品質管理** — すでにあるRSSをヘッダーまたはフッターから購読可能にし、記事の更新日・検証環境・出典を継続的に示す。
3. **P1: シリーズと回遊導線** — タグだけでなく記事の順序を持つシリーズを導入し、前後の記事と次に読む理由を表示する。
4. **P1: 行動計測** — 検索結果クリック、関連記事クリック、読了、コードコピー、外部リンク、いいねをイベントとして定義し、改善前後を比較する。
5. **P1: 購読・再訪導線** — まずRSS、更新頻度を維持できる段階でメール購読を追加する。
6. **P2: 人気記事・読者フィードバック・ローカルブックマーク** — 既存のいいね数だけに依存せず、閲覧、読了、鮮度、編集者推薦を組み合わせる。

Neonをすべての行動ログ置き場にする必要はない。Neonは「いいねの最終状態」「将来の購読者や明示的フィードバック」などアプリ機能の正本に限定し、閲覧・クリック・読了はGA4、短期的な読書進捗やブックマークは `localStorage` に分けるのが、無料枠・プライバシー・運用負荷のバランスがよい。

## 調査範囲と制約

このレポートは、次の情報を基にした機能・運用レベルの比較である。

- darkmocha.dev のリポジトリと2026-08-30時点の本番表示
- 各サービスの公式サイト、公式ヘルプ、公式ドキュメント
- Google、W3C、web.dev、Vercelの公式ガイド

GA4、Google Search Console、Vercel Analyticsの実データにはアクセスしていない。そのため、「どの記事が弱いか」「どの流入元が最重要か」などの実績評価ではなく、現在の機能差と次に検証すべき仮説を扱う。施策の採否は、実データを1〜2か月計測した後に再評価する。

## 現在のdarkmocha.dev

### 確認できた強み

| 領域 | 現在の実装 | 評価 |
| --- | --- | --- |
| コンテンツ所有 | MDXをGitHubで管理し、Vercelへ自動デプロイ | プラットフォーム移行に強い |
| ブランド | 独自ドメイン、独自UI、ライト/ダークテーマ | 外部サービスより自由度が高い |
| 多言語 | 日本語・英語ルート、canonical、hreflang | 海外向け発信の土台がある |
| 発見 | タグ、カテゴリ、全文検索、Notes、Projects、Travel | 個人サイトとして充実している |
| 回遊 | 関連記事、目次、固定記事 | 最低限の回遊導線がある |
| 配信 | 日本語・英語のRSS | 実装済みだが画面上の購読導線が弱い |
| SEO | sitemap、robots、OGP、JSON-LD、canonical | 技術的SEOの基礎が揃っている |
| 反応 | Neon匿名いいね、Giscusコメント | 軽い反応と深い会話を分担できる |
| 分析 | Google Analytics、Vercel Analytics、Speed Insights | 計測手段はあるがKPIとイベント設計が未整理 |
| 品質保証 | ESLint、TypeScript、Jest、buildをGitHub Actionsで実行 | 機能追加時の回帰を検知しやすい |

主な実装箇所は `app/[locale]/blog/[slug]/page.tsx`、`components/blog/ArticleEngagement.tsx`、`components/giscus-comments.tsx`、`app/[locale]/layout.tsx`、`lib/feed.ts`、`.github/workflows/ci.yml` にある。

### 現時点の不足

- プライバシーポリシーやCookie/分析ツールの説明ページが見当たらない。
- RSSはHTMLのalternate linkとフィード自体はあるが、一般の読者が画面から発見しにくい。
- どの行動を成功指標とするか、イベント命名、計測責任、保存期間が定義されていない。
- タグは存在するが、連載の順序、次の記事、シリーズ全体の進捗を表す仕組みがない。
- いいねは蓄積できるが、人気記事表示や編集判断への利用方針がまだない。
- GA4がレイアウトに直接組み込まれており、利用者への説明や地域ごとの同意要否を整理する余地がある。
- READMEの機能一覧が、いいね、多言語、RSS、現在のテスト構成まで十分に反映していない。

## ブログプラットフォーム比較

### 比較表

| 対象 | 主な強み | darkmocha.devが学ぶ点 | そのまま真似しない点 |
| --- | --- | --- | --- |
| **Zenn** | 記事、Books、Scraps、Publication、GitHub/CLI連携、RSS、PWA | シリーズ型コンテンツ、気軽な学習ログ、Git中心の執筆体験 | Zenn内の推薦・フォロワー基盤は独自サイトだけでは再現できない |
| **Qiita** | タグ、トレンド、ストック、パーソナライズされたフィード、Atom | 人気・新着・タグ購読を分ける情報設計 | 単純ないいね順ランキングは不正や古い記事への偏りが出る |
| **note** | マガジン、メンバーシップ、有料記事、幅広い読者層 | テーマ別コレクションと継続購読 | 現段階で課金・会員管理を自作すると記事作成より運用が重くなる |
| **Hashnode** | 独自ドメイン、Markdown、GitHub backup、Headless/GraphQL、インポート、予約公開 | 独自ドメインとGitを維持した公開ワークフロー、プレビュー、予約投稿 | 既存Next.jsサイトをHeadless化して二重管理する必然性は低い |
| **Ghost** | Membership、Newsletter、分析、読者フィードバック、コメント・モデレーション、データexport | 読者獲得から再訪・反応・改善までの一体的な循環 | 会員・配信・決済を一度に内製しない |
| **Medium** | Publication、複数執筆者、投稿審査、Newsletter、統計、Responses | 購読ランディング、メール経由の開封・クリック計測、編集フロー | プラットフォーム内露出を独自サイトの機能だけで代替しようとしない |
| **darkmocha.dev** | 完全な所有権、自由なUI、MDX/Git、多言語、検索、いいね、Giscus | 小さく実装して計測し、効果がある機能だけ残せる | 発見・購読・運用ツールをすべて自作すると記事を書く時間を失う |

### 公式資料から分かったこと

#### Zenn: 記事だけでなく、連載と途中経過を別の形で扱う

Zennは記事、Books、Scrapsを分け、Publicationでテーマやチーム単位にまとめている。GitHub連携ではCLIによるプレビューと公開管理ができる。darkmocha.devでは、新しいCMSを導入するより、既存MDXに `series` と `seriesOrder` を加える方が軽い。短い試行錯誤は既存のNotesをScraps相当として育てられる。

- [Zenn公式マニュアル](https://zenn.dev/manual)
- [Zenn CLIで記事・本を管理する](https://zenn.dev/zenn/articles/zenn-cli-guide)
- [Scrapsの使い方](https://zenn.dev/zenn/articles/about-zenn-scraps)
- [Publicationの使い方](https://zenn.dev/zenn/articles/how-to-use-publication)

#### Qiita: 発見経路を「人気」だけにまとめない

Qiitaのフィードは、いいねや閲覧履歴を使うおすすめ、トレンド、タグ、ストックを分けている。darkmocha.devにも「人気記事」は追加できるが、匿名いいね数だけで全期間ランキングを作ると、古い記事と連打・Cookie再生成の影響が強くなる。まずは編集者推薦、直近期間、記事の鮮度を加えた小さな枠から始める。

- [Qiita フィードの公式説明](https://help.qiita.com/ja/articles/qiita-feed)

#### note: マガジンは記事を目的別に束ねる

noteはマガジンとメンバーシップを提供している。現状のdarkmocha.devでは課金より、「Unity iOS化」「旅行記」「機械学習」などをシリーズまたはコレクションとして束ねる方が費用対効果が高い。課金は、定期的な独自コンテンツと読者需要を確認してから検討する。

- [note ヘルプセンター](https://www.help-note.com/hc/ja/)
- [note メンバーシップ](https://www.help-note.com/hc/ja/categories/24998983691801-%E3%83%A1%E3%83%B3%E3%83%90%E3%83%BC%E3%82%B7%E3%83%83%E3%83%97)

#### Hashnode: 所有権と配信機能を両立する

Hashnodeは独自ドメイン、Markdown、GitHub backup、インポート、Headless APIなどを前面に出している。これは現在の「GitHubを正本にし、Vercelへ配信する」方針の妥当性を補強する。必要なのは移行ではなく、下書きプレビュー、予約公開、frontmatter検証など編集体験の補強である。

- [Hashnode公式ドキュメント](https://docs.hashnode.com/)
- [Hashnode公式サイト](https://hashnode.com/)
- [Hashnode Pro公式発表](https://hashnode.com/changelog/2026-06-11-introducing-hashnode-pro)

#### Ghost: 成長ループと運用機能が最も参考になる

GhostはMembership、Newsletter、投稿分析、読者フィードバック、コメント・モデレーションを一体で提供する。記事ごとの流入元、ニュースレターの開封・クリック、登録への転換、読後フィードバックまで確認できる。darkmocha.devに全部を移植するのではなく、RSS/購読導線、読了後の次の行動、最小限のフィードバックの順で取り入れる。

- [Ghost公式ドキュメント](https://docs.ghost.org/introduction)
- [Ghost 投稿分析](https://ghost.org/help/post-analytics/)
- [Ghost コメント](https://ghost.org/help/commenting/)
- [Ghost Newsletter設定](https://ghost.org/help/setup-email-newsletters/)
- [Ghost 読者フィードバック](https://ghost.org/help/audience-feedback/)
- [Ghost データexport](https://ghost.org/help/exports/)

#### Medium: 購読と編集ワークフローを記事から分離する

Medium Publicationは複数投稿者、投稿受付、Newsletter、統計をまとめている。Newsletterでは購読ページ、配信、開封、クリックを追跡できる。個人ブログで複数投稿者機能は不要だが、「記事ページとは別に、何をどの頻度で届けるかを説明する購読ページ」は参考になる。

- [Medium Publication公式ガイド](https://help.medium.com/hc/en-us/articles/115004681607-Getting-started-with-a-Medium-publication)
- [Medium Newsletter公式ガイド](https://help.medium.com/hc/en-us/articles/115004682167-Newsletter)
- [Medium Responsesの管理](https://help.medium.com/hc/en-us/articles/217048127-Manage-responses)

## 優先バックログ

### P0: 次のリリースで行う

| 施策 | 目的 | 実装案 | 効果 | 工数 |
| --- | --- | --- | --- | --- |
| プライバシーページ | 信頼と分析ツール利用の透明性 | `/privacy` を日英で作成し、フッターからリンク | 高 | 小〜中 |
| 計測台帳 | 数字を増やす前に意味を固定 | `docs/analytics-plan.md` にKPI、イベント名、送信先、保持期間を記載 | 高 | 小 |
| RSS導線 | 新規バックエンドなしで再訪を作る | ヘッダーまたはフッターにRSSアイコンと説明を追加 | 中〜高 | 小 |
| 記事メタ情報 | 情報の鮮度と信頼性を明示 | 公開日と更新日、検証日、対象バージョン、出典欄を表示 | 高 | 小〜中 |
| frontmatter検証 | 公開事故をCIで防ぐ | Zod等でslug/date/title/description/locale/画像を検証 | 中 | 中 |
| Search Console運用 | 検索流入の事実を把握 | sitemap登録、週次でquery/page/country/deviceを確認 | 高 | 小 |

Googleは、公開日・更新日を読者に見える形で示し、`datePublished` と `dateModified` の構造化データと整合させることを勧めている。また著者名と著者URLをArticle構造化データに含められる。現在の著者カードはこの方向に合っている。

- [Google: 記事の日付表示](https://developers.google.com/search/docs/appearance/publication-dates?hl=en)
- [Google: Article構造化データ](https://developers.google.com/search/docs/appearance/structured-data/article)

### P1: 計測後1〜2か月で行う

| 施策 | 成功条件 | 実装案 | 注意点 |
| --- | --- | --- | --- |
| シリーズ | シリーズ内の次記事クリック率が関連記事より高い | `series`, `seriesOrder` をfrontmatterへ追加し、一覧・前後リンクを生成 | タグとの役割を分ける |
| 行動イベント | 改善前後を比較できる | GA4で `search_result_click`, `related_post_click`, `code_copy`, `read_complete`, `outbound_click`, `like_change` | 記事名などの低カーディナリティ値だけ送る |
| 検索改善 | 0件検索率低下、検索→記事CTR上昇 | 0件語を集計し、表記ゆれ・タグ・同義語を改善 | 生の検索語は個人情報を含み得る |
| 人気記事 | 人気枠からのCTRが既存固定記事を上回る | 直近30日、読了、いいね、鮮度、編集推薦を合成 | スコアと閾値を公開可能にする |
| 読者フィードバック | 記事改善につながる回答が集まる | 「役に立った / 足りなかった」を読了後に1回表示 | いいねと目的を混ぜない |
| メール購読 | 4週以上、約束した頻度で配信できる | 外部配信サービスを利用し、購読LPを設置 | メール配信基盤を自作しない |
| E2E・a11y | 主要導線の回帰をCIで検知 | Playwright + axe、モバイル幅、テーマ、検索、いいね、目次を検査 | 外部Giscusは境界を分ける |

Vercel Web AnalyticsはHobbyでもページビュー等を確認できる一方、2026-08-30時点でCustom EventsはPro/Enterprise向けである。Hobbyを維持するなら、カスタム行動は既存GA4で計測し、Vercelはページ・参照元・デバイスとSpeed Insightsに使う。

- [Vercel Web Analytics](https://vercel.com/docs/analytics)
- [Vercel Analyticsの料金・上限](https://vercel.com/docs/analytics/limits-and-pricing)
- [Vercel Custom Events](https://vercel.com/docs/analytics/custom-events)

### P2: 効果を確認してから行う

| 施策 | 推奨判断 |
| --- | --- |
| 読書進捗バー | 長文記事の離脱位置が課題と分かれば追加。状態は保存不要 |
| ブックマーク | 最初は `localStorage`。端末同期への要望が出てからアカウント/DBを検討 |
| PWA・オフライン | 再訪率とモバイル利用が高く、具体的なオフライン需要がある場合のみ |
| 独自コメントDB | Giscusで不足する要件が明確になるまで実装しない |
| 会員・有料記事 | 定期購読需要と継続供給能力を確認するまで実装しない |
| AI要約・AI検索 | 原文への導線、誤要約評価、推論費用を測れる段階まで保留 |
| パーソナライズ推薦 | 十分な閲覧母数と同意設計が必要。まずはルールベースで検証 |

## 推奨データ配置

| データ | 保存先 | 理由 | 保存期間の初期案 |
| --- | --- | --- | --- |
| 記事本文・メタデータ | GitHub/MDX | 変更履歴、レビュー、可搬性 | 無期限 |
| 匿名いいねの最終状態 | Neon | 端末をまたがないが、サーバー側で重複制約を持てる | 記事存続中。削除方針を文書化 |
| ページビュー・流入元 | Vercel Analytics / GA4 | 集計・可視化を自作しない | 各サービス設定に従い明示 |
| クリック・読了・検索CTR | GA4 | 既存導入済みでイベント分析が可能 | GA4設定を確認し明示 |
| Core Web Vitals | Vercel Speed Insights / Search Console | 実ユーザー値と検索影響を確認 | 各サービス設定に従う |
| 読書進捗 | メモリまたは `sessionStorage` | セッション内だけで十分 | タブ/セッション終了まで |
| ブックマーク | `localStorage` | ログイン・DBなしで価値を検証 | ユーザーが削除するまで |
| 明示的な記事フィードバック | Neon | 記事改善に使う正本 | 目的に必要な期間を決める |
| メールアドレス | 外部Newsletterサービス | 配信停止、到達性、法令対応を自作しない | サービスと方針に従う |

### Neonに入れない方がよいもの

- マウス移動、全スクロールイベントなどの大量な生ログ
- 生の検索文字列を無制限に保存する仕組み
- IPアドレスやブラウザfingerprint
- メール配信ログの独自実装
- ブラウザだけで完結する読書進捗

Neonはアプリの状態管理に使い、分析基盤にしない。これによりDB書き込み量だけでなく、個人情報・保持期間・削除要求を扱う範囲も抑えられる。

## 計測設計

### North Starと主要KPI

PVだけを最上位指標にせず、**「1人の読者が価値ある記事を読み、次の価値ある行動につながった回数」**を見る。

| 指標 | 定義 | 用途 |
| --- | --- | --- |
| 読了率 | `read_complete` / 記事view | 記事が期待に応えたかの代理指標 |
| 回遊率 | 関連記事・シリーズクリック / 記事view | 情報設計の評価 |
| 検索成功率 | 検索結果クリックのある検索 / 全検索 | サイト内検索の評価 |
| 0件検索率 | 0件検索 / 全検索 | 不足テーマ・表記ゆれの発見 |
| いいね率 | like状態をtrueにしたユニークvisitor / 記事view | 軽い満足度。絶対評価には使わない |
| 再訪率 | returning users / users | RSS、Newsletter、継続的価値の評価 |
| 購読転換率 | 購読完了 / 購読LP訪問 | 購読導線の評価 |
| Core Web Vitals合格率 | LCP/INP/CLSがgoodの訪問割合 | 実利用環境での品質 |

Core Web Vitalsの目安は、75パーセンタイルでLCP 2.5秒以下、INP 200ms以下、CLS 0.1以下である。Lighthouseのラボ値だけでなく、Speed InsightsやSearch Console等のフィールドデータで判断する。

- [web.dev: Web Vitals](https://web.dev/articles/vitals)
- [web.dev: Web Vitals計測の始め方](https://web.dev/articles/vitals-measurement-getting-started)

### 推奨イベント

| イベント名 | 発火条件 | 主な属性 | 二重送信対策 |
| --- | --- | --- | --- |
| `search_open` | 検索UIを開く | `locale`, `source` | 1セッション1回も併記可能 |
| `search_submit` | 入力が確定 | `locale`, `result_bucket` | debounce後に1回。生の語は送らない |
| `search_result_click` | 結果を選択 | `content_type`, `position` | navigation前に送信 |
| `related_post_click` | 関連記事を選択 | `post_id`, `position` | 通常クリック時のみ |
| `series_next_click` | 次の連載記事を選択 | `series_id`, `order` | 通常クリック時のみ |
| `code_copy` | コードコピー成功 | `post_id`, `block_index` | 同一blockは短時間dedupe |
| `read_complete` | 本文末尾を初めて表示 | `post_id`, `locale` | sessionStorageで記事ごとに1回 |
| `like_change` | APIが最終状態を返した | `post_id`, `liked` | 楽観表示時ではなく成功後 |
| `outbound_click` | 外部リンクへ遷移 | `post_id`, `domain` | URL全体やqueryは送らない |
| `subscribe_complete` | 外部サービスが登録完了 | `source`, `locale` | サーバー/完了画面のどちらか一方 |

Google Analyticsは自動収集、拡張計測、推奨イベント、カスタムイベントを使い分けられる。個人を特定できる情報や永続的な端末IDを送らず、利用者への適切な通知と、必要な地域では同意・オプトアウトを用意する。

- [GA4 イベント](https://developers.google.com/analytics/devguides/collection/ga4/events?hl=en)
- [Google Analytics Measurement Protocolポリシー](https://developers.google.com/analytics/devguides/collection/protocol/ga4/policy)

## プライバシー・信頼性

### 最低限記載する内容

プライバシーページは法的助言ではなく、実装と実態を正確に説明するページとして作る。必要な同意方式は、対象地域・アクセス状況・利用ツールの契約条件に応じて確認する。

- 運営者と連絡方法
- Google Analytics、Vercel Analytics、Speed Insightsの利用目的
- Giscus利用時にGitHubへ移動・ログインすること
- `NEXT_LOCALE` と `blog_visitor_id` の目的、保存期間、削除方法
- Neonに保存するいいね情報の内容と目的
- Cookieや計測を拒否・削除する方法
- 外部埋め込み、Instagram等へのリンクを開いたときは外部サービスの方針が適用されること
- 情報の保存期間とポリシー更新日

Vercelは標準Web Analyticsについて、Cookieを使わず匿名化データを保存すると説明している。一方、darkmocha.dev自身のいいね機能はCookieを使うため、自サイトの説明は別途必要である。

- [Vercel Analyticsのプライバシー説明](https://vercel.com/docs/analytics)
- [Vercel Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy)

### 記事の信頼性テンプレート

技術記事・比較記事には必要に応じて次を追加する。

```md
> 最終検証: 2026-08-30
> 検証環境: Next.js 16.x / Node.js 22.x / macOS ...
> 対象読者: ...
> 結論: ...

## 検証方法

## 制約・未確認事項

## 参考資料

## 更新履歴
```

Googleは、検索順位だけを狙う大量生成より、実体験・独自性・読後の満足を重視する「people-first content」を勧め、誰が、どのように、なぜ作った情報かを明確にするよう案内している。

- [Google: Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

## アクセシビリティと品質保証

目次、スライダー、検索ダイアログ、いいねは、見た目だけでなくキーボードとスクリーンリーダーで利用できる必要がある。W3Cは、見出し階層、`main`/`nav`/`aside`等のランドマーク、意味のあるリンク文言、画像の代替テキストを推奨している。

- [W3C WAI: Page Structure](https://www.w3.org/WAI/tutorials/page-structure/)
- [W3C WAI: Writing for Web Accessibility](https://www.w3.org/WAI/tips/writing/)

推奨CI段階は次のとおり。

1. **現在**: ESLint、TypeScript、Jest、production build
2. **次**: frontmatter schema、内部リンク、画像参照、重複slug、翻訳対応の検査
3. **次**: Playwrightでトップ、記事、検索、404、言語切替、テーマ、いいねを検査
4. **次**: axeで主要ページの重大なa11y違反を検査
5. **安定後**: Lighthouse CIに回帰閾値を設定。ただし実ユーザー値とは分ける

## 30 / 60 / 90日ロードマップ

### 0〜30日: 信頼と観測を整える

- 日英プライバシーページとフッターリンクを追加
- READMEに現在の機能、環境変数、テスト、RSSを反映
- RSSをフッターから購読可能にする
- Search ConsoleのsitemapとGA4連携状況を確認
- `docs/analytics-plan.md` を作り、イベントと保持期間を確定
- まずイベントを3つに絞る: `search_result_click`, `related_post_click`, `read_complete`
- frontmatter schemaとリンク/画像検査をCIへ追加

Googleは、検索前の行動はSearch Console、サイト内行動はGoogle Analyticsを正本として扱う考え方を示している。両者のクリックとセッションは定義が違うため、数値の完全一致ではなく傾向を見る。

- [Google: Search ConsoleとGoogle Analyticsの併用](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console)

### 31〜60日: 回遊を改善する

- 30日分の基準値を記録
- `series` / `seriesOrder` frontmatterとシリーズ一覧を実装
- 関連記事の理由を「同じタグ」など短く表示
- 0件検索の比率とカテゴリだけを確認し、同義語・タイトルを改善
- 読了後CTAをA/Bではなく、まず固定で1種類試す
- 主要ページへPlaywright + axeを追加

### 61〜90日: 再訪を作る

- RSSクリックと再訪の変化を確認
- 継続配信できるなら外部Newsletterサービスと購読LPを導入
- 人気記事を「直近30日 + 読了 + いいね + 編集推薦」で試験表示
- 読後フィードバックを小さく試し、改善に使えるか確認
- 効果のないイベントやUIを削除
- このレポートを実データで更新し、P2の採否を決める

## 実装順の判断基準

新機能は次の5項目のうち4項目以上を満たす場合に実装候補とする。

1. 読者の具体的な問題を解決する。
2. 成功・失敗を計測できる。
3. 既存サービスで代替するより自作が軽い。
4. 個人情報とモデレーションの負担を説明できる。
5. 記事執筆時間を継続的に奪わない。

特に、独自アカウント、独自コメント、メール配信、決済、複雑な推薦は、作ることより運用・不正対策・削除対応が長く残る。現状はGiscusや外部Newsletterを活用し、darkmocha.dev固有の価値である記事、シリーズ、検索、実体験の提示に開発時間を使う。

## 今後の追加調査

このレポートを実データで更新する際は、次を確認する。

- Search Console: 上位query、表示は多いがCTRが低いpage、クロール・構造化データエラー
- GA4: landing page別のengagement、再訪、内部遷移、言語別差
- Vercel: 実ユーザーのLCP/INP/CLS、端末別・ページ別の悪化
- Neon: 記事別いいね率、異常な連続増加、API失敗率、DB利用量
- Giscus: コメントが付く記事の種類、スパム・モデレーション負荷
- 読者ヒアリング: 目的の記事を探せるか、次に読みたい記事が分かるか、RSS/メールのどちらを望むか
- 配信実験: Zenn/Qiitaへ選択的に再編集した記事から、本サイトへの流入と購読が増えるか

数値を得たら、「機能があるか」ではなく「読者が目的を達成し、再訪したか」で施策を削る。これが、機能の多いプラットフォームと競うより、個人ブログの強みを維持しやすい進め方である。
