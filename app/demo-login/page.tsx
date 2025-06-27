"use client";

import QuickLogin from "@/components/auth/quick-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DemoLoginPage() {
    const { loginDirect, auth } = useAuth();
    const router = useRouter();

    const handleLogin = (user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    }) => {
        loginDirect({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            provider: "github", // Demo provider
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/")}
                            className="mb-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Voltar
                        </Button>

                        <Card className="neon-card bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
                            <CardHeader>
                                <CardTitle className="text-2xl text-center text-neon-cyan">
                                    🎮 Demo Mode - Login Rápido
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-center text-gray-300">
                                    Escolha um jogador para testar o sistema ou
                                    crie seu próprio!
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Login Component */}
                    <QuickLogin onLogin={handleLogin} currentUser={auth.user} />

                    {/* Navigation */}
                    {auth.user && (
                        <div className="mt-8 text-center space-y-4">
                            <Card className="neon-card">
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-white mb-4">
                                        Onde você quer ir?
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button
                                            onClick={() =>
                                                router.push("/dashboard")
                                            }
                                            className="neon-button flex-1"
                                        >
                                            🏆 Torneios
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                router.push("/cash-games")
                                            }
                                            className="neon-button flex-1"
                                        >
                                            🎮 Cash Games
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
