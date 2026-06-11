import { ComponentPropsWithoutRef } from "react";

export const codeComponents = {
  code: (props: ComponentPropsWithoutRef<"code">) => {
    if ("data-language" in props) {
      return <code {...props} />;
    }
    return (
      <code
        className="font-mono text-rose-500 bg-muted px-1.5 py-0.5 rounded text-sm mx-1"
        {...props}
      />
    );
  },
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-card border border-border rounded-lg py-4 overflow-x-auto mb-8 text-sm font-mono leading-relaxed"
      {...props}
    />
  ),
};
