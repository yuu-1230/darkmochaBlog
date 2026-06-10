import React from "react";
import { Lightbulb, AlertTriangle, Info, ChevronRight } from "lucide-react";

type TipType = "tip" | "warning" | "info";

const tipConfig: Record<
  TipType,
  { accentVar: string; icon: React.ReactNode; defaultTitle: string }
> = {
  tip: {
    accentVar: "var(--primary)",
    icon: <Lightbulb className="w-5 h-5 shrink-0" />,
    defaultTitle: "TIPS",
  },
  warning: {
    accentVar: "var(--destructive)",
    icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    defaultTitle: "WARNING",
  },
  info: {
    accentVar: "var(--muted-foreground)",
    icon: <Info className="w-5 h-5 shrink-0" />,
    defaultTitle: "INFO",
  },
};

export const Tip = ({
  children,
  type = "tip",
  title,
}: {
  children: React.ReactNode;
  type?: TipType;
  title?: string;
}) => {
  const style = tipConfig[type];

  return (
    <details
      className="my-8 rounded-r-lg shadow-sm group cursor-pointer"
      style={{
        borderLeft: `4px solid ${style.accentVar}`,
        background: "var(--card)",
      }}
    >
      <summary
        className="flex items-center gap-2 font-bold p-4 md:p-5 outline-none list-none [&::-webkit-details-marker]:hidden"
        style={{ color: style.accentVar }}
      >
        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-open:rotate-90 shrink-0" />
        {style.icon}
        <span>{title || style.defaultTitle}</span>
      </summary>
      <div className="text-foreground/90 text-sm md:text-base leading-relaxed px-4 pb-4 md:px-5 md:pb-5 pt-0 mt-2">
        {children}
      </div>
    </details>
  );
};

export const calloutComponents = {
  Tip,
};
