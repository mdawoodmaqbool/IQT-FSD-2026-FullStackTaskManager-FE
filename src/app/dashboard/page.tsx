"use client";

import { TaskBoard } from "@/components/TaskBoard";
import { AuthGuard, SiteHeader } from "@/components/auth/AuthGuard";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100">
        <SiteHeader />
        <TaskBoard />
      </div>
    </AuthGuard>
  );
}
