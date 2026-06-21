"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const isHome = pathname === "/";

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header
      className={
        isHome
          ? "border-b border-slate-200/80 bg-white/85"
          : "border-b border-slate-200/80 bg-white/80 backdrop-blur-md"
      }
    >
      <div
        className={`mx-auto flex items-center justify-between px-4 py-4 sm:px-6 ${
          isHome ? "max-w-5xl" : "max-w-[90rem]"
        }`}
      >
        <Link href="/" className="text-lg font-bold text-slate-900">
          TaskManager
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="hidden text-slate-600 sm:inline">{user?.email}</span>
              <Link href="/dashboard" className="font-medium text-slate-900 hover:underline">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="font-medium text-slate-900 hover:underline">
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
