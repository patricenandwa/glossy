import { firebaseAdmin } from "./firebaseAdmin";
import { cookies } from "next/headers";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { SessionUser, UserRole } from "@/types";

export async function getUserFromSession(): Promise<SessionUser | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await firebaseAdmin
            .auth()
            .verifySessionCookie(sessionCookie, true);
        if (!decodedClaims.uid) {
            return null;
        }

        // Get user from Firebase
        const userRecord = await firebaseAdmin
            .auth()
            .getUser(decodedClaims.uid);

        // Fetch user role from database
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.firebaseUid, userRecord.uid))
            .limit(1);

        return {
            uid: userRecord.uid,
            email: userRecord.email,
            role: userResult[0]?.role ?? "user",
            emailVerified: userRecord.emailVerified,
        };
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return null;
    }
}



export const requireRole = async (allowedRoles: UserRole[]): Promise<SessionUser | null> => {
    const user = await getUserFromSession();
    if (!user) {
        return null;
    }
    if (!allowedRoles.includes(user.role as UserRole)) {
        return null;
    }
    return user;
}

export const requireAdmin = async (): Promise<SessionUser | null> => {
    return requireRole(["admin"]);
}

export const requireAgent = async (): Promise<SessionUser | null> => {
    return requireRole(["admin"]);
}
