"use client";

import { useState } from "react";
import { FilterBar } from "@/components/FilterBar";
import { TaskFormModal } from "@/components/TaskFormModal";
import { TaskList } from "@/components/TaskList";
import { WeatherWidget } from "@/components/external/WeatherWidget";
import { FilterIcon, PlusIcon, RefreshIcon } from "@/components/icons";
import { useSnackbar } from "@/context/SnackbarContext";
import { useTasks } from "@/hooks/useTasks";
import { getErrorMessage } from "@/lib/get-error-message";
import { STATUS_LABELS } from "@/lib/task-utils";
import type { TaskFilter } from "@/types/task";

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60";

export function TaskBoard() {
  const { showSuccess, showError } = useSnackbar();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
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

  async function handleCreateTask(input: { title: string; description: string }) {
    try {
      await createTask({
        title: input.title,
        description: input.description || undefined,
      });
      showSuccess("Task created successfully.");
    } catch (error) {
      showError(getErrorMessage(error));
      throw error;
    }
  }

  async function handleRefresh() {
    try {
      await refresh();
      showSuccess("Tasks refreshed.");
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[90rem] px-4 py-4 sm:px-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(260px,300px)_1fr_minmax(200px,240px)] lg:items-start">
          <aside className="space-y-3 sm:space-y-6">
            <header className="rounded-lg border border-slate-200/80 bg-white/75 p-3 shadow-sm backdrop-blur-md sm:p-4">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                TaskManager
              </h1>
              <p className="mt-1 hidden text-sm text-slate-600 sm:block">
                Create, update, and track tasks from one place.
              </p>
            </header>

            <WeatherWidget />
          </aside>

          <main className="min-w-0">
            <div className="rounded-lg border border-slate-200/80 bg-white/85 p-4 shadow-sm backdrop-blur-md sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Your Tasks</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {filterLabel} tasks · {tasks.length} shown
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen((open) => !open)}
                    aria-label="Toggle filters"
                    aria-expanded={mobileFilterOpen}
                    className={`${iconButtonClass} lg:hidden ${
                      mobileFilterOpen ? "border-slate-900 bg-slate-900 text-white" : ""
                    }`}
                  >
                    <FilterIcon />
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleRefresh()}
                    disabled={loading}
                    aria-label="Refresh tasks"
                    className={iconButtonClass}
                  >
                    <RefreshIcon className={loading ? "h-5 w-5 animate-spin" : "h-5 w-5"} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setTaskModalOpen(true)}
                    aria-label="Add new task"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-white transition-colors hover:bg-slate-800"
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>

              {mobileFilterOpen ? (
                <div className="mt-4 rounded-lg border border-slate-200/80 bg-white/75 p-4 backdrop-blur-md lg:hidden">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Filter
                  </h3>
                  <FilterBar
                    active={filter}
                    onChange={setFilter}
                    counts={counts}
                    variant="column"
                  />
                </div>
              ) : null}

              <div className="mt-4 space-y-4">
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
              </div>
            </div>
          </main>

          <aside className="hidden space-y-3 rounded-lg border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur-md lg:sticky lg:top-6 lg:block">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Filter
            </h2>
            <FilterBar active={filter} onChange={setFilter} counts={counts} variant="column" />
          </aside>
        </div>
      </div>

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  );
}
