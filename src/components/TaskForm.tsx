"use client";

import { FormEvent, useState } from "react";

type TaskFormProps = {
  onSubmit: (input: { title: string; description: string }) => Promise<void>;
  onSuccess?: () => void;
  embedded?: boolean;
};

export function TaskForm({ onSubmit, onSuccess, embedded = false }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
      });
      setTitle("");
      setDescription("");
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? undefined
          : "rounded-lg border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md"
      }
    >
      {!embedded ? (
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          New Task
        </h2>
      ) : null}

      <div className={embedded ? "space-y-3" : "mt-3 space-y-3"}>
        <div>
          <label htmlFor="task-title" className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            maxLength={120}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional details"
            rows={3}
            maxLength={500}
            className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {submitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
