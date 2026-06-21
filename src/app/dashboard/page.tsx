"use client";

import { TaskBoard } from "@/components/TaskBoard";
import { AuthGuard, SiteHeader } from "@/components/auth/AuthGuard";
import { WeatherWidget } from "@/components/external/WeatherWidget";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-100">
        <SiteHeader />
        <div className="mx-auto max-w-3xl space-y-6 py-6">
          <WeatherWidget />
        </div>
        <TaskBoard />
      </div>
    </AuthGuard>
  );
}
