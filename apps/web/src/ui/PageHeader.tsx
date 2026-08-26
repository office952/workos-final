import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  lead?: string;
  meta?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, lead, meta, actions }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-row">
        <div className="page-header-copy">
          <h1>{title}</h1>
          {lead ? <p className="page-lead">{lead}</p> : null}
        </div>
        {actions ? <div className="page-header-actions">{actions}</div> : null}
      </div>
      {meta}
    </header>
  );
}
