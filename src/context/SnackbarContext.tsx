"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Snackbar } from "@/components/ui/Snackbar";

export type SnackbarVariant = "success" | "error";

type SnackbarMessage = {
  id: number;
  message: string;
  variant: SnackbarVariant;
};

type SnackbarContextValue = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<SnackbarMessage | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(0);

  const dismiss = useCallback(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }
    setActive(null);
  }, []);

  const show = useCallback(
    (message: string, variant: SnackbarVariant) => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }

      nextId.current += 1;
      setActive({ id: nextId.current, message, variant });

      dismissTimer.current = setTimeout(() => {
        setActive(null);
        dismissTimer.current = null;
      }, AUTO_DISMISS_MS);
    },
    [],
  );

  const showSuccess = useCallback((message: string) => show(message, "success"), [show]);
  const showError = useCallback((message: string) => show(message, "error"), [show]);

  const value = useMemo(
    () => ({
      showSuccess,
      showError,
    }),
    [showError, showSuccess],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {active ? (
        <Snackbar
          key={active.id}
          message={active.message}
          variant={active.variant}
          onDismiss={dismiss}
        />
      ) : null}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider");
  }

  return context;
}
