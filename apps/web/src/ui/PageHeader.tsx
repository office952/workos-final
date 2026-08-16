import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  lead?: string;
  meta?: ReactNode;
};

export function PageHeader({ title, lead, meta }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {lead ? <p className="page-lead">{lead}</p> : null}
      {meta}
    </header>
  );
}
