"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthCard,
  AuthLink,
  ErrorAlert,
  FormInput,
  SubmitButton,
} from "@/components/auth/AuthForm";
import { GuestGuard, SiteHeader } from "@/components/auth/AuthGuard";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
  }

  return (
    <GuestGuard>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="flex justify-center px-4 py-12">
          <AuthCard
            title="Forgot password"
            subtitle="Enter your email to reset your password"
            footer={
              <p className="text-slate-600">
                Remembered it? <AuthLink href="/login">Back to login</AuthLink>
              </p>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? <ErrorAlert message={error} /> : null}
              <FormInput
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SubmitButton loading={false}>Continue</SubmitButton>
            </form>
          </AuthCard>
        </main>
      </div>
    </GuestGuard>
  );
}
