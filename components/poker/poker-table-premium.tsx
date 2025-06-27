"use client";

import { GlowPulse, HoverGlow } from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import {
    NeonButton,
    NeonInput,
    NeonText,
    GlassCard,
} from "@/components/ui/glass";
import { PokerCard, PokerChip } from "@/components/ui/poker";
import { Tournament } from "@/lib/tournament";
import { useState } from "react";

interface Player {
    id: string;
    name: string;
    chips: number;
    isDealer: boolean;
    isSmallBlind: boolean;
    isBigBlind: boolean;
    cards?: string[];
    currentBet: number;
    action?: "fold" | "call" | "raise" | "check" | "all-in";
    isActive: boolean;
    position: number;
}

interface PokerTableProps {
    tournament: Tournament;
    players: Player[];
    communityCards: string[];
    pot: number;
    currentBet: number;
    isPlayerTurn: boolean;
    onPlayerAction: (action: string, amount?: number) => void;
}

export default function PokerTable({
    tournament,
    players,
    communityCards,
    pot,
    currentBet,
    isPlayerTurn,
    onPlayerAction,
}: PokerTableProps) {
    const [betAmount, setBetAmount] = useState(0);

    // Posições da mesa (oval) para até 9 jogadores
    const getPlayerPosition = (position: number, totalPlayers: number) => {
        const angle = (position * 360) / totalPlayers - 90; // -90 para começar no topo
        const radiusX = 42; // Raio horizontal (mais largo)
        const radiusY = 28; // Raio vertical (mais estreito)
        const centerX = 50;
        const centerY = 50;

        const x = centerX + radiusX * Math.cos((angle * Math.PI) / 180);
        const y = centerY + radiusY * Math.sin((angle * Math.PI) / 180);

        return { x, y };
    };

    const formatChips = (chips: number) => {
        if (chips >= 1000000) return `${(chips / 1000000).toFixed(1)}M`;
        if (chips >= 1000) return `${(chips / 1000).toFixed(1)}K`;
        return chips.toString();
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto">
            {/* Mesa de Poker Premium com Efeitos Ultra Realistas */}
            <div className="relative poker-table-premium rounded-full aspect-video overflow-hidden">
                {/* Fundo da mesa com gradiente premium e shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 opacity-95">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite] -skew-x-12"></div>
                </div>

                {/* Borda externa neon com animação */}
                <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-cyan-400 via-pink-400 to-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)] animate-pulse"></div>

                {/* Rail interno dourado com reflexos */}
                <div className="absolute inset-6 rounded-full border-4 border-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                    {/* Reflexos metálicos */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[metal-shine_4s_ease-in-out_infinite]"></div>
                </div>

                {/* Feltro premium com textura e pattern */}
                <div className="absolute inset-10 rounded-full bg-gradient-to-br from-green-700 via-emerald-700 to-green-800 shadow-inner">
                    {/* Pattern do feltro premium */}
                    <div className="absolute inset-0 rounded-full opacity-20 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,255,0,0.1)_21%,_rgba(0,255,0,0.1)_40%,_transparent_41%)]"></div>
                    {/* Textura adicional */}
                    <div className="absolute inset-0 rounded-full opacity-10 bg-[conic-gradient(from_0deg,_rgba(255,255,255,0.1),_transparent_10%,_rgba(255,255,255,0.05)_20%,_transparent_30%)]"></div>
                </div>

                {/* Centro da mesa - Logo e Pot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
                    <GlowPulse>
                        <GlassCard variant="crystal" className="p-4 mb-4">
                            <NeonText className="text-lg font-bold mb-2">
                                🏆 {tournament.name}
                            </NeonText>

                            {/* Pot Central Premium */}
                            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl px-6 py-3 mb-4 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                                <div className="text-black font-bold text-2xl">
                                    ${pot.toLocaleString()}
                                </div>
                                <div className="text-black/70 text-sm font-semibold">
                                    💰 POT
                                </div>
                            </div>

                            {currentBet > 0 && (
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg px-4 py-2">
                                    <div className="text-white font-bold">
                                        BET: ${currentBet}
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </GlowPulse>

                    {/* Cartas Comunitárias Premium */}
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from({ length: 5 }).map((_, index) => {
                            const card = communityCards[index];
                            if (!card) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className="w-12 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center shadow-lg opacity-30"
                                    >
                                        <div className="text-gray-400 text-xs">
                                            ?
                                        </div>
                                    </div>
                                );
                            }

                            // Parse card string (e.g., "AS", "2H", "KD", "QC")
                            const suitChar = card.slice(-1).toLowerCase();
                            const rank = card.slice(0, -1);
                            const suitMap: Record<
                                string,
                                "hearts" | "diamonds" | "clubs" | "spades"
                            > = {
                                h: "hearts",
                                d: "diamonds",
                                c: "clubs",
                                s: "spades",
                            };

                            return (
                                <HoverGlow key={index}>
                                    <PokerCard
                                        suit={suitMap[suitChar] || "spades"}
                                        rank={rank}
                                        size="md"
                                        animate={true}
                                        className="shadow-[0_0_15px_rgba(255,255,255,0.3)] transform hover:scale-110 transition-transform duration-300"
                                    />
                                </HoverGlow>
                            );
                        })}
                    </div>
                </div>

                {/* Jogadores ao redor da mesa */}
                {players.map((player, index) => {
                    const position = getPlayerPosition(index, players.length);
                    const isActivePlayer = player.isActive;

                    return (
                        <div
                            key={player.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                            }}
                        >
                            <HoverGlow>
                                <GlassCard
                                    variant={
                                        isActivePlayer ? "emerald" : "crystal"
                                    }
                                    className={`p-3 min-w-[120px] text-center transition-all duration-300 ${
                                        isActivePlayer
                                            ? "shadow-[0_0_25px_rgba(16,185,129,0.6)] border-emerald-400"
                                            : ""
                                    }`}
                                >
                                    {/* Indicadores especiais */}
                                    <div className="flex justify-center gap-1 mb-2">
                                        {player.isDealer && (
                                            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold">
                                                D
                                            </Badge>
                                        )}
                                        {player.isSmallBlind && (
                                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold">
                                                SB
                                            </Badge>
                                        )}
                                        {player.isBigBlind && (
                                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold">
                                                BB
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Nome do jogador */}
                                    <NeonText
                                        className={`text-sm font-bold mb-1 ${
                                            isActivePlayer
                                                ? "text-emerald-400"
                                                : ""
                                        }`}
                                    >
                                        {player.name}
                                    </NeonText>

                                    {/* Chips com PokerChip component */}
                                    <div className="flex justify-center mb-2">
                                        <PokerChip
                                            value={player.chips}
                                            size="md"
                                        />
                                    </div>

                                    {/* Cartas do jogador */}
                                    <div className="flex justify-center gap-1 mb-2">
                                        {player.cards?.map(
                                            (card, cardIndex) => {
                                                if (card === "?") {
                                                    return (
                                                        <PokerCard
                                                            key={cardIndex}
                                                            faceDown={true}
                                                            size="sm"
                                                        />
                                                    );
                                                }

                                                // Parse card string (e.g., "AS", "2H", "KD", "QC")
                                                const suitChar = card
                                                    .slice(-1)
                                                    .toLowerCase();
                                                const rank = card.slice(0, -1);
                                                const suitMap: Record<
                                                    string,
                                                    | "hearts"
                                                    | "diamonds"
                                                    | "clubs"
                                                    | "spades"
                                                > = {
                                                    h: "hearts",
                                                    d: "diamonds",
                                                    c: "clubs",
                                                    s: "spades",
                                                };

                                                return (
                                                    <PokerCard
                                                        key={cardIndex}
                                                        suit={
                                                            suitMap[suitChar] ||
                                                            "spades"
                                                        }
                                                        rank={rank}
                                                        size="sm"
                                                    />
                                                );
                                            }
                                        ) || (
                                            <>
                                                <PokerCard
                                                    faceDown={true}
                                                    size="sm"
                                                />
                                                <PokerCard
                                                    faceDown={true}
                                                    size="sm"
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Aposta atual */}
                                    {player.currentBet > 0 && (
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded px-2 py-1">
                                            <div className="text-white text-xs font-bold">
                                                ${player.currentBet}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ação do jogador */}
                                    {player.action && (
                                        <Badge
                                            className={`mt-1 text-xs ${
                                                player.action === "fold"
                                                    ? "bg-red-500"
                                                    : player.action === "call"
                                                    ? "bg-blue-500"
                                                    : player.action === "raise"
                                                    ? "bg-green-500"
                                                    : player.action === "check"
                                                    ? "bg-gray-500"
                                                    : "bg-purple-500"
                                            }`}
                                        >
                                            {player.action.toUpperCase()}
                                        </Badge>
                                    )}
                                </GlassCard>
                            </HoverGlow>
                        </div>
                    );
                })}
            </div>

            {/* Controles de Ação do Jogador */}
            {isPlayerTurn && (
                <GlassCard variant="diamond" className="mt-6 p-6">
                    <NeonText className="text-lg font-bold mb-4 text-center">
                        🎮 Sua Vez - Escolha uma Ação
                    </NeonText>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <NeonButton
                            variant="danger"
                            onClick={() => onPlayerAction("fold")}
                            className="w-full"
                        >
                            Fold
                        </NeonButton>

                        <NeonButton
                            variant="secondary"
                            onClick={() => onPlayerAction("check")}
                            disabled={currentBet > 0}
                            className="w-full"
                        >
                            Check
                        </NeonButton>

                        <NeonButton
                            variant="primary"
                            onClick={() => onPlayerAction("call", currentBet)}
                            disabled={currentBet === 0}
                            className="w-full"
                        >
                            Call ${currentBet}
                        </NeonButton>

                        <NeonButton
                            variant="success"
                            onClick={() => onPlayerAction("raise", betAmount)}
                            className="w-full"
                        >
                            Raise
                        </NeonButton>

                        <NeonButton
                            variant="danger"
                            onClick={() => onPlayerAction("all-in")}
                            className="w-full bg-gradient-to-r from-red-600 to-red-800"
                        >
                            All-In
                        </NeonButton>
                    </div>

                    {/* Input de valor para raise */}
                    <div className="mt-4 flex justify-center">
                        <GlassCard variant="crystal" className="p-3">
                            <div className="flex items-center gap-3">
                                <NeonText className="text-sm font-semibold">
                                    💰 Raise Amount:
                                </NeonText>
                                <NeonInput
                                    type="number"
                                    value={betAmount.toString()}
                                    onChange={(e) =>
                                        setBetAmount(Number(e.target.value))
                                    }
                                    className="w-24 text-center"
                                    placeholder="$"
                                />
                            </div>
                        </GlassCard>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
