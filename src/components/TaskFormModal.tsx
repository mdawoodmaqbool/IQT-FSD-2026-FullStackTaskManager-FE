"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TaskForm } from "@/components/TaskForm";
import { CloseIcon } from "@/components/icons";

type TaskFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { title: string; description: string }) => Promise<void>;
};

export function TaskFormModal({ open, onClose, onSubmit }: TaskFormModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-title"
    >
      <button
        type="button"
        aria-label="Close new task dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="new-task-title" className="text-lg font-semibold text-slate-900">
            New Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          >
            <CloseIcon />
          </button>
        </div>

        <TaskForm embedded onSubmit={onSubmit} onSuccess={onClose} />
      </div>
    </div>,
    document.body,
  );
}
