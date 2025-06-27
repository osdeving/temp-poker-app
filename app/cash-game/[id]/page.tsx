"use client";

import Navbar from "@/components/layout/navbar";
import { NeonButton, NeonText, GlassCard } from "@/components/ui/glass";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CashGamePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <NeonButton
                    variant="secondary"
                    onClick={() => router.push("/cash-games")}
                    className="mb-8"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao Lobby
                </NeonButton>

                <GlassCard variant="emerald" className="text-center py-12">
                    <NeonText className="text-3xl font-bold mb-4">
                        🃏 Mesa de Poker Premium
                    </NeonText>
                    <p className="text-gray-400 mb-8">
                        Bem-vindo à mesa de poker com efeitos premium! Esta é a
                        página da mesa onde o jogo acontece.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        <GlassCard variant="crystal">
                            <div className="p-6 text-center">
                                <div className="text-4xl mb-3">🎰</div>
                                <NeonText className="text-lg font-bold mb-2">
                                    Efeitos Premium
                                </NeonText>
                                <p className="text-gray-400 text-sm">
                                    Mesa com neon, glass e shimmer effects
                                </p>
                            </div>
                        </GlassCard>

                        <GlassCard variant="emerald">
                            <div className="p-6 text-center">
                                <div className="text-4xl mb-3">🏆</div>
                                <NeonText
                                    color="green"
                                    className="text-lg font-bold mb-2"
                                >
                                    High-End Gaming
                                </NeonText>
                                <p className="text-gray-400 text-sm">
                                    Experiência de poker de alta qualidade
                                </p>
                            </div>
                        </GlassCard>

                        <GlassCard variant="crystal">
                            <div className="p-6 text-center">
                                <div className="text-4xl mb-3">✨</div>
                                <NeonText
                                    color="pink"
                                    className="text-lg font-bold mb-2"
                                >
                                    Ultra Modern
                                </NeonText>
                                <p className="text-gray-400 text-sm">
                                    Interface moderna e responsiva
                                </p>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="mt-12">
                        <NeonButton variant="success" size="lg">
                            🚀 Entrar no Jogo
                        </NeonButton>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
