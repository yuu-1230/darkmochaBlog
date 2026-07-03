import React, { ComponentPropsWithoutRef } from "react";

export const C = ({ c, children }: { c: string; children: React.ReactNode }) => {
  const colorMap: Record<string, string> = {
    red: "text-rose-500",
    blue: "text-blue-500",
    green: "text-emerald-500",
    orange: "text-orange-400",
    yellow: "text-yellow-400",
    purple: "text-purple-500",
    comment: "text-slate-400",
    gray: "text-slate-400",
  };

  const className = colorMap[c];

  return className ? (
    <span className={className}>{children}</span>
  ) : (
    <span style={{ color: c }}>{children}</span>
  );
};

export const typographyComponents = {
  C,

  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-3xl font-bold text-foreground mt-12 mb-6 border-b pb-2"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl font-semibold text-foreground mt-10 mb-4 pt-4 -mt-4"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-xl font-semibold text-foreground mt-6 mb-3"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <div className="text-foreground leading-[1.75] mb-6 text-base" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto mb-8">
      <table
        className="w-full text-left border-collapse border border-border"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-muted" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="divide-y divide-border" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="hover:bg-muted transition-colors" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-3 font-bold text-foreground border border-border whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-3 text-muted-foreground border border-border" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside mb-6 text-foreground space-y-2 ml-4"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside mb-6 text-foreground space-y-2 ml-4"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-primary/50 bg-muted px-4 py-3 mb-6 text-muted-foreground italic rounded-r"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="border-border my-10" {...props} />
  ),
};
