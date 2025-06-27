"use client";

import { Badge } from "@/components/ui/badge";
import { Player } from "@/lib/poker-engine";
import { ChipStack, PlayerHand } from "./poker-cards";

interface PokerTableProps {
    players: Player[];
    activePlayerIndex: number;
    dealerPosition: number;
    className?: string;
}

export function PokerTable({
    players,
    activePlayerIndex,
    dealerPosition,
    className = "",
}: PokerTableProps) {
    // Posições dos jogadores mais afastadas da mesa (para fora)
    const tablePositions = [
        { x: 50, y: 2 }, // Top center
        { x: 82, y: 12 }, // Top right
        { x: 95, y: 50 }, // Right
        { x: 82, y: 88 }, // Bottom right
        { x: 50, y: 98 }, // Bottom center
        { x: 18, y: 88 }, // Bottom left
        { x: 5, y: 50 }, // Left
        { x: 18, y: 12 }, // Top left
        { x: 50, y: 25 }, // Center-top (para 9º jogador)
    ];

    const getPlayerAtPosition = (position: number) => {
        return players.find((p) => p.position === position);
    };

    return (
        <div
            className={`relative w-full aspect-[4/3] max-w-4xl mx-auto ${className}`}
        >
            {/* Mesa de poker (formato oval) - Área central para pot e cartas comunitárias */}
            <div className="absolute inset-12 bg-gradient-to-br from-green-800 to-green-900 rounded-full border-8 border-yellow-600 shadow-2xl">
                {/* Felt texture */}
                <div className="absolute inset-4 bg-green-700 rounded-full opacity-50"></div>
                <div className="absolute inset-6 border-2 border-yellow-500 rounded-full opacity-30"></div>

                {/* Área central reservada para pot e cartas comunitárias */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-yellow-400 text-center opacity-10 select-none">
                        <div className="text-2xl font-bold">♠♥♦♣</div>
                        <div className="text-sm">POKER TABLE</div>
                    </div>
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
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                            isActive ? "z-20" : "z-10"
                        }`}
                        style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                        }}
                    >
                        {/* Player Card */}
                        <div
                            className={`
                            bg-gradient-to-br from-gray-800 to-gray-900
                            border-2 rounded-lg p-3 min-w-[120px]
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
                            <div className="text-center mb-2">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <span className="text-lg">
                                        {player.avatar || "👤"}
                                    </span>
                                    {isDealer && (
                                        <div className="w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs font-bold">
                                            D
                                        </div>
                                    )}
                                </div>
                                <div className="text-white text-sm font-semibold truncate">
                                    {player.name}
                                </div>
                                <div className="text-neon-green text-xs">
                                    ${player.chips.toLocaleString()}
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 justify-center mb-2">
                                {player.isSmallBlind && (
                                    <Badge className="bg-blue-500 text-xs">
                                        SB
                                    </Badge>
                                )}
                                {player.isBigBlind && (
                                    <Badge className="bg-red-500 text-xs">
                                        BB
                                    </Badge>
                                )}
                                {player.isFolded && (
                                    <Badge className="bg-gray-500 text-xs">
                                        Fold
                                    </Badge>
                                )}
                                {player.isAllIn && (
                                    <Badge className="bg-purple-500 text-xs">
                                        All-in
                                    </Badge>
                                )}
                            </div>

                            {/* Player Cards */}
                            <div className="flex justify-center mb-2">
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
                                    <div className="bg-neon-pink/20 text-neon-pink px-2 py-1 rounded text-xs">
                                        Bet: ${player.currentBet}
                                    </div>
                                </div>
                            )}

                            {/* Chip Stack Visualization */}
                            <div className="flex justify-center mt-2">
                                <ChipStack
                                    amount={player.chips}
                                    size="sm"
                                    animated={isActive}
                                />
                            </div>
                        </div>

                        {/* Active Player Indicator */}
                        {isActive && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-neon-cyan rounded-full animate-ping"></div>
                        )}

                        {/* Dealer Button */}
                        {isDealer && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-yellow-300">
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
                        <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full bg-gray-800/30 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Vazio</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface DealerButtonProps {
    position: { x: number; y: number };
    className?: string;
}

export function DealerButton({ position, className = "" }: DealerButtonProps) {
    return (
        <div
            className={`absolute w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-yellow-300 transform -translate-x-1/2 -translate-y-1/2 z-30 ${className}`}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
        >
            DEALER
        </div>
    );
}

interface ActionButtonsProps {
    availableActions: string[];
    onAction: (action: string, amount?: number) => void;
    currentBet: number;
    playerChips: number;
    bigBlind: number;
    className?: string;
}

export function ActionButtons({
    availableActions,
    onAction,
    currentBet,
    playerChips,
    bigBlind,
    className = "",
}: ActionButtonsProps) {
    return (
        <div className={`flex flex-wrap gap-2 justify-center ${className}`}>
            {availableActions.includes("fold") && (
                <button
                    onClick={() => onAction("fold")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Fold
                </button>
            )}

            {availableActions.includes("check") && (
                <button
                    onClick={() => onAction("check")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Check
                </button>
            )}

            {availableActions.includes("call") && (
                <button
                    onClick={() => onAction("call")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Call ${currentBet}
                </button>
            )}

            {availableActions.includes("raise") && (
                <button
                    onClick={() => onAction("raise", bigBlind * 2)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
                >
                    Raise ${bigBlind * 2}
                </button>
            )}

            {availableActions.includes("all-in") && (
                <button
                    onClick={() => onAction("all-in")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                    All-in (${playerChips})
                </button>
            )}
        </div>
    );
}
