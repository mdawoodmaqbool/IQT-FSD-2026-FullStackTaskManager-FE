type EmptyStateProps = {
  filterLabel: string;
};

export function EmptyState({ filterLabel }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <p className="text-base font-medium text-slate-900">No tasks found</p>
      <p className="mt-1 text-sm text-slate-500">
        {filterLabel === "All"
          ? "Create your first task using the form above."
          : `No ${filterLabel.toLowerCase()} tasks yet.`}
      </p>
    </div>
  );
}
