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
import { CountrySelect } from "@/components/external/CountrySelect";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/get-error-message";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!countryCode) {
      setError("Please select your country");
      return;
    }

    setLoading(true);

    try {
      await signup(email.trim(), password, countryCode);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <GuestGuard>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="flex justify-center px-4 py-12">
          <AuthCard
            title="Create account"
            subtitle="Sign up with your email, password, and country"
            footer={
              <p className="text-slate-600">
                Already have an account? <AuthLink href="/login">Login</AuthLink>
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
              <CountrySelect
                value={countryCode}
                onChange={setCountryCode}
                disabled={loading}
              />
              <FormInput
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormInput
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <SubmitButton loading={loading}>Sign up</SubmitButton>
            </form>
          </AuthCard>
        </main>
      </div>
    </GuestGuard>
  );
}
