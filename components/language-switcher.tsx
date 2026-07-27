"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, LOCALE_LABELS, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-3 py-1.5",
} as const;

type Props = {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
};

/**
 * JA / EN のセグメントトグル。
 * next-intl の usePathname はロケールを除いたパスを返すため、
 * 同じページのまま言語だけを切り替えられる。
 */
export function LanguageSwitcher({ size = "sm", className }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common.language");
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border p-0.5 font-mono",
        isPending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((l) => {
        const isActive = l === locale;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            disabled={isPending}
            aria-current={isActive ? "true" : undefined}
            aria-label={t("switchTo", { name: t(`names.${l}`) })}
            className={cn(
              "rounded-sm transition-colors",
              SIZE_CLASS[size],
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            {LOCALE_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
