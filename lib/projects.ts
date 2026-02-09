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
      "AtomicDesignの設計思想を学び各コンポーネントを作成しました。親から子へのPropsバケツリレーや、useContextを用いたデータ共有（グローバルなテーマ設定など）を理解しました。また、LocalStorageを使ってブラウザにデータを永続化する実装も行いました。",
  },
  {
    id: "talk-one",
    title: "TalkOne",
    image: "/images/projects/TalkOne.png",
    description:
      "Zenn主催 AI Agent Hackathon 提出作品。AIともマッチングする匿名通話アプリ。",
    techStack: ["Flutter", "Dart", "Firebase", "AI Agent"],
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
      "Flutter/Dartに初挑戦し、Cursorを用いたバイブコーディング開発を実践。デザイン実装の難しさや、チーム開発（2人）でのスケジュール調整の重要性と楽しさを学びました。",
  },
  {
    id: "kindly-sns",
    title: "kindly-sns",
    image: "/images/projects/Kindly-sns.png",
    description:
      "チクチク言葉を柔らかい言葉に変換してくれる、優しい世界を目指すSNS。",
    techStack: ["Next.js", "OpenAI API"],
    links: [
      { label: "GitHub", url: "https://github.com/luck-tech/kindly-sns" },
    ],
    icon: Heart,
    learned:
      "生成AIをSNSの投稿フローに組み込むUXを設計。ネガティブな感情をポジティブに変換するアルゴリズムの調整に注力しました。",
  },
  {
    id: "progate-hackathon",
    title: "Todo Bingo",
    image: "/images/projects/Bingo.png",
    description:
      "夏休み暇になった時に、夏らしいやることを提案してくれるビンゴ形式のタスクアプリ。",
    techStack: ["React", "Go", "Hackathon"],
    links: [
      {
        label: "Project Page",
        url: "https://topaz.dev/projects/f36e495e69f19dd15dd4",
      },
    ],
    icon: Calendar,
    learned:
      "ハッカソンという短期間での開発において、MVP（Minimum Viable Product）を定義し、優先順位をつけて実装するプロセスを経験しました。",
  },
  {
    id: "nasa-spaceapps",
    title: "BloomWatch (FioreSakura)",
    image: "/images/projects/NASA-SpaceAppsChallenge.png",
    description:
      "NASA Space Apps Challenge 2025 提出作品。気候データを用いた桜の開花予測アプリケーション。",
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
      "オープンデータの活用方法と、データを可視化してユーザーに伝えるUI/UXの重要性を学びました。英語でのプレゼンテーション資料作成にも挑戦しました。",
  },
  {
    id: "bsky-bot",
    title: "bsky-webcam-bot",
    image: "/images/projects/BskyBot.png",
    description:
      "Bluesky内で9時間おきに世界中のWebカメラ画像をランダムで投稿するBot。",
    techStack: ["Python 3.12", "GitHub Actions", "atproto", "Windy API"],
    links: [
      { label: "GitHub(private)", url: "https://github.com/yuu-1230" }, // リンク修正必要かも
    ],
    icon: Bot,
    learned:
      "APIの呼び出し処理やデータ取得の実装だけでなく、GitHub Actionsを用いたサーバーレス運用の構築に苦戦しました。特にリポジトリ認識までのラグ（約3日）や、Cron実行の時間の誤差（±20分）など、運用して初めて分かる知見を得ました。",
  },
  {
    id: "blog",
    title: "darkmochaBlog",
    image: "/images/projects/Blog.png",
    description: "現在閲覧中のこのポートフォリオブログ。VS CodeのUIを再現。",
    techStack: ["Next.js 16", "Tailwind CSS", "MDX"],
    links: [{ label: "GitHub(private)", url: "https://github.com/yuu-1230" }],
    icon: PenTool,
    learned:
      "Next.js App Routerの深い理解と、コンポーネント設計、そして「遊び心」を形にするCSS力が向上中です。",
  },
];
