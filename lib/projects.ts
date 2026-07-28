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
import type { Locale } from "@/i18n/routing";

/** ロケールごとの文言。辞書には出さず、プロジェクト定義のそばに置いて編集しやすくする */
export type LocalizedText = Record<Locale, string>;

export type Project = {
  id: string;
  title: string;
  description: LocalizedText;
  techStack: string[];
  links: { label: string; url: string }[];
  image?: string; // 画像パス (public/images/projects/...)
  icon: LucideIcon; // プロジェクトを表すアイコン
  learned: LocalizedText; // 学んだこと
};

export const projects: Project[] = [
  {
    id: "todo-app",
    title: "frontend-basic-2024-todoapp",
    image: "/images/projects/TodoApp.png",
    description: {
      ja: "学生ITコミュニティPlayGroundのFrontendコース課題。Reactの基礎（Atomic Design, Storybook）を学ぶためのTodoアプリ。",
      en: "An assignment from the frontend course at PlayGround, a student IT community. A todo app for learning the basics of React (Atomic Design, Storybook).",
    },
    techStack: ["React", "TypeScript", "Atomic Design", "Storybook"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/yuu-1230/Yuto-frontend-basic-2024-todoapp",
      },
    ],
    icon: Layout,
    learned: {
      ja: "Atomic Designの設計思想をもとに各コンポーネントを実装しました。親から子へのPropsのバケツリレーや、useContextを用いたグローバルなデータ共有を理解し、LocalStorageによるデータの永続化も実践しました。",
      en: "I built each component following the Atomic Design philosophy. I came to understand prop drilling from parent to child and global state sharing with useContext, and also practiced persisting data with LocalStorage.",
    },
  },
  {
    id: "talk-one",
    title: "TalkOne",
    image: "/images/projects/TalkOne.png",
    description: {
      ja: "Zenn主催 AI Agent Hackathon 提出作品。AIともマッチングする匿名通話アプリ。",
      en: "An entry for the AI Agent Hackathon hosted by Zenn. An anonymous voice-call app that can match you with an AI as well as with people.",
    },
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
    learned: {
      ja: "Flutter/Dartに初挑戦し、Cursorを活用したバイブコーディングで開発を加速させました。レーティングシステムやAIエージェント連携など複雑な機能を2人チームで実装する中で、スコープの切り分けやスケジュール管理の重要性を実感しました。",
      en: "My first time with Flutter and Dart, and I leaned on vibe coding with Cursor to move faster. Implementing complex features like the rating system and AI agent integration as a team of two taught me how much scoping and schedule management matter.",
    },
  },
  {
    id: "kindly-sns",
    title: "kindly-sns",
    image: "/images/projects/Kindly-sns.png",
    description: {
      ja: "チクチク言葉をDeepSeek APIで優しい言葉に変換してくれる、穏やかな投稿を促すSNS。",
      en: "A social app that encourages gentler posting by using the DeepSeek API to rewrite barbed wording into kinder phrasing.",
    },
    techStack: ["Next.js", "TypeScript", "DeepSeek API"],
    links: [
      { label: "GitHub", url: "https://github.com/luck-tech/kindly-sns" },
    ],
    icon: Heart,
    learned: {
      ja: "５人でのチーム開発で、GitHubを使ったブランチ管理やプルリクエストによるコードレビューを実践しました。ログイン・サインアップ画面の実装やAPI連携、ホーム画面（タイムライン）を担当し、先輩からのレビューを通じて実務に近い開発フローを経験できました。",
      en: "Developing in a team of five, I practiced branch management on GitHub and code review through pull requests. I was responsible for the login and signup screens, the API integration, and the home timeline, and reviews from more experienced members gave me a taste of a real-world development workflow.",
    },
  },
  {
    id: "progate-hackathon",
    title: "Todo Bingo",
    image: "/images/projects/Bingo.png",
    description: {
      ja: "夏休みの暇つぶしに、AIが夏らしいお題を生成してくれるビンゴ形式のタスクアプリ。",
      en: "A bingo-style task app for killing time over summer break, where an AI generates suitably summery prompts.",
    },
    techStack: ["Next.js", "TypeScript", "React", "PostgreSQL", "DeepSeek API"],
    links: [
      {
        label: "Project Page",
        url: "https://topaz.dev/projects/f36e495e69f19dd15dd4",
      },
    ],
    icon: Calendar,
    learned: {
      ja: "ハッカソンという短期間の開発で、MVPを定義して優先順位をつけながら実装するプロセスを経験しました。DeepSeek APIで自然言語からビンゴカードを生成するなど、AIをプロダクトに組み込む設計も学びました。",
      en: "The short timeframe of a hackathon taught me the process of defining an MVP and implementing against priorities. I also learned how to design AI into a product, such as generating bingo cards from natural language with the DeepSeek API.",
    },
  },
  {
    id: "nasa-spaceapps",
    title: "BloomWatch (FioreSakura)",
    image: "/images/projects/NASA-SpaceAppsChallenge.png",
    description: {
      ja: "NASA Space Apps Challenge 2025 提出作品・最優秀賞受賞。NDVIや全天日射量などの気候データを用いた桜の開花予測アプリケーション。",
      en: "Our entry for NASA Space Apps Challenge 2025, which won the top prize. An application that predicts cherry blossom bloom dates from climate data such as NDVI and global solar radiation.",
    },
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
    learned: {
      ja: "5人チームで実質2人での開発となる中、お互いにカバーし合いながら最優秀賞を獲得できました。NASAのオープンデータ活用や気候データの可視化、英語でのプレゼン資料作成など、幅広いスキルに挑戦した経験になりました。",
      en: "Although we were a team of five, the build effectively came down to two of us covering for each other, and we still took the top prize. It pushed me across a wide range of skills: working with NASA open data, visualizing climate data, and putting together a presentation in English.",
    },
  },
  {
    id: "bsky-bot",
    title: "bsky-webcam-bot",
    image: "/images/projects/BskyBot.png",
    description: {
      ja: "Bluesky内で9時間おきに世界中のWebカメラ画像をランダムで投稿するBot。",
      en: "A bot that posts a random webcam image from somewhere in the world to Bluesky every nine hours.",
    },
    techStack: ["Python 3.12", "GitHub Actions", "atproto", "Windy API"],
    links: [{ label: "GitHub(private)", url: "https://github.com/yuu-1230" }],
    icon: Bot,
    learned: {
      ja: "APIの呼び出しやデータ取得の実装だけでなく、GitHub Actionsを用いたサーバーレス運用の構築に苦戦しました。リポジトリ認識までのラグ（約3日）やCronの時間誤差（±20分）など、実際に運用して初めてわかる知見を得ました。",
      en: "Beyond calling APIs and fetching data, I struggled with building serverless operations on GitHub Actions. Running it for real surfaced things you only learn in production, like the roughly three-day lag before the repository is picked up and the ±20 minute drift in cron timing.",
    },
  },
  {
    id: "blog",
    title: "darkmochaBlog",
    image: "/images/projects/Blog.png",
    description: {
      ja: "フロントエンド・Unity・旅行記を記録するブログ。",
      en: "A blog where I write about frontend development, Unity, and travel.",
    },
    techStack: ["Next.js 15", "Tailwind CSS", "MDX"],
    links: [{ label: "GitHub(private)", url: "https://github.com/yuu-1230" }],
    icon: PenTool,
    learned: {
      ja: "microCMSなどのヘッドレスCMSを使わず、MDXから直接記事を取得する仕組みを自前で構築しました。柔軟なカスタマイズ性を活かしつつ、効率的なコンポーネント設計やApp Routerの深い理解につながりました。",
      en: "Rather than using a headless CMS like microCMS, I built my own pipeline that reads articles directly from MDX. Keeping that flexibility led me to better component design and a much deeper understanding of the App Router.",
    },
  },
];
