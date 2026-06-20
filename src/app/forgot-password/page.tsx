"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AuthCard,
  AuthLink,
  ErrorAlert,
  FormInput,
  SubmitButton,
  SuccessAlert,
} from "@/components/auth/AuthForm";
import { GuestGuard, SiteHeader } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await forgotPassword(email.trim());
      setSuccess(result.message);
      router.push(
        `/reset-password?email=${encodeURIComponent(result.email ?? email.trim())}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GuestGuard>
      <div className="min-h-screen bg-slate-100">
        <SiteHeader />
        <main className="flex justify-center px-4 py-12">
          <AuthCard
            title="Forgot password"
            subtitle="We will email you a reset code if the account exists"
            footer={
              <p className="text-slate-600">
                Remembered it? <AuthLink href="/login">Back to login</AuthLink>
              </p>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? <ErrorAlert message={error} /> : null}
              {success ? <SuccessAlert message={success} /> : null}
              <FormInput
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <SubmitButton loading={loading}>Send reset code</SubmitButton>
            </form>
          </AuthCard>
        </main>
      </div>
    </GuestGuard>
  );
}
