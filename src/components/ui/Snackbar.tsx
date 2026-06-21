"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import type { SnackbarVariant } from "@/context/SnackbarContext";

type SnackbarProps = {
  message: string;
  variant: SnackbarVariant;
  onDismiss: () => void;
};

const variantStyles: Record<SnackbarVariant, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-red-200 bg-red-50 text-red-800",
};

export function Snackbar({ message, variant, onDismiss }: SnackbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[110] flex justify-center px-4"
    >
      <div
        className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg ${variantStyles[variant]}`}
      >
        <p className="flex-1 font-medium">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="rounded px-1 text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
