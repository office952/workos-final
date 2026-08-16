import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  action?: ReactNode;
};

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{title}</p>
      {action}
    </div>
  );
}
