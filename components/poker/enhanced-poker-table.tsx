"use client";

import { Badge } from "@/components/ui/badge";
import { Card as CardType, Player } from "@/lib/poker-engine";
import { PlayerHand } from "./poker-cards";

interface EnhancedPokerTableProps {
    players: Player[];
    activePlayerIndex: number;
    dealerPosition: number;
    communityCards: CardType[];
    pot: number;
    currentBet: number;
    className?: string;
}

export function EnhancedPokerTable({
    players,
    activePlayerIndex,
    dealerPosition,
    communityCards,
    pot,
    currentBet,
    className = "",
}: EnhancedPokerTableProps) {
    // Posições dos jogadores bem afastadas da mesa (mais para fora)
    const tablePositions = [
        { x: 50, y: -5 }, // Top center - mais para fora
        { x: 90, y: 2 }, // Top right - mais para fora
        { x: 105, y: 50 }, // Right - bem para fora
        { x: 90, y: 98 }, // Bottom right - mais para fora
        { x: 50, y: 105 }, // Bottom center - mais para fora
        { x: 10, y: 98 }, // Bottom left - mais para fora
        { x: -5, y: 50 }, // Left - bem para fora
        { x: 10, y: 2 }, // Top left - mais para fora
        { x: 50, y: 15 }, // Center-top (para 9º jogador)
    ];

    const getPlayerAtPosition = (position: number) => {
        return players.find((p) => p.position === position);
    };

    return (
        <div
            className={`relative w-full aspect-[4/3] max-w-5xl mx-auto ${className}`}
        >
            {/* Mesa de poker (formato oval) - Maior para acomodar melhor */}
            <div className="absolute inset-16 poker-table-enhanced poker-felt rounded-full shadow-2xl">
                {/* Felt texture */}
                <div className="absolute inset-4 bg-green-700 rounded-full opacity-30"></div>
                <div className="absolute inset-6 border-2 border-yellow-500 rounded-full opacity-40"></div>

                {/* Área central com pot e cartas comunitárias */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    {/* Pot no centro */}
                    <div className="mb-6">
                        <div className="pot-enhanced bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-3 rounded-full shadow-lg relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur-sm opacity-70"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-sm font-bold">💰 POT</div>
                                <div className="text-xl font-black">
                                    ${pot.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cartas comunitárias no centro */}
                    <div className="community-cards-container">
                        {Array.from({ length: 5 }).map((_, index) => {
                            const card = communityCards[index];
                            return (
                                <div key={index} className="w-12 h-16">
                                    {card ? (
                                        <div className="community-card text-sm font-bold flex flex-col items-center justify-between p-2 h-full">
                                            <span
                                                className={
                                                    card.suit === "♥" ||
                                                    card.suit === "♦"
                                                        ? "text-red-600"
                                                        : "text-black"
                                                }
                                            >
                                                {card.rank}
                                            </span>
                                            <span
                                                className={`text-lg ${
                                                    card.suit === "♥" ||
                                                    card.suit === "♦"
                                                        ? "text-red-600"
                                                        : "text-black"
                                                }`}
                                            >
                                                {card.suit}
                                            </span>
                                            <span
                                                className={`transform rotate-180 text-xs ${
                                                    card.suit === "♥" ||
                                                    card.suit === "♦"
                                                        ? "text-red-600"
                                                        : "text-black"
                                                }`}
                                            >
                                                {card.rank}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg bg-gray-100/20 flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">
                                                ?
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Aposta atual */}
                    {currentBet > 0 && (
                        <div className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded text-xs border border-pink-500/50 mt-4">
                            Aposta: ${currentBet}
                        </div>
                    )}
                </div>
            </div>

            {/* Posições dos jogadores */}
            {tablePositions.map((pos, index) => {
                const player = getPlayerAtPosition(index);
                if (!player) return null;

                const isActive = index === activePlayerIndex;
                const isDealer = index === dealerPosition;

                return (
                    <div
                        key={player.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                        }}
                    >
                        <div
                            className={`
                            bg-gradient-to-br from-gray-800 to-gray-900
                            border-2 rounded-lg p-2 min-w-[100px] max-w-[120px]
                            shadow-lg
                            ${
                                isActive
                                    ? "border-neon-cyan ring-2 ring-neon-cyan glow-cyan animate-pulse"
                                    : player.isFolded
                                    ? "border-gray-600 opacity-60"
                                    : "border-gray-500"
                            }
                            ${player.isAllIn ? "ring-2 ring-purple-500" : ""}
                        `}
                        >
                            {/* Player Info */}
                            <div className="text-center mb-1">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <span className="text-sm">
                                        {player.avatar || "👤"}
                                    </span>
                                    {isDealer && (
                                        <div className="w-5 h-5 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">
                                            D
                                        </div>
                                    )}
                                </div>
                                <div className="text-white text-xs font-semibold truncate">
                                    {player.name}
                                </div>
                                <div className="text-neon-green text-xs">
                                    ${player.chips.toLocaleString()}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 justify-center mb-1">
                                {player.isSmallBlind && (
                                    <Badge className="bg-blue-500 text-xs px-1 py-0">
                                        SB
                                    </Badge>
                                )}
                                {player.isBigBlind && (
                                    <Badge className="bg-red-500 text-xs px-1 py-0">
                                        BB
                                    </Badge>
                                )}
                                {player.isFolded && (
                                    <Badge className="bg-gray-500 text-xs px-1 py-0">
                                        Fold
                                    </Badge>
                                )}
                                {player.isAllIn && (
                                    <Badge className="bg-purple-500 text-xs px-1 py-0">
                                        All-in
                                    </Badge>
                                )}
                            </div>

                            {/* Player Cards - Fora da mesa */}
                            <div className="flex justify-center mb-1">
                                <PlayerHand
                                    cards={player.cards}
                                    isRevealed={
                                        isActive &&
                                        !player.id.startsWith("bot_")
                                    }
                                    size="sm"
                                />
                            </div>

                            {/* Current Bet */}
                            {player.currentBet > 0 && (
                                <div className="text-center">
                                    <div className="bg-neon-pink/20 text-neon-pink px-1 py-0.5 rounded text-xs">
                                        ${player.currentBet}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Active Player Indicator */}
                        {isActive && (
                            <div className="absolute -top-2 -right-2 w-3 h-3 bg-neon-cyan rounded-full animate-ping"></div>
                        )}

                        {/* Dealer Button */}
                        {isDealer && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-xs font-bold shadow-lg border border-yellow-300">
                                    D
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Empty Seats */}
            {tablePositions.map((pos, index) => {
                const player = getPlayerAtPosition(index);
                if (player) return null;

                return (
                    <div
                        key={`empty-${index}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-5"
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                        }}
                    >
                        <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded-full bg-gray-800/20 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">+</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
