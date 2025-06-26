"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatChips, formatTime, Tournament } from "@/lib/tournament";
import {
    Award,
    BarChart3,
    DollarSign,
    Target,
    Timer,
    Users,
} from "lucide-react";

interface TournamentStatsProps {
    tournament: Tournament;
}

export default function TournamentStats({ tournament }: TournamentStatsProps) {
    const activePlayers =
        tournament.players?.filter((p) => !p.isEliminated) || [];
    const eliminatedPlayers =
        tournament.players?.filter((p) => p.isEliminated) || [];

    const totalChips =
        tournament.players?.reduce((sum, p) => sum + p.chipCount, 0) || 0;
    const averageStack =
        activePlayers.length > 0 ? totalChips / activePlayers.length : 0;
    const bigStack =
        activePlayers.length > 0
            ? Math.max(...activePlayers.map((p) => p.chipCount))
            : 0;
    const shortStack =
        activePlayers.length > 0
            ? Math.min(...activePlayers.map((p) => p.chipCount))
            : 0;

    const currentLevel = tournament.blindLevels[tournament.currentLevel];
    const nextLevel = tournament.blindLevels[tournament.currentLevel + 1];

    const eliminationRate =
        tournament.registeredPlayers.length > 0
            ? (eliminatedPlayers.length / tournament.registeredPlayers.length) *
              100
            : 0;

    const timeElapsed = currentLevel
        ? tournament.currentLevel *
              (tournament.blindLevels[0]?.duration * 60 || 1200) +
          (currentLevel.duration * 60 - tournament.timeRemaining)
        : 0;

    const estimatedTimeRemaining =
        activePlayers.length > 1
            ? Math.max(30, (activePlayers.length - 1) * 15) // Rough estimate: 15 mins per elimination
            : 0;

    return (
        <Card className="poker-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Tournament Statistics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Player Statistics */}
                <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        Player Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Remaining:
                                </span>
                                <Badge className="text-xs" variant="secondary">
                                    {activePlayers.length}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Eliminated:
                                </span>
                                <Badge
                                    className="text-xs"
                                    variant="destructive"
                                >
                                    {eliminatedPlayers.length}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Elimination Rate:
                                </span>
                                <span className="font-medium">
                                    {eliminationRate.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Field Size:
                                </span>
                                <span className="font-medium">
                                    {tournament.registeredPlayers.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chip Statistics */}
                {activePlayers.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            Chip Distribution
                        </h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Average Stack:
                                </span>
                                <span className="font-medium">
                                    {formatChips(Math.round(averageStack))}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Chip Leader:
                                </span>
                                <span className="font-medium text-green-600">
                                    {formatChips(bigStack)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Short Stack:
                                </span>
                                <span className="font-medium text-red-600">
                                    {formatChips(shortStack)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Total in Play:
                                </span>
                                <span className="font-medium">
                                    {formatChips(totalChips)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blind Level Info */}
                <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        Blind Levels
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Current Level:
                            </span>
                            <Badge className="text-xs">
                                Level {tournament.currentLevel + 1}
                            </Badge>
                        </div>
                        {currentLevel && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Current Blinds:
                                </span>
                                <span className="font-medium">
                                    {currentLevel.smallBlind}/
                                    {currentLevel.bigBlind}
                                </span>
                            </div>
                        )}
                        {nextLevel && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Next Blinds:
                                </span>
                                <span className="font-medium text-blue-600">
                                    {nextLevel.smallBlind}/{nextLevel.bigBlind}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Time Remaining:
                            </span>
                            <span className="font-medium">
                                {formatTime(tournament.timeRemaining)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Time Statistics */}
                <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Timer className="h-4 w-4 text-indigo-600" />
                        Time Analysis
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Time Elapsed:
                            </span>
                            <span className="font-medium">
                                {formatTime(timeElapsed)}
                            </span>
                        </div>
                        {tournament.status === "running" &&
                            estimatedTimeRemaining > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                        Est. Remaining:
                                    </span>
                                    <span className="font-medium text-orange-600">
                                        ~{estimatedTimeRemaining} min
                                    </span>
                                </div>
                            )}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Avg Level Duration:
                            </span>
                            <span className="font-medium">
                                {tournament.blindLevels[0]?.duration || 20} min
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prize Information */}
                <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        Prize Pool
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Total Pool:
                            </span>
                            <span className="font-bold text-green-600">
                                ${tournament.prizePool.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Buy-in:
                            </span>
                            <span className="font-medium">
                                ${tournament.buyIn}
                            </span>
                        </div>
                        {activePlayers.length <= 3 &&
                            activePlayers.length > 0 && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="text-xs text-yellow-800 font-medium">
                                        🏆 Final Table Alert!
                                    </div>
                                    <div className="text-xs text-yellow-700">
                                        Only {activePlayers.length} players
                                        remaining
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
