import { EmptyState } from "@/components/EmptyState";
import { TaskItem } from "@/components/TaskItem";
import type { Task, TaskStatus } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  filterLabel: string;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    input: { title: string; description: string | null },
  ) => Promise<void>;
};

export function TaskList({
  tasks,
  filterLabel,
  onStatusChange,
  onDelete,
  onUpdate,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState filterLabel={filterLabel} />;
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </li>
      ))}
    </ul>
  );
}
