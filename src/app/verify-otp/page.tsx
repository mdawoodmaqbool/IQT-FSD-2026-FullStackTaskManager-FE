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

export default function VerifyOtpPage() {
  const { verifyOtp, resendOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await verifyOtp(email.trim(), code.trim());
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const result = await resendOtp(email.trim(), "signup");
      setSuccess(result.message);
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
            title="Verify your email"
            subtitle="Enter the 6-digit code sent to your inbox"
            footer={
              <p className="text-slate-600">
                Wrong email? <AuthLink href="/signup">Go back to sign up</AuthLink>
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
                label="OTP code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
              />
              <SubmitButton loading={loading}>Verify email</SubmitButton>
              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={resending || !email.trim()}
                className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend code"}
              </button>
            </form>
          </AuthCard>
        </main>
      </div>
    </GuestGuard>
  );
}
