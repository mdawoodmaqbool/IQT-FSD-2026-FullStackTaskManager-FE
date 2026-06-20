"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, taskApi } from "@/lib/api";
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@/types/task";

type UseTasksResult = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    taskApi
      .getAll()
      .then((data) => {
        if (active) {
          setTasks(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const createTask = useCallback(async (input: CreateTaskInput) => {
    setError(null);

    try {
      const task = await taskApi.create(input);
      setTasks((current) => [task, ...current]);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    setError(null);

    try {
      const updated = await taskApi.update(id, input);
      setTasks((current) =>
        current.map((task) => (task.id === id ? updated : task)),
      );
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setError(null);

    try {
      await taskApi.remove(id);
      setTasks((current) => current.filter((task) => task.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const setTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      await updateTask(id, { status });
    },
    [updateTask],
  );

  return {
    tasks,
    loading,
    error,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    setTaskStatus,
  };
}
