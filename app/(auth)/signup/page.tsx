"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendVerificationEmail, signInWithGoogle, signUpWithEmail } from "@/lib/auth";
import { syncSession } from "@/lib/auth/session";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const footer = useMemo(
    () => (
      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-medium text-charcoal underline underline-offset-4">
          Sign in
        </Link>
      </p>
    ),
    [redirectTo],
  );

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const credential = await signUpWithEmail(email, password);
      await syncSession(credential.user, "email");
      await sendVerificationEmail(credential.user);
      router.push(`/verify-email?redirect=${encodeURIComponent(redirectTo)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const credential = await signInWithGoogle();
      await syncSession(credential.user, "google");
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create account"
      title="Join Glow & Go"
      description="Create an account to manage purchases, speed up checkout, and unlock your admin tools."
      footer={footer}
    >
      <div className="space-y-5">
        {error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-charcoal">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              className="h-12 rounded-2xl bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-charcoal">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
              className="h-12 rounded-2xl bg-white"
              required
            />
            <p className="text-xs text-zinc-500">Use at least 6 characters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-charcoal">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              disabled={loading}
              className="h-12 rounded-2xl bg-white"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-charcoal text-white hover:bg-charcoal/90"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Create account"}
          </Button>
        </form>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/[0.08]" />
          </div>
          <div className="relative mx-auto w-fit bg-white px-4 text-xs uppercase tracking-[0.24em] text-zinc-400">
            Or continue with
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={handleGoogleSignup}
          className="h-12 w-full rounded-full border-black/[0.08] bg-white text-charcoal hover:bg-blush"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <GoogleIcon />
              Google
            </>
          )}
        </Button>
      </div>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-soft-pink">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </PageTransition>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.03 5.03 0 0 1-2.21 3.31v2.77h3.57a10.94 10.94 0 0 0 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77a6.56 6.56 0 0 1-3.71 1.06c-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}
