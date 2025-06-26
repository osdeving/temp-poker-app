"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { Tournament, formatChips, formatTime } from "@/lib/tournament";
import { Clock, Pause, Play, SkipForward, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface TournamentClockProps {
    tournament: Tournament;
    onUpdateClock: (currentLevel: number, timeRemaining: number) => void;
    onUpdateStatus: (status: Tournament["status"]) => void;
    isDirector?: boolean;
}

export default function TournamentClock({
    tournament,
    onUpdateClock,
    onUpdateStatus,
    isDirector = false,
}: TournamentClockProps) {
    const [timeRemaining, setTimeRemaining] = useState(
        tournament.timeRemaining
    );
    const [currentLevel, setCurrentLevel] = useState(tournament.currentLevel);
    const [isRunning, setIsRunning] = useState(tournament.status === "running");
    const [warningTriggered, setWarningTriggered] = useState(false);
    const {
        notifyLevelUp,
        notifyTimeWarning,
        notifyTournamentStart,
        notifyTournamentEnd,
    } = useNotifications();

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTime = prev - 1;
                    onUpdateClock(currentLevel, newTime);

                    // Trigger warning at 2 minutes remaining
                    if (newTime === 120 && !warningTriggered) {
                        notifyTimeWarning(2);
                        setWarningTriggered(true);
                    }

                    if (newTime <= 0) {
                        // Move to next level
                        const nextLevel = currentLevel + 1;
                        if (nextLevel < tournament.blindLevels.length) {
                            setCurrentLevel(nextLevel);
                            const nextLevelTime =
                                tournament.blindLevels[nextLevel].duration * 60;
                            setTimeRemaining(nextLevelTime);
                            onUpdateClock(nextLevel, nextLevelTime);
                            setWarningTriggered(false);

                            // Notify level up
                            const nextBlindLevel =
                                tournament.blindLevels[nextLevel];
                            notifyLevelUp(
                                nextLevel,
                                nextBlindLevel.smallBlind,
                                nextBlindLevel.bigBlind
                            );

                            return nextLevelTime;
                        } else {
                            // Tournament finished
                            onUpdateStatus("finished");
                            setIsRunning(false);

                            // Find winner
                            const activePlayers =
                                tournament.players?.filter(
                                    (p) => !p.isEliminated
                                ) || [];
                            const winner =
                                activePlayers.length === 1
                                    ? activePlayers[0].name
                                    : undefined;
                            notifyTournamentEnd(winner);

                            return 0;
                        }
                    }

                    return newTime;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [
        isRunning,
        timeRemaining,
        currentLevel,
        tournament.blindLevels,
        tournament.players,
        onUpdateClock,
        onUpdateStatus,
        warningTriggered,
        notifyLevelUp,
        notifyTimeWarning,
        notifyTournamentEnd,
    ]);

    // Reset warning when level changes
    useEffect(() => {
        setWarningTriggered(false);
    }, [currentLevel]);

    const handlePlayPause = () => {
        const newStatus = isRunning ? "paused" : "running";
        setIsRunning(!isRunning);
        onUpdateStatus(newStatus);

        if (!isRunning && tournament.status === "upcoming") {
            notifyTournamentStart();
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < tournament.blindLevels.length - 1) {
            const nextLevel = currentLevel + 1;
            const nextLevelTime =
                tournament.blindLevels[nextLevel].duration * 60;
            setCurrentLevel(nextLevel);
            setTimeRemaining(nextLevelTime);
            onUpdateClock(nextLevel, nextLevelTime);
            setWarningTriggered(false);

            // Notify level up
            const nextBlindLevel = tournament.blindLevels[nextLevel];
            notifyLevelUp(
                nextLevel,
                nextBlindLevel.smallBlind,
                nextBlindLevel.bigBlind
            );
        }
    };

    const currentBlindLevel = tournament.blindLevels[currentLevel];
    const nextBlindLevel = tournament.blindLevels[currentLevel + 1];

    if (!currentBlindLevel) return null;

    return (
        <div className="space-y-6">
            {/* Main Clock Display */}
            <Card className="neon-card bg-gradient-to-br from-red-900/80 via-black/80 to-red-900/80 border-pink-500/30 text-white">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-sm text-gray-400 uppercase tracking-wider">
                        LEVEL {currentBlindLevel.level}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="text-5xl sm:text-6xl font-bold clock-display mb-4 text-neon-cyan">
                        {formatTime(timeRemaining)}
                    </div>
                    <div className="text-xl sm:text-2xl mb-4">
                        <span className="text-neon-green font-bold">
                            {formatChips(currentBlindLevel.smallBlind)}
                        </span>
                        <span className="text-white mx-2">/</span>
                        <span className="text-neon-green font-bold">
                            {formatChips(currentBlindLevel.bigBlind)}
                        </span>
                        {currentBlindLevel.ante && (
                            <>
                                <span className="text-white mx-2">•</span>
                                <span className="text-gray-400">
                                    Ante:{" "}
                                    <span className="text-yellow-400">
                                        {formatChips(currentBlindLevel.ante)}
                                    </span>
                                </span>
                            </>
                        )}
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-1 font-semibold glow-pink">
                        {tournament.registeredPlayers.length} Players
                    </Badge>
                </CardContent>
            </Card>

            {/* Tournament Controls */}
            {isDirector && (
                <Card className="neon-card bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 border-cyan-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-neon-cyan">
                            <Clock className="h-5 w-5" />
                            Tournament Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button
                                onClick={handlePlayPause}
                                className={`flex-1 font-semibold ${
                                    isRunning
                                        ? "bg-gradient-to-r from-red-500 to-pink-500 hover:glow-red text-white"
                                        : "neon-button bg-gradient-to-r from-green-500 to-cyan-500 hover:glow-green text-black"
                                }`}
                            >
                                {isRunning ? (
                                    <Pause className="h-4 w-4 mr-2" />
                                ) : (
                                    <Play className="h-4 w-4 mr-2" />
                                )}
                                {isRunning ? "Pause" : "Start"}
                            </Button>
                            <Button
                                onClick={handleNextLevel}
                                variant="outline"
                                disabled={
                                    currentLevel >=
                                    tournament.blindLevels.length - 1
                                }
                                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-400 disabled:opacity-50"
                            >
                                <SkipForward className="h-4 w-4 mr-2" />
                                Next Level
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Blind Structure */}
            <Card className="neon-card bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 border-pink-500/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-neon-pink">
                        <TrendingUp className="h-5 w-5" />
                        Blind Structure
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {tournament.blindLevels.map((level, index) => (
                            <div
                                key={level.level}
                                className={`flex justify-between items-center p-2 rounded transition-all duration-200 ${
                                    index === currentLevel
                                        ? "bg-gradient-to-r from-pink-500/30 to-cyan-500/30 border border-pink-400/50 text-white glow-pink"
                                        : index < currentLevel
                                        ? "bg-gray-800/50 text-gray-500"
                                        : "bg-gray-900/30 text-gray-300 hover:bg-gray-800/30"
                                }`}
                            >
                                <span className="font-medium">
                                    Level {level.level}
                                </span>
                                <span
                                    className={
                                        index === currentLevel
                                            ? "text-neon-green font-semibold"
                                            : ""
                                    }
                                >
                                    {formatChips(level.smallBlind)} /{" "}
                                    {formatChips(level.bigBlind)}
                                    {level.ante &&
                                        ` (${formatChips(level.ante)})`}
                                </span>
                                <span
                                    className={`text-sm ${
                                        index === currentLevel
                                            ? "text-neon-cyan"
                                            : ""
                                    }`}
                                >
                                    {level.duration}min
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Next Level Preview */}
            {nextBlindLevel && (
                <Card className="neon-card bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 border-cyan-500/30">
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-400 uppercase tracking-wider">
                            Next Level
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg">
                            <span className="font-semibold text-neon-cyan">
                                Level {nextBlindLevel.level}:
                            </span>
                            <span className="ml-2 text-white">
                                <span className="text-neon-green">
                                    {formatChips(nextBlindLevel.smallBlind)}
                                </span>{" "}
                                /{" "}
                                <span className="text-neon-green">
                                    {formatChips(nextBlindLevel.bigBlind)}
                                </span>
                                {nextBlindLevel.ante &&
                                    nextBlindLevel.ante > 0 && (
                                        <>
                                            {" ("}
                                            <span className="text-yellow-400">
                                                {formatChips(
                                                    nextBlindLevel.ante
                                                )}
                                            </span>
                                            {")"}
                                        </>
                                    )}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
