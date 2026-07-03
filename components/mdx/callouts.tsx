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
    accentVar: "var(--info)",
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
  const edgeBorder = `1px solid color-mix(in srgb, ${style.accentVar} 30%, transparent)`;

  return (
    <details
      className="my-8 rounded-lg overflow-hidden shadow-sm group cursor-pointer"
      style={{
        borderTop: edgeBorder,
        borderRight: edgeBorder,
        borderBottom: edgeBorder,
        borderLeft: `4px solid ${style.accentVar}`,
        background: `color-mix(in srgb, ${style.accentVar} 8%, var(--card))`,
      }}
    >
      <summary className="flex items-center gap-2 font-bold p-4 md:p-5 list-none [&::-webkit-details-marker]:hidden text-foreground">
        <span className="flex items-center gap-2 shrink-0" style={{ color: style.accentVar }}>
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-open:rotate-90 shrink-0" />
          {style.icon}
        </span>
        <span>{title || style.defaultTitle}</span>
      </summary>
      <div
        className="text-foreground text-sm md:text-base leading-relaxed px-4 py-4 md:px-5 md:py-5"
        style={{
          borderTop: `1px solid color-mix(in srgb, ${style.accentVar} 20%, transparent)`,
        }}
      >
        {children}
      </div>
    </details>
  );
};

export const calloutComponents = {
  Tip,
};
