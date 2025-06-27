"use client";

import { Badge } from "@/components/ui/badge";
import { NeonButton, NeonText, UltraGlassCard } from "@/components/ui/neon";
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

                    // Level up when time reaches 0
                    if (newTime <= 0) {
                        const nextLevel = currentLevel + 1;
                        if (nextLevel < tournament.blindLevels.length) {
                            setCurrentLevel(nextLevel);
                            setTimeRemaining(
                                tournament.blindLevels[nextLevel].duration * 60
                            );
                            setWarningTriggered(false);
                            notifyLevelUp(
                                nextLevel + 1,
                                nextLevel,
                                tournament.blindLevels[nextLevel].duration * 60
                            );
                        } else {
                            // Tournament should end
                            setIsRunning(false);
                            onUpdateStatus("finished");
                            notifyTournamentEnd();
                        }
                    }

                    return newTime > 0 ? newTime : 0;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [
        isRunning,
        timeRemaining,
        currentLevel,
        tournament.blindLevels,
        onUpdateClock,
        onUpdateStatus,
        notifyLevelUp,
        notifyTimeWarning,
        notifyTournamentEnd,
        warningTriggered,
    ]);

    // Sync with tournament state changes
    useEffect(() => {
        setTimeRemaining(tournament.timeRemaining);
        setCurrentLevel(tournament.currentLevel);
        setIsRunning(tournament.status === "running");
    }, [tournament.timeRemaining, tournament.currentLevel, tournament.status]);

    const handleStart = () => {
        setIsRunning(true);
        onUpdateStatus("running");
        notifyTournamentStart();
    };

    const handlePause = () => {
        setIsRunning(false);
        onUpdateStatus("paused");
    };

    const handleResume = () => {
        setIsRunning(true);
        onUpdateStatus("running");
    };

    const handleNextLevel = () => {
        if (currentLevel < tournament.blindLevels.length - 1) {
            const nextLevel = currentLevel + 1;
            setCurrentLevel(nextLevel);
            setTimeRemaining(tournament.blindLevels[nextLevel].duration * 60);
            setWarningTriggered(false);
            onUpdateClock(
                nextLevel,
                tournament.blindLevels[nextLevel].duration * 60
            );
            notifyLevelUp(
                nextLevel + 1,
                nextLevel,
                tournament.blindLevels[nextLevel].duration * 60
            );
        }
    };

    const currentBlindLevel = tournament.blindLevels[currentLevel];
    const nextBlindLevel = tournament.blindLevels[currentLevel + 1];

    if (!currentBlindLevel) return null;

    return (
        <div className="space-y-6">
            {/* Main Clock Display */}
            <UltraGlassCard variant="crystal" className="text-center py-8">
                <NeonText className="text-sm uppercase tracking-wider mb-4 opacity-70">
                    LEVEL {currentBlindLevel.level}
                </NeonText>
                <div className="text-5xl sm:text-6xl font-bold clock-display mb-4 text-neon-cyan glow-cyan">
                    {formatTime(timeRemaining)}
                </div>
                <div className="text-xl sm:text-2xl mb-4">
                    <span className="text-neon-green font-bold glow-green">
                        {formatChips(currentBlindLevel.smallBlind)}
                    </span>
                    <span className="text-white mx-2">/</span>
                    <span className="text-neon-green font-bold glow-green">
                        {formatChips(currentBlindLevel.bigBlind)}
                    </span>
                    {currentBlindLevel.ante && (
                        <>
                            <span className="text-white mx-2">•</span>
                            <span className="text-gray-400">
                                Ante:{" "}
                                <span className="text-yellow-400 glow-yellow">
                                    {formatChips(currentBlindLevel.ante)}
                                </span>
                            </span>
                        </>
                    )}
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-1 font-semibold glow-pink">
                    {tournament.registeredPlayers.length} Players
                </Badge>
            </UltraGlassCard>

            {/* Tournament Controls */}
            {isDirector && (
                <UltraGlassCard variant="crystal" className="space-y-4">
                    <NeonText className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Tournament Controls
                    </NeonText>

                    <div className="flex gap-2 justify-center">
                        {tournament.status === "upcoming" && (
                            <NeonButton
                                variant="success"
                                onClick={handleStart}
                                className="flex items-center gap-2"
                            >
                                <Play className="h-4 w-4" />
                                Start Tournament
                            </NeonButton>
                        )}

                        {tournament.status === "running" && (
                            <NeonButton
                                variant="secondary"
                                onClick={handlePause}
                                className="flex items-center gap-2"
                            >
                                <Pause className="h-4 w-4" />
                                Pause
                            </NeonButton>
                        )}

                        {tournament.status === "paused" && (
                            <NeonButton
                                variant="success"
                                onClick={handleResume}
                                className="flex items-center gap-2"
                            >
                                <Play className="h-4 w-4" />
                                Resume
                            </NeonButton>
                        )}

                        {(tournament.status === "running" ||
                            tournament.status === "paused") &&
                            currentLevel <
                                tournament.blindLevels.length - 1 && (
                                <NeonButton
                                    variant="primary"
                                    onClick={handleNextLevel}
                                    className="flex items-center gap-2"
                                >
                                    <SkipForward className="h-4 w-4" />
                                    Next Level
                                </NeonButton>
                            )}
                    </div>
                </UltraGlassCard>
            )}

            {/* Next Level Info */}
            {nextBlindLevel && (
                <UltraGlassCard variant="diamond" className="space-y-4">
                    <NeonText className="text-sm uppercase tracking-wider opacity-70">
                        NEXT LEVEL ({nextBlindLevel.level})
                    </NeonText>
                    <div className="text-center">
                        <div className="text-lg font-bold text-neon-pink">
                            {formatChips(nextBlindLevel.smallBlind)} /{" "}
                            {formatChips(nextBlindLevel.bigBlind)}
                            {nextBlindLevel.ante && (
                                <span className="text-yellow-400 ml-2">
                                    (Ante: {formatChips(nextBlindLevel.ante)})
                                </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                            Duration: {nextBlindLevel.duration} minutes
                        </div>
                    </div>
                </UltraGlassCard>
            )}

            {/* Tournament Progress */}
            <UltraGlassCard variant="sapphire" className="space-y-4">
                <NeonText className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tournament Progress
                </NeonText>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Level:</span>
                        <span className="font-medium">
                            {currentLevel + 1} / {tournament.blindLevels.length}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <Badge
                            className={
                                tournament.status === "upcoming"
                                    ? "bg-blue-500 text-white"
                                    : tournament.status === "running"
                                    ? "bg-green-500 text-white glow-green"
                                    : tournament.status === "paused"
                                    ? "bg-yellow-500 text-black"
                                    : "bg-gray-500 text-white"
                            }
                        >
                            {tournament.status.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Level Duration:</span>
                        <span className="font-medium">
                            {currentBlindLevel.duration} minutes
                        </span>
                    </div>
                </div>
            </UltraGlassCard>
        </div>
    );
}
