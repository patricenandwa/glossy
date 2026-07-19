"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "firebase/auth";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { onAuthStateChange, sendVerificationEmail, signOut } from "@/lib/auth";
import { syncSession } from "@/lib/auth/session";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      }
    });

    return () => unsubscribe();
  }, [redirectTo, router]);

  const footer = useMemo(
    () => (
      <div className="flex flex-col items-center gap-3 text-sm text-zinc-600 sm:flex-row sm:justify-between">
        <span>Using the wrong email address?</span>
        <Button
          type="button"
          variant="ghost"
          onClick={async () => {
            await handleLogout();
          }}
          className="h-auto p-0 font-medium text-charcoal hover:bg-transparent"
        >
          Log out and try again
        </Button>
      </div>
    ),
    [],
  );

  const handleResend = async () => {
    if (!user) {
      setError("You need to sign in again before requesting another verification email.");
      return;
    }

    setResending(true);
    setMessage("");
    setError("");

    try {
      await sendVerificationEmail(user);
      setMessage("A fresh verification link is on its way. Check inbox, promotions, and spam.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!user) {
      setError("Your session expired. Please sign in again.");
      return;
    }

    setChecking(true);
    setMessage("");
    setError("");

    try {
      await user.reload();
      const refreshedUser = user;

      if (!refreshedUser.emailVerified) {
        setMessage("Your email is not verified yet. Open the email link first, then check again.");
        return;
      }

      await syncSession(refreshedUser, refreshedUser.providerData.some((entry) => entry.providerId.includes("google")) ? "google" : "email");
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to confirm verification right now.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      await fetch("/api/v1/session", { method: "DELETE" });
      router.replace(`/login?redirect=${encodeURIComponent(redirectTo)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log out right now.");
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center bg-soft-pink">
          <LoadingSpinner size="lg" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <AuthShell
        eyebrow="Verify email"
        title="Check your inbox before you continue"
        description="For email-password accounts, we need to confirm your address before opening the rest of the dashboard."
        footer={footer}
      >
        <div className="space-y-5">
          <div className="rounded-[28px] bg-soft-pink p-5 ring-1 ring-black/[0.04]">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-charcoal ring-1 ring-black/[0.05]">
                <MailIcon />
              </div>
              <div>
                <p className="font-medium text-charcoal">
                  {user?.email || "Your email address"}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Open the verification message, click the link, then come back here to confirm.
                </p>
              </div>
            </div>
          </div>

          {message ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking || resending}
              className="h-12 w-full rounded-full bg-charcoal text-white hover:bg-charcoal/90"
            >
              {checking ? <LoadingSpinner size="sm" /> : "I have verified my email"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={resending || checking}
              className="h-12 w-full rounded-full border-black/[0.08] bg-white text-charcoal hover:bg-blush"
            >
              {resending ? <LoadingSpinner size="sm" /> : "Resend verification email"}
            </Button>
          </div>

          <p className="text-center text-sm text-zinc-500">
            Need help instead?{" "}
            <Link href="/contact" className="font-medium text-charcoal underline underline-offset-4">
              Contact the studio
            </Link>
          </p>
        </div>
      </AuthShell>
    </PageTransition>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
