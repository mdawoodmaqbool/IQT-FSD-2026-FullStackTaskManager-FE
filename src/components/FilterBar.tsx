import type { TaskFilter } from "@/types/task";

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

type FilterBarProps = {
  active: TaskFilter;
  onChange: (filter: TaskFilter) => void;
  counts: Record<TaskFilter, number>;
};

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = active === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {filter.label}
            <span className="ml-1.5 text-xs opacity-80">({counts[filter.value]})</span>
          </button>
        );
      })}
    </div>
  );
}
