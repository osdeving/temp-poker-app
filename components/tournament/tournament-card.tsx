"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { HoverGlow } from "@/components/ui/animations";
import { NeonText, GlassCard, NeonButton } from "@/components/ui/neon";
import { StatusBadge } from "@/components/ui/status";
import { formatChips, Tournament } from "@/lib/tournament";
import { Calendar, DollarSign, Trophy, Users } from "lucide-react";

interface TournamentCardProps {
    tournament: Tournament;
    onJoin?: (tournamentId: string) => void;
    onLeave?: (tournamentId: string) => void;
    onView?: (tournamentId: string) => void;
    isRegistered?: boolean;
    canRegister?: boolean;
}

export default function TournamentCard({
    tournament,
    onJoin,
    onLeave,
    onView,
    isRegistered = false,
    canRegister = true,
}: TournamentCardProps) {
    const getStatusVariant = (status: Tournament["status"]) => {
        switch (status) {
            case "upcoming":
                return "upcoming" as const;
            case "running":
                return "running" as const;
            case "paused":
                return "paused" as const;
            case "finished":
                return "finished" as const;
            default:
                return "finished" as const;
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <HoverGlow>
            <GlassCard className="h-full">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <NeonText color="pink" className="text-xl font-bold">
                                {tournament.name}
                            </NeonText>
                            <CardDescription className="mt-1 text-gray-300">
                                {tournament.description}
                            </CardDescription>
                        </div>
                        <StatusBadge status={getStatusVariant(tournament.status)}>
                            {tournament.status}
                        </StatusBadge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-400" />
                            <span className="text-white">
                                Buy-in:{" "}
                                <NeonText color="green" className="font-semibold">
                                    ${tournament.buyIn}
                                </NeonText>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-400" />
                            <span className="text-white">
                                Prize:{" "}
                                <span className="text-yellow-400 font-semibold">
                                    {formatChips(tournament.prizePool)}
                                </span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <span className="text-white">
                                {formatDate(tournament.startTime)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-400" />
                            <span className="text-white">
                                <NeonText color="cyan" className="font-semibold">
                                    {tournament.registeredPlayers.length}
                                </NeonText>
                                /
                                <span className="text-gray-400">
                                    {tournament.maxPlayers}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {tournament.status === "upcoming" && canRegister && (
                            <>
                                {isRegistered ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onLeave?.(tournament.id)}
                                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400"
                                    >
                                        Leave
                                    </Button>
                                ) : (
                                    <NeonButton
                                        variant="primary"
                                        size="sm"
                                        onClick={() => onJoin?.(tournament.id)}
                                        disabled={
                                            tournament.registeredPlayers.length >=
                                            tournament.maxPlayers
                                        }
                                        className="flex-1"
                                    >
                                        {tournament.registeredPlayers.length >=
                                        tournament.maxPlayers
                                            ? "Full"
                                            : "Join"}
                                    </NeonButton>
                                )}
                            </>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView?.(tournament.id)}
                            className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-400"
                        >
                            View Details
                        </Button>
                    </div>
                </CardContent>
            </GlassCard>
        </HoverGlow>
    );
}
