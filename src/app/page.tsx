import Link from "next/link";
import { SiteHeader } from "@/components/auth/AuthGuard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Manage your tasks with clarity
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          TaskManager helps you create, track, and complete work with a secure account,
          email verification, and a simple dashboard.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
        <div className="mt-16 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="font-semibold text-slate-900">Secure auth</h2>
            <p className="mt-1 text-sm text-slate-600">
              Sign up with email, verify OTP, and sign in with JWT protection.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="font-semibold text-slate-900">Task tracking</h2>
            <p className="mt-1 text-sm text-slate-600">
              Create tasks, update status, and filter by pending or completed work.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="font-semibold text-slate-900">Fast UI</h2>
            <p className="mt-1 text-sm text-slate-600">
              GraphQL and Apollo cache keep the dashboard responsive.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
