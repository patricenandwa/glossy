import { userRoleEnum } from "@/lib/db/schema";

export type UserRole = "admin" | "user";

export interface SessionUser {
    uid: string;
    email: string | undefined;
    role: UserRole;
    emailVerified: boolean;
}