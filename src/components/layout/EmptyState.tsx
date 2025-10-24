interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/40 p-10 text-center ${className ?? ""}`}
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
      {icon}
    </div>
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
    {action ? <div className="flex items-center gap-2">{action}</div> : null}
  </div>
);
