"use client";

import { useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { STATUS_LABELS } from "@/lib/task-utils";
import type { TaskFilter } from "@/types/task";

export function TaskBoard() {
  const [filter, setFilter] = useState<TaskFilter>("all");
  const {
    tasks,
    loading,
    error,
    counts,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    setTaskStatus,
  } = useTasks(filter);

  const filterLabel = filter === "all" ? "All" : STATUS_LABELS[filter];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">TaskManager</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create, update, and track tasks from one place.
        </p>
      </header>

      <TaskForm
        onSubmit={async (input) => {
          await createTask({
            title: input.title,
            description: input.description || undefined,
          });
        }}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Your Tasks</h2>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        <FilterBar active={filter} onChange={setFilter} counts={counts} />

        {error ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="text-sm text-slate-500">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            filterLabel={filterLabel}
            onStatusChange={setTaskStatus}
            onDelete={deleteTask}
            onUpdate={(id, input) => updateTask(id, input)}
          />
        )}
      </section>
    </div>
  );
}
