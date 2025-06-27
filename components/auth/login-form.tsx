"use client";

import { FadeIn } from "@/components/ui/animations";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { NeonButton, NeonCard, NeonText } from "@/components/ui/neon";
import { useAuth } from "@/hooks/use-auth";
import { Chrome, Facebook, Github, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
    const { auth, login, loginDirect } = useAuth();
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

    const handleLogin = async (provider: "google" | "facebook" | "github") => {
        setLoadingProvider(provider);
        await login(provider);
        setLoadingProvider(null);
    };

    const handleDevLogin = () => {
        // Bypass login for development
        const fakeUser = {
            id: "dev-user-123",
            name: "Dev User",
            email: "dev@example.com",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
            provider: "google" as const,
        };

        loginDirect(fakeUser);
    };

    const providers = [
        { name: "google", label: "Continue with Google", icon: Chrome },
        { name: "facebook", label: "Continue with Facebook", icon: Facebook },
        { name: "github", label: "Continue with GitHub", icon: Github },
    ] as const;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <FadeIn>
                <NeonCard className="w-full max-w-md mx-4">
                    <CardHeader className="text-center">
                        <NeonText
                            color="pink"
                            className="text-4xl font-bold mb-2"
                        >
                            🃏 PokerPro
                        </NeonText>
                        <CardDescription className="text-gray-300">
                            Sign in to manage and join poker tournaments
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {providers.map(({ name, label, icon: Icon }) => (
                            <NeonButton
                                key={name}
                                variant="primary"
                                className="w-full h-12"
                                onClick={() => handleLogin(name)}
                                disabled={auth.isLoading}
                            >
                                {loadingProvider === name ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Icon className="mr-2 h-4 w-4" />
                                )}
                                {label}
                            </NeonButton>
                        ))}

                        {/* Dev Login Button - Remove in production */}
                        {process.env.NODE_ENV === "development" && (
                            <NeonButton
                                variant="danger"
                                className="w-full h-12"
                                onClick={handleDevLogin}
                                disabled={auth.isLoading}
                            >
                                🚀 Dev Login (Bypass)
                            </NeonButton>
                        )}

                        {auth.error && (
                            <div className="text-sm text-red-400 text-center animate-pulse">
                                {auth.error}
                            </div>
                        )}
                    </CardContent>
                </NeonCard>
            </FadeIn>
        </div>
    );
}
