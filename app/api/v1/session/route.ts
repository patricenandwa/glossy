import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { firebaseAdmin } from "@/lib/auth/firebaseAdmin";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const COOKIE_NAME = "session";
const SESSION_DURATION_MS = 3 * 24 * 60 * 60 * 1000;

const sessionPayloadSchema = z.object({
  idToken: z.string().min(1, "Missing idToken"),
  firebaseId: z.string().min(1, "Missing firebaseId"),
  email: z.string().email().optional().nullable(),
  displayName: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  provider: z.enum(["email", "google"]).optional().default("email"),
  emailVerified: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const payload = sessionPayloadSchema.parse(await req.json());
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(payload.idToken);

    if (decodedToken.uid !== payload.firebaseId) {
      return NextResponse.json({ error: "Session user mismatch." }, { status: 401 });
    }

    const userRecord = await firebaseAdmin.auth().getUser(decodedToken.uid);
    const email = userRecord.email ?? payload.email ?? undefined;

    if (!email) {
      return NextResponse.json({ error: "Authenticated user is missing an email address." }, { status: 400 });
    }

    const sessionCookie = await firebaseAdmin.auth().createSessionCookie(payload.idToken, {
      expiresIn: SESSION_DURATION_MS,
    });

    const [user] = await db
      .insert(users)
      .values({
        firebaseUid: userRecord.uid,
        email,
        displayName: userRecord.displayName ?? payload.displayName ?? null,
        photoURL: userRecord.photoURL ?? payload.photoUrl ?? null,
        provider: payload.provider,
        emailVerified: userRecord.emailVerified,
      })
      .onConflictDoUpdate({
        target: users.firebaseUid,
        set: {
          email,
          displayName: userRecord.displayName ?? payload.displayName ?? null,
          photoURL: userRecord.photoURL ?? payload.photoUrl ?? null,
          provider: payload.provider,
          emailVerified: userRecord.emailVerified,
        },
      })
      .returning();

    const response = NextResponse.json({ ok: true, user });
    response.cookies.set(COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to create session", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid session payload." }, { status: 400 });
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create session" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
