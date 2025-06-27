"use client";

import { Badge } from "@/components/ui/badge";
import { Player } from "@/lib/poker-engine";
import { PlayerHand } from "./poker-cards";

interface PokerPlayerProps {
    player: Player;
    position: { x: number; y: number };
    isActive: boolean;
    isDealer: boolean;
    className?: string;
}

export function PokerPlayer({
    player,
    position,
    isActive,
    isDealer,
    className = "",
}: PokerPlayerProps) {
    return (
        <div
            className={`poker-player-container absolute transform -translate-x-1/2 -translate-y-1/2 z-10 ${className}`}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
        >
            <div
                className={`
                bg-gradient-to-br from-gray-800 to-gray-900
                border-2 rounded-lg p-2 min-w-[100px] max-w-[120px]
                shadow-lg
                relative
                ${
                    isActive
                        ? "border-neon-cyan ring-2 ring-neon-cyan"
                        : player.isFolded
                        ? "border-gray-600 opacity-60"
                        : "border-gray-500"
                }
                ${player.isAllIn ? "ring-2 ring-purple-500" : ""}
            `}
            >
                {/* Efeito de glow pulsante apenas na borda para jogador ativo */}
                {isActive && (
                    <div className="absolute inset-0 border-2 border-neon-cyan rounded-lg animate-pulse opacity-75 pointer-events-none"></div>
                )}
                {/* Player Info */}
                <div className="text-center mb-1">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-sm">{player.avatar || "👤"}</span>
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

                {/* Player Cards */}
                <div className="flex justify-center mb-1">
                    <PlayerHand
                        cards={player.cards}
                        isRevealed={isActive && !player.id.startsWith("bot_")}
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
}
