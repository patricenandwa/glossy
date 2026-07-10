"use client";

import { createContext, useContext } from "react";
import { SessionUser } from "@/lib/getUserFromSession";

interface AuthContextType {
    user: SessionUser | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({
    user,
    children
}: {
    user: SessionUser | null,
    children: React.ReactNode
}) {
    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}