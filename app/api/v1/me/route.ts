import { NextResponse } from "next/server";
import getUserFromSession from "@/lib/getUserFromSession";

export async function GET() {
  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      uid: user.uid,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json({ error: "Failed to get user info" }, { status: 500 });
  }
}
