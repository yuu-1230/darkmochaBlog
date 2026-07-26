import Link from "next/link";
import { Github, AlertCircle } from "lucide-react";
import {
  getGithubContributions,
  type ContributionDay,
  type ContributionLevel,
  type ContributionWeek,
} from "@/lib/github-contributions";

const CELL_SIZE = 11;
const CELL_GAP = 3;

const LEVEL_BG_CLASS: Record<ContributionLevel, string> = {
  0: "bg-muted",
  1: "bg-primary/25",
  2: "bg-primary/45",
  3: "bg-primary/70",
  4: "bg-primary/95",
};

const WEEKDAY_LABELS: Record<number, string> = {
  1: "Mon",
  3: "Wed",
  5: "Fri",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDateLabel(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

function toWeekSlots(week: ContributionWeek): (ContributionDay | null)[] {
  const slots: (ContributionDay | null)[] = [null, null, null, null, null, null, null];
  for (const day of week.days) {
    if (day.weekday >= 0 && day.weekday <= 6) {
      slots[day.weekday] = day;
    }
  }
  return slots;
}

const MIN_WEEKS_BETWEEN_LABELS = 3;

function getMonthLabels(weeks: ContributionWeek[]): { weekIndex: number; label: string }[] {
  const labels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, index) => {
    const firstDay = week.days[0];
    if (!firstDay) return;
    const month = Number(firstDay.date.split("-")[1]) - 1;
    const lastLabel = labels[labels.length - 1];
    if (month !== lastMonth && (!lastLabel || index - lastLabel.weekIndex >= MIN_WEEKS_BETWEEN_LABELS)) {
      labels.push({ weekIndex: index, label: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });
  return labels;
}

function GraphSectionHeader() {
  return (
    <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2">
      <span className="text-primary/60">{"//"}</span>
      GitHub Activity
    </h2>
  );
}

function FallbackNotice({ message }: { message: string }) {
  return (
    <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-2.5 text-sm text-muted-foreground">
      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}

export async function GithubContributionGraph() {
  const result = await getGithubContributions();

  if (!result.ok) {
    const message =
      result.reason === "missing_env"
        ? "GitHub Activity は現在準備中です。"
        : result.reason === "user_not_found"
          ? "指定された GitHub ユーザーが見つかりませんでした。"
          : "GitHub の Contribution データを取得できませんでした。";
    return (
      <section className="space-y-6">
        <GraphSectionHeader />
        <FallbackNotice message={message} />
      </section>
    );
  }

  const { data } = result;
  const monthLabels = getMonthLabels(data.weeks);
  const columnTemplate = `repeat(${data.weeks.length}, ${CELL_SIZE}px)`;
  const profileUrl = `https://github.com/${data.username}`;

  return (
    <section className="space-y-6" aria-label="GitHub Contribution Graph">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <GraphSectionHeader />
        <Link
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <Github className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden />@{data.username}
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-foreground/85 mb-4">
          過去1年間で
          <span className="font-mono font-medium text-foreground mx-1">
            {data.totalContributions.toLocaleString()}
          </span>
          件の Contribution
        </p>

        <div className="flex gap-2">
          {/* Weekday labels (fixed, not part of the horizontal scroll) */}
          <div
            className="grid shrink-0"
            style={{
              gridTemplateRows: `${CELL_SIZE}px repeat(7, ${CELL_SIZE}px)`,
              rowGap: CELL_GAP,
            }}
          >
            <span aria-hidden />
            {Array.from({ length: 7 }, (_, weekday) => (
              <span
                key={weekday}
                className="text-[9px] leading-none text-muted-foreground font-mono flex items-center"
                aria-hidden
              >
                {WEEKDAY_LABELS[weekday] ?? ""}
              </span>
            ))}
          </div>

          {/* Scrollable area — defaults to showing the most recent weeks first */}
          <div className="overflow-x-auto pb-7" dir="rtl">
            <div dir="ltr" style={{ minWidth: data.weeks.length * (CELL_SIZE + CELL_GAP) }}>
              {/* Month labels */}
              <div
                className="grid mb-0.75"
                style={{ gridTemplateColumns: columnTemplate, gap: CELL_GAP, height: CELL_SIZE }}
              >
                {data.weeks.map((_, index) => {
                  const label = monthLabels.find((m) => m.weekIndex === index);
                  return (
                    <span
                      key={index}
                      className="text-[9px] leading-none text-muted-foreground font-mono"
                      aria-hidden
                    >
                      {label?.label ?? ""}
                    </span>
                  );
                })}
              </div>

              {/* Contribution cells */}
              <div
                className="grid grid-flow-col"
                style={{
                  gridTemplateColumns: columnTemplate,
                  gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
                  gap: CELL_GAP,
                }}
              >
                {data.weeks.flatMap((week, weekIndex) =>
                  toWeekSlots(week).map((day, dayIndex) => {
                    if (!day) {
                      return <span key={`${weekIndex}-${dayIndex}`} aria-hidden />;
                    }
                    const label = `${formatDateLabel(day.date)}: ${day.count}件の Contribution`;
                    const edgeMargin = Math.min(6, Math.floor(data.weeks.length / 2));
                    const tooltipAlignClass =
                      weekIndex < edgeMargin
                        ? "left-0"
                        : weekIndex >= data.weeks.length - edgeMargin
                          ? "right-0"
                          : "left-1/2 -translate-x-1/2";
                    return (
                      <span
                        key={day.date}
                        role="img"
                        aria-label={label}
                        className={`group relative rounded-sm border border-border/60 ${LEVEL_BG_CLASS[day.level]}`}
                      >
                        <span
                          role="tooltip"
                          className={`pointer-events-none absolute top-full z-10 mt-1.5 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] text-popover-foreground opacity-0 shadow-md group-hover:opacity-100 ${tooltipAlignClass}`}
                        >
                          {label}
                        </span>
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-4 text-[10px] text-muted-foreground">
          <span>Less</span>
          {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
            <span
              key={level}
              className={`w-2.5 h-2.5 rounded-sm border border-border/60 ${LEVEL_BG_CLASS[level]}`}
              aria-hidden
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
