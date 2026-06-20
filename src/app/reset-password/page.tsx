"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function ResetPasswordPage() {
  const { resetPassword, resendOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(email.trim(), code.trim(), password);
      setSuccess(result.message);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResending(true);

    try {
      await resendOtp(email.trim(), "reset_password");
      setSuccess("A new reset code has been sent if the account exists");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend code");
    } finally {
      setResending(false);
    }
  }

  return (
    <GuestGuard>
      <div className="min-h-screen bg-slate-100">
        <SiteHeader />
        <main className="flex justify-center px-4 py-12">
          <AuthCard
            title="Reset password"
            subtitle="Enter the code from your email and choose a new password"
            footer={
              <p className="text-slate-600">
                Back to <AuthLink href="/login">login</AuthLink>
              </p>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? <ErrorAlert message={error} /> : null}
              {success ? <SuccessAlert message={success} /> : null}
              <FormInput
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormInput
                label="Reset code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
              <FormInput
                label="New password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormInput
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <SubmitButton loading={loading}>Update password</SubmitButton>
              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={resending || !email.trim()}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend reset code"}
              </button>
            </form>
          </AuthCard>
        </main>
      </div>
    </GuestGuard>
  );
}
