import type { TaskStatus } from "@/types/task";

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export const STATUS_STYLES: Record<TaskStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
};

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
