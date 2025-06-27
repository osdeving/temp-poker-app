"use client";

import { PlayingCard } from "@/components/poker/poker-cards";
import { Card } from "@/lib/poker-engine";

export default function TestCardsPage() {
    const testCards: Card[] = [
        { rank: "A", suit: "♥", value: "Ah" },
        { rank: "K", suit: "♠", value: "Ks" },
        { rank: "Q", suit: "♦", value: "Qd" },
        { rank: "J", suit: "♣", value: "Jc" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-8 text-black">
                Teste de Cartas Isoladas
            </h1>

            <div className="space-y-8">
                {/* Cards em fundo claro */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Cards em fundo claro:
                    </h2>
                    <div className="flex gap-4 p-4 bg-white rounded">
                        {testCards.map((card, index) => (
                            <PlayingCard
                                key={index}
                                card={card}
                                isHidden={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Cards em fundo escuro */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Cards em fundo escuro:
                    </h2>
                    <div className="flex gap-4 p-4 bg-gray-800 rounded">
                        {testCards.map((card, index) => (
                            <PlayingCard
                                key={index}
                                card={card}
                                isHidden={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Cards viradas para baixo */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Cards viradas para baixo:
                    </h2>
                    <div className="flex gap-4 p-4 bg-green-600 rounded">
                        {testCards.map((card, index) => (
                            <PlayingCard
                                key={index}
                                card={card}
                                isHidden={true}
                            />
                        ))}
                    </div>
                </div>

                {/* Cards em container com opacidade (para testar herança) */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Cards em container com opacidade 50%:
                    </h2>
                    <div className="flex gap-4 p-4 bg-blue-600 rounded opacity-50">
                        {testCards.map((card, index) => (
                            <PlayingCard
                                key={index}
                                card={card}
                                isHidden={false}
                            />
                        ))}
                    </div>
                </div>

                {/* Teste específico de cada tamanho */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Teste de tamanhos e espelhamento:
                    </h2>
                    <div className="space-y-4">
                        {/* Tamanho pequeno */}
                        <div className="flex gap-4 p-4 bg-white rounded">
                            <div className="text-black font-semibold">SM:</div>
                            <PlayingCard
                                card={{ rank: "A", suit: "♠", value: "As" }}
                                size="sm"
                            />
                            <PlayingCard
                                card={{ rank: "K", suit: "♥", value: "Kh" }}
                                size="sm"
                            />
                        </div>

                        {/* Tamanho médio */}
                        <div className="flex gap-4 p-4 bg-white rounded">
                            <div className="text-black font-semibold">MD:</div>
                            <PlayingCard
                                card={{ rank: "Q", suit: "♦", value: "Qd" }}
                                size="md"
                            />
                            <PlayingCard
                                card={{ rank: "J", suit: "♣", value: "Jc" }}
                                size="md"
                            />
                        </div>

                        {/* Tamanho grande */}
                        <div className="flex gap-4 p-4 bg-white rounded">
                            <div className="text-black font-semibold">LG:</div>
                            <PlayingCard
                                card={{ rank: "10", suit: "♠", value: "10s" }}
                                size="lg"
                            />
                            <PlayingCard
                                card={{ rank: "9", suit: "♥", value: "9h" }}
                                size="lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Teste com vários fundos para verificar transparência */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Teste de transparência em vários fundos:
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-red-500 rounded">
                            <div className="text-white mb-2">
                                Fundo Vermelho:
                            </div>
                            <PlayingCard
                                card={{ rank: "A", suit: "♠", value: "As" }}
                            />
                        </div>
                        <div className="p-4 bg-green-500 rounded">
                            <div className="text-white mb-2">Fundo Verde:</div>
                            <PlayingCard
                                card={{ rank: "K", suit: "♥", value: "Kh" }}
                            />
                        </div>
                        <div className="p-4 bg-blue-500 rounded">
                            <div className="text-white mb-2">Fundo Azul:</div>
                            <PlayingCard
                                card={{ rank: "Q", suit: "♦", value: "Qd" }}
                            />
                        </div>
                        <div className="p-4 bg-yellow-500 rounded">
                            <div className="text-black mb-2">
                                Fundo Amarelo:
                            </div>
                            <PlayingCard
                                card={{ rank: "J", suit: "♣", value: "Jc" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
