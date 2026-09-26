import type { ReactNode } from "react";

export function EditorialPageHeader({
  title,
  description,
  meta,
}: {
  title: string;
  description?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="editorial-page-header">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {meta && <p className="editorial-page-meta">{meta}</p>}
    </header>
  );
}
