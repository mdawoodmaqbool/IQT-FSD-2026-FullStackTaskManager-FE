"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useSnackbar } from "@/context/SnackbarContext";
import { formatDate, STATUS_LABELS, STATUS_STYLES } from "@/lib/task-utils";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Task, TaskStatus } from "@/types/task";

type TaskItemProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    input: { title: string; description: string | null },
  ) => Promise<void>;
};

const STATUS_OPTIONS: TaskStatus[] = ["pending", "in_progress", "completed"];

export function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onUpdate,
}: TaskItemProps) {
  const { showSuccess, showError } = useSnackbar();
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setBusy(true);

    try {
      await onUpdate(task.id, {
        title: trimmedTitle,
        description: description.trim() || null,
      });
      setEditing(false);
      showSuccess("Task updated successfully.");
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);

    try {
      await onDelete(task.id);
      setConfirmOpen(false);
      showSuccess("Task deleted successfully.");
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleStatusChange(status: TaskStatus) {
    if (status === task.status) {
      return;
    }

    setBusy(true);

    try {
      await onStatusChange(task.id, status);
      showSuccess("Task status updated.");
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[task.status]}`}
          >
            {STATUS_LABELS[task.status]}
          </span>

          <select
            value={task.status}
            disabled={busy || editing}
            onChange={(event) => void handleStatusChange(event.target.value as TaskStatus)}
            aria-label={`Update status for ${task.title}`}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        {editing ? (
          <div className="mt-3 space-y-3">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={500}
              className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={busy || !title.trim()}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-400"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle(task.title);
                  setDescription(task.description ?? "");
                  setEditing(false);
                }}
                disabled={busy}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="mt-3 text-base font-semibold text-slate-900">{task.title}</h3>
            {task.description ? (
              <p className="mt-1 text-sm text-slate-600">{task.description}</p>
            ) : null}
            <p className="mt-3 text-xs text-slate-400">Updated {formatDate(task.updatedAt)}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                disabled={busy}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                disabled={busy}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </article>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete task?"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={busy}
        onCancel={() => {
          if (!busy) {
            setConfirmOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
