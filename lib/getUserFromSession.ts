export interface SessionUser {
    uid: string;
    email: string | undefined;
    displayName: string | undefined;
    role: string;
    emailVerified: boolean;
}

export default async function getUserFromSession(): Promise<SessionUser | null> {

    return null;
}