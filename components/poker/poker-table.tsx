"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
        const radiusX = 45; // Raio horizontal (mais largo)
        const radiusY = 30; // Raio vertical (mais estreito)
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
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Mesa de Poker */}
            <div className="relative bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-full aspect-video border-8 border-amber-600 shadow-2xl overflow-hidden">
                {/* Feltro da mesa com pattern */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-600 to-green-800 opacity-90"></div>

                {/* Logo/Nome do torneio no centro */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <h3 className="text-white font-bold text-lg mb-2 drop-shadow-lg">
                        {tournament.name}
                    </h3>

                    {/* Pot Central */}
                    <div className="bg-black/30 rounded-xl px-4 py-2 mb-4">
                        <div className="text-yellow-400 font-bold text-xl">
                            POT: ${pot.toLocaleString()}
                        </div>
                        {currentBet > 0 && (
                            <div className="text-white text-sm">
                                Current Bet: ${currentBet}
                            </div>
                        )}
                    </div>

                    {/* Cartas Comunitárias */}
                    <div className="flex justify-center gap-2">
                        {communityCards.map((card, index) => (
                            <div
                                key={index}
                                className="w-8 h-12 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold shadow-lg"
                            >
                                {card}
                            </div>
                        ))}
                        {/* Cartas vazias */}
                        {Array.from({ length: 5 - communityCards.length }).map(
                            (_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="w-8 h-12 bg-gray-400 rounded border-2 border-gray-500 shadow-lg opacity-50"
                                ></div>
                            )
                        )}
                    </div>
                </div>

                {/* Jogadores */}
                {players.map((player, index) => {
                    const position = getPlayerPosition(index, players.length);
                    const isCurrentPlayer = player.isActive && isPlayerTurn;

                    return (
                        <div
                            key={player.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                            }}
                        >
                            {/* Container do Jogador */}
                            <div
                                className={`relative ${
                                    isCurrentPlayer ? "animate-pulse" : ""
                                }`}
                            >
                                {/* Dealer Button */}
                                {player.isDealer && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                                        D
                                    </div>
                                )}

                                {/* Small/Big Blind Indicators */}
                                {player.isSmallBlind && (
                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white z-10">
                                        SB
                                    </div>
                                )}
                                {player.isBigBlind && (
                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white z-10">
                                        BB
                                    </div>
                                )}

                                {/* Avatar e Info do Jogador */}
                                <Card
                                    className={`neon-card w-32 ${
                                        isCurrentPlayer ? "glow-yellow" : ""
                                    }`}
                                >
                                    <CardContent className="p-2 text-center">
                                        <div className="w-12 h-12 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                                            {player.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="text-sm font-bold text-white truncate">
                                            {player.name}
                                        </div>
                                        <div className="text-xs text-neon-green font-bold">
                                            ${formatChips(player.chips)}
                                        </div>
                                        {player.currentBet > 0 && (
                                            <div className="text-xs text-yellow-400">
                                                Bet: ${player.currentBet}
                                            </div>
                                        )}
                                        {player.action && (
                                            <Badge
                                                className="text-xs mt-1"
                                                variant={
                                                    player.action === "fold"
                                                        ? "destructive"
                                                        : player.action ===
                                                          "all-in"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {player.action.toUpperCase()}
                                            </Badge>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Cartas do Jogador */}
                                {player.cards && (
                                    <div className="flex justify-center gap-1 mt-2">
                                        {player.cards.map((card, cardIndex) => (
                                            <div
                                                key={cardIndex}
                                                className="w-6 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-xs font-bold shadow"
                                            >
                                                {card}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Controles do Jogador (se for a vez dele) */}
            {isPlayerTurn && (
                <Card className="neon-card mt-4">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                            <Button
                                onClick={() => onPlayerAction("fold")}
                                variant="destructive"
                                size="sm"
                            >
                                Fold
                            </Button>
                            <Button
                                onClick={() => onPlayerAction("check")}
                                variant="outline"
                                size="sm"
                                disabled={currentBet > 0}
                            >
                                Check
                            </Button>
                            <Button
                                onClick={() => onPlayerAction("call")}
                                className="neon-button"
                                size="sm"
                                disabled={currentBet === 0}
                            >
                                Call ${currentBet}
                            </Button>
                            <Button
                                onClick={() =>
                                    onPlayerAction("raise", betAmount)
                                }
                                className="neon-button"
                                size="sm"
                            >
                                Raise
                            </Button>
                            <Button
                                onClick={() => onPlayerAction("all-in")}
                                variant="destructive"
                                size="sm"
                            >
                                All-In
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
