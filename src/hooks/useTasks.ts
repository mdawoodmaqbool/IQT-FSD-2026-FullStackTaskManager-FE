"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useMemo } from "react";
import {
  CREATE_TASK,
  DELETE_TASK,
  GET_TASKS,
  GET_TASK_COUNTS,
  UPDATE_TASK,
} from "@/graphql/operations";
import type { CreateTaskInput, Task, TaskFilter, TaskStatus, UpdateTaskInput } from "@/types/task";

type UseTasksResult = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  counts: Record<TaskFilter, number>;
  refresh: () => Promise<void>;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function toGraphqlStatus(filter: TaskFilter): TaskStatus | undefined {
  return filter === "all" ? undefined : filter;
}

export function useTasks(filter: TaskFilter = "all"): UseTasksResult {
  const statusVariable = toGraphqlStatus(filter);

  const queryVariables = useMemo(
    () => ({
      status: statusVariable,
      limit: 100,
    }),
    [statusVariable],
  );

  const {
    data: tasksData,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery(GET_TASKS, {
    variables: queryVariables,
  });

  const { data: countsData, refetch: refetchCounts } = useQuery(GET_TASK_COUNTS);

  const refetchAll = useCallback(
    () => [GET_TASKS, GET_TASK_COUNTS],
    [],
  );

  const [createTaskMutation] = useMutation(CREATE_TASK, {
    refetchQueries: refetchAll,
  });

  const [updateTaskMutation] = useMutation(UPDATE_TASK, {
    refetchQueries: refetchAll,
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK, {
    refetchQueries: refetchAll,
  });

  const tasks = useMemo(() => tasksData?.tasks ?? [], [tasksData?.tasks]);

  const counts = useMemo(
    () => ({
      all: countsData?.taskCounts.all ?? 0,
      pending: countsData?.taskCounts.pending ?? 0,
      in_progress: countsData?.taskCounts.in_progress ?? 0,
      completed: countsData?.taskCounts.completed ?? 0,
    }),
    [countsData?.taskCounts],
  );

  const refresh = useCallback(async () => {
    await Promise.all([refetchTasks(), refetchCounts()]);
  }, [refetchCounts, refetchTasks]);

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      await createTaskMutation({
        variables: {
          title: input.title,
          description: input.description,
        },
        optimisticResponse: {
          createTask: {
            __typename: "Task",
            id: `temp-${Date.now()}`,
            title: input.title,
            description: input.description ?? null,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });
    },
    [createTaskMutation],
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskInput) => {
      await updateTaskMutation({
        variables: { id, ...input },
      });
    },
    [updateTaskMutation],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await deleteTaskMutation({
        variables: { id },
      });
    },
    [deleteTaskMutation],
  );

  const setTaskStatus = useCallback(
    async (id: string, status: TaskStatus) => {
      await updateTask(id, { status });
    },
    [updateTask],
  );

  return {
    tasks,
    loading: tasksLoading,
    error: tasksError ? getErrorMessage(tasksError) : null,
    counts,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    setTaskStatus,
  };
}
