"use client";

import type { User } from "firebase/auth";

export async function syncSession(user: User, provider: "email" | "google") {
  const idToken = await user.getIdToken(true);
  const response = await fetch("/api/v1/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken,
      firebaseId: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL,
      provider,
      emailVerified: user.emailVerified,
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error || "Failed to create session.");
  }

  return response.json();
}
