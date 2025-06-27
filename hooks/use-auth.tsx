"use client";

import { AuthState, logout, socialLogin, User } from "@/lib/auth";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
    auth: AuthState;
    login: (provider: "google" | "facebook" | "github") => Promise<void>;
    loginDirect: (user: User) => void;
    logout: () => Promise<void>;
}>({
    auth: { user: null, isLoading: false, error: null },
    login: async () => {},
    loginDirect: () => {},
    logout: async () => {},
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        // Check for stored user session
        const storedUser = localStorage.getItem("poker-user");
        if (storedUser) {
            setAuth({
                user: JSON.parse(storedUser),
                isLoading: false,
                error: null,
            });
        } else {
            // Create a default user for demo purposes
            const defaultUser = {
                id: "demo-user-1",
                name: "Demo Player",
                email: "demo@poker.com",
                avatar: "👤",
                provider: "google" as const,
            };
            localStorage.setItem("poker-user", JSON.stringify(defaultUser));
            setAuth({
                user: defaultUser,
                isLoading: false,
                error: null,
            });
        }
    }, []);

    const login = async (provider: "google" | "facebook" | "github") => {
        setAuth((prev) => ({ ...prev, isLoading: true, error: null }));
        try {
            const user = await socialLogin(provider);
            localStorage.setItem("poker-user", JSON.stringify(user));
            setAuth({ user, isLoading: false, error: null });
        } catch (error) {
            setAuth((prev) => ({
                ...prev,
                isLoading: false,
                error: "Login failed. Please try again.",
            }));
        }
    };

    const loginDirect = (user: User) => {
        localStorage.setItem("poker-user", JSON.stringify(user));
        setAuth({ user, isLoading: false, error: null });
    };

    const handleLogout = async () => {
        setAuth((prev) => ({ ...prev, isLoading: true }));
        try {
            await logout();
            localStorage.removeItem("poker-user");
            setAuth({ user: null, isLoading: false, error: null });
        } catch (error) {
            setAuth((prev) => ({
                ...prev,
                isLoading: false,
                error: "Logout failed. Please try again.",
            }));
        }
    };

    const contextValue = {
        auth,
        login,
        loginDirect,
        logout: handleLogout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
