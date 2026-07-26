import "server-only";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const REVALIDATE_SECONDS = 60 * 60 * 6; // 6時間

const CONTRIBUTIONS_QUERY = /* GraphQL */ `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
  color: string;
  weekday: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface ContributionData {
  username: string;
  totalContributions: number;
  weeks: ContributionWeek[];
}

export type ContributionResult =
  | { ok: true; data: ContributionData }
  | { ok: false; reason: "missing_env" | "user_not_found" | "api_error" | "network_error" };

const CONTRIBUTION_LEVEL_MAP: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

interface GraphQLDay {
  date: string;
  contributionCount: number;
  contributionLevel: string;
  color: string;
  weekday: number;
}

interface GraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: GraphQLDay[] }[];
        };
      };
    } | null;
  };
  errors?: { type?: string; message: string }[];
}

export async function getGithubContributions(): Promise<ContributionResult> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    return { ok: false, reason: "missing_env" };
  }

  let res: Response;
  try {
    res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: username },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch {
    return { ok: false, reason: "network_error" };
  }

  if (res.status === 401 || res.status === 403) {
    return { ok: false, reason: "api_error" };
  }
  if (!res.ok) {
    return { ok: false, reason: "api_error" };
  }

  let json: GraphQLResponse;
  try {
    json = await res.json();
  } catch {
    return { ok: false, reason: "api_error" };
  }

  if (json.errors?.length) {
    const notFound = json.errors.some((e) => e.type === "NOT_FOUND");
    return { ok: false, reason: notFound ? "user_not_found" : "api_error" };
  }

  const calendar = json.data?.user?.contributionsCollection.contributionCalendar;
  if (!calendar) {
    return { ok: false, reason: "user_not_found" };
  }

  const weeks: ContributionWeek[] = calendar.weeks.map((week) => ({
    days: week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: CONTRIBUTION_LEVEL_MAP[day.contributionLevel] ?? 0,
      color: day.color,
      weekday: day.weekday,
    })),
  }));

  return {
    ok: true,
    data: {
      username,
      totalContributions: calendar.totalContributions,
      weeks,
    },
  };
}
