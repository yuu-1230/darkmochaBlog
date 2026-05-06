import {
  LucideIcon,
  Layout,
  MessageCircle,
  Heart,
  Calendar,
  Satellite,
  Bot,
  PenTool,
} from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  links: { label: string; url: string }[];
  image?: string; // 画像パス (public/images/projects/...)
  icon: LucideIcon; // プロジェクトを表すアイコン
  learned: string; // 学んだこと
};

export const projects: Project[] = [
  {
    id: "todo-app",
    title: "frontend-basic-2024-todoapp",
    image: "/images/projects/TodoApp.png",
    description:
      "学生ITコミュニティPlayGroundのFrontendコース課題。Reactの基礎（Atomic Design, Storybook）を学ぶためのTodoアプリ。",
    techStack: ["React", "TypeScript", "Atomic Design", "Storybook"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/yuu-1230/Yuto-frontend-basic-2024-todoapp",
      },
    ],
    icon: Layout,
    learned:
      "Atomic Designの設計思想をもとに各コンポーネントを実装しました。親から子へのPropsのバケツリレーや、useContextを用いたグローバルなデータ共有を理解し、LocalStorageによるデータの永続化も実践しました。",
  },
  {
    id: "talk-one",
    title: "TalkOne",
    image: "/images/projects/TalkOne.png",
    description:
      "Zenn主催 AI Agent Hackathon 提出作品。AIともマッチングする匿名通話アプリ。",
    techStack: ["Flutter", "Dart", "Firebase", "Gemini", "Google Cloud", "Agora"],
    links: [
      {
        label: "AppStore",
        url: "https://apps.apple.com/jp/app/talkone/id6747909782",
      },
      { label: "GitHub", url: "https://github.com/truemato/TalkOne" },
      {
        label: "Zenn Article",
        url: "https://zenn.dev/yuuu1230/articles/cd90960b481966",
      },
    ],
    icon: MessageCircle,
    learned:
      "Flutter/Dartに初挑戦し、Cursorを活用したバイブコーディングで開発を加速させました。レーティングシステムやAIエージェント連携など複雑な機能を2人チームで実装する中で、スコープの切り分けやスケジュール管理の重要性を実感しました。",
  },
  {
    id: "kindly-sns",
    title: "kindly-sns",
    image: "/images/projects/Kindly-sns.png",
    description:
      "チクチク言葉をDeepSeek APIで優しい言葉に変換してくれる、穏やかな投稿を促すSNS。",
    techStack: ["Next.js", "TypeScript", "DeepSeek API"],
    links: [
      { label: "GitHub", url: "https://github.com/luck-tech/kindly-sns" },
    ],
    icon: Heart,
    learned:
      "５人でのチーム開発で、GitHubを使ったブランチ管理やプルリクエストによるコードレビューを実践しました。ログイン・サインアップ画面の実装やAPI連携、ホーム画面（タイムライン）を担当し、先輩からのレビューを通じて実務に近い開発フローを経験できました。",
  },
  {
    id: "progate-hackathon",
    title: "Todo Bingo",
    image: "/images/projects/Bingo.png",
    description:
      "夏休みの暇つぶしに、AIが夏らしいお題を生成してくれるビンゴ形式のタスクアプリ。",
    techStack: ["Next.js", "TypeScript", "React", "PostgreSQL", "DeepSeek API"],
    links: [
      {
        label: "Project Page",
        url: "https://topaz.dev/projects/f36e495e69f19dd15dd4",
      },
    ],
    icon: Calendar,
    learned:
      "ハッカソンという短期間の開発で、MVPを定義して優先順位をつけながら実装するプロセスを経験しました。DeepSeek APIで自然言語からビンゴカードを生成するなど、AIをプロダクトに組み込む設計も学びました。",
  },
  {
    id: "nasa-spaceapps",
    title: "BloomWatch (FioreSakura)",
    image: "/images/projects/NASA-SpaceAppsChallenge.png",
    description:
      "NASA Space Apps Challenge 2025 提出作品・最優秀賞受賞。NDVIや全天日射量などの気候データを用いた桜の開花予測アプリケーション。",
    techStack: ["Python", "Data Analysis", "NASA API"],
    links: [
      {
        label: "Presentation",
        url: "https://www.canva.com/design/DAG04XVDjz4/zWUaaKVBEHxQtUGIKsJnTA/view",
      },
      { label: "YouTube", url: "https://youtu.be/Hb5Z6hqt9nQ" },
      {
        label: "GitHub",
        url: "https://github.com/tanabedesu/myproject/tree/main/nasa_spaceapps",
      },
    ],
    icon: Satellite,
    learned:
      "5人チームで実質2人での開発となる中、お互いにカバーし合いながら最優秀賞を獲得できました。NASAのオープンデータ活用や気候データの可視化、英語でのプレゼン資料作成など、幅広いスキルに挑戦した経験になりました。",
  },
  {
    id: "bsky-bot",
    title: "bsky-webcam-bot",
    image: "/images/projects/BskyBot.png",
    description:
      "Bluesky内で9時間おきに世界中のWebカメラ画像をランダムで投稿するBot。",
    techStack: ["Python 3.12", "GitHub Actions", "atproto", "Windy API"],
    links: [{ label: "GitHub(private)", url: "https://github.com/yuu-1230" }],
    icon: Bot,
    learned:
      "APIの呼び出しやデータ取得の実装だけでなく、GitHub Actionsを用いたサーバーレス運用の構築に苦戦しました。リポジトリ認識までのラグ（約3日）やCronの時間誤差（±20分）など、実際に運用して初めてわかる知見を得ました。",
  },
  {
    id: "blog",
    title: "darkmochaBlog",
    image: "/images/projects/Blog.png",
    description: "フロントエンド・Unity・旅行記を記録するブログ。",
    techStack: ["Next.js 15", "Tailwind CSS", "MDX"],
    links: [{ label: "GitHub(private)", url: "https://github.com/yuu-1230" }],
    icon: PenTool,
    learned:
      "microCMSなどのヘッドレスCMSを使わず、MDXから直接記事を取得する仕組みを自前で構築しました。柔軟なカスタマイズ性を活かしつつ、効率的なコンポーネント設計やApp Routerの深い理解につながりました。",
  },
];