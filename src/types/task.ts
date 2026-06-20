export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskInput = {
  title: string;
  description?: string;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
};

export type TaskFilter = "all" | TaskStatus;
