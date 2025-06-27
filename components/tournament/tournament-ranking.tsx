"use client";

import { Badge } from "@/components/ui/badge";
import { NeonButton, NeonText, UltraGlassCard } from "@/components/ui/neon";
import { formatChips, Tournament } from "@/lib/tournament";
import { Minus, TrendingDown, TrendingUp, Trophy, X } from "lucide-react";

interface TournamentRankingProps {
    tournament: Tournament;
    onEliminatePlayer?: (playerId: string) => void;
    onUpdateChips?: (playerId: string, chips: number) => void;
    isDirector?: boolean;
}

export default function TournamentRanking({
    tournament,
    onEliminatePlayer,
    onUpdateChips,
    isDirector = false,
}: TournamentRankingProps) {
    if (!tournament.players || tournament.players.length === 0) {
        return (
            <UltraGlassCard variant="crystal" className="text-center py-8">
                <NeonText className="text-xl font-bold flex items-center justify-center gap-2 mb-4">
                    <Trophy className="h-5 w-5" />
                    Tournament Ranking
                </NeonText>
                <p className="text-sm text-muted-foreground">
                    No players registered yet
                </p>
            </UltraGlassCard>
        );
    }

    const activePlayers = tournament.players.filter((p) => !p.isEliminated);
    const eliminatedPlayers = tournament.players
        .filter((p) => p.isEliminated)
        .sort((a, b) => (b.position || 0) - (a.position || 0));

    const rankedActivePlayers = activePlayers.sort(
        (a, b) => b.chipCount - a.chipCount
    );

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Trophy className="h-4 w-4 text-yellow-500" />;
            case 1:
                return <Trophy className="h-4 w-4 text-gray-400" />;
            case 2:
                return <Trophy className="h-4 w-4 text-amber-600" />;
            default:
                return (
                    <span className="text-sm font-bold w-4 text-center">
                        {index + 1}
                    </span>
                );
        }
    };

    const adjustChips = (
        playerId: string,
        currentChips: number,
        adjustment: number
    ) => {
        const newChips = Math.max(0, currentChips + adjustment);
        onUpdateChips?.(playerId, newChips);
    };

    return (
        <UltraGlassCard variant="crystal" className="space-y-4">
            <NeonText className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Tournament Ranking
            </NeonText>
            <div className="space-y-4">
                {/* Active Players */}
                {rankedActivePlayers.length > 0 && (
                    <div>
                        <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Active Players ({rankedActivePlayers.length})
                        </h4>
                        <div className="space-y-2">
                            {rankedActivePlayers.map((player, index) => (
                                <div
                                    key={player.id}
                                    className={`player-list-item flex items-center justify-between p-3 rounded-lg ${
                                        index === 0
                                            ? "border-2 border-yellow-400"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {getRankIcon(index)}
                                        <div>
                                            <span className="font-medium">
                                                {player.name}
                                            </span>
                                            <div className="text-sm text-muted-foreground">
                                                {formatChips(player.chipCount)}{" "}
                                                chips
                                            </div>
                                        </div>
                                    </div>

                                    {isDirector &&
                                        tournament.status === "running" && (
                                            <div className="flex items-center gap-1">
                                                <NeonButton
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        adjustChips(
                                                            player.id,
                                                            player.chipCount,
                                                            -1000
                                                        )
                                                    }
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </NeonButton>
                                                <NeonButton
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        adjustChips(
                                                            player.id,
                                                            player.chipCount,
                                                            1000
                                                        )
                                                    }
                                                    className="h-6 w-6 p-0"
                                                >
                                                    +
                                                </NeonButton>
                                                <NeonButton
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() =>
                                                        onEliminatePlayer?.(
                                                            player.id
                                                        )
                                                    }
                                                    className="h-6 w-6 p-0 ml-2"
                                                >
                                                    <X className="h-3 w-3" />
                                                </NeonButton>
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Eliminated Players */}
                {eliminatedPlayers.length > 0 && (
                    <div>
                        <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Eliminated ({eliminatedPlayers.length})
                        </h4>
                        <div className="space-y-2">
                            {eliminatedPlayers.map((player) => (
                                <div
                                    key={player.id}
                                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg opacity-75"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold w-4 text-center text-red-600">
                                            {player.position}
                                        </span>
                                        <div>
                                            <span className="font-medium text-red-800">
                                                {player.name}
                                            </span>
                                            <div className="text-sm text-red-600">
                                                Eliminated •{" "}
                                                {formatChips(player.chipCount)}{" "}
                                                chips
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="destructive"
                                        className="text-xs"
                                    >
                                        OUT
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tournament Stats */}
                <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">
                                Players Left:
                            </span>
                            <span className="font-bold ml-1 text-green-600">
                                {rankedActivePlayers.length}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">
                                Average Stack:
                            </span>
                            <span className="font-bold ml-1">
                                {rankedActivePlayers.length > 0
                                    ? formatChips(
                                          Math.round(
                                              rankedActivePlayers.reduce(
                                                  (sum, p) => sum + p.chipCount,
                                                  0
                                              ) / rankedActivePlayers.length
                                          )
                                      )
                                    : "0"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </UltraGlassCard>
    );
}
