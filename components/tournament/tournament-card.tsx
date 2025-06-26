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
    const getStatusClass = (status: Tournament["status"]) => {
        switch (status) {
            case "upcoming":
                return "status-badge-upcoming";
            case "running":
                return "status-badge-running";
            case "paused":
                return "status-badge-paused";
            case "finished":
                return "status-badge-finished";
            default:
                return "status-badge-finished";
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
        <Card className="neon-card bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 border-pink-500/30 hover:border-cyan-400/50 transition-all duration-300 hover:glow-pink">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl text-neon-pink font-bold">
                            {tournament.name}
                        </CardTitle>
                        <CardDescription className="mt-1 text-gray-300">
                            {tournament.description}
                        </CardDescription>
                    </div>
                    <Badge
                        className={`${getStatusClass(
                            tournament.status
                        )} text-black font-semibold`}
                    >
                        {tournament.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-neon-green" />
                        <span className="text-white">
                            Buy-in:{" "}
                            <span className="text-neon-green font-semibold">
                                ${tournament.buyIn}
                            </span>
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
                        <Calendar className="h-4 w-4 text-neon-cyan" />
                        <span className="text-white">
                            {formatDate(tournament.startTime)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-white">
                            <span className="text-neon-cyan font-semibold">
                                {tournament.registeredPlayers.length}
                            </span>
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
                                <Button
                                    size="sm"
                                    onClick={() => onJoin?.(tournament.id)}
                                    disabled={
                                        tournament.registeredPlayers.length >=
                                        tournament.maxPlayers
                                    }
                                    className="flex-1 neon-button bg-gradient-to-r from-pink-500 to-cyan-500 text-black font-semibold hover:glow-pink disabled:opacity-50 disabled:hover:shadow-none"
                                >
                                    {tournament.registeredPlayers.length >=
                                    tournament.maxPlayers
                                        ? "Full"
                                        : "Join"}
                                </Button>
                            )}
                        </>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView?.(tournament.id)}
                        className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-400 hover:glow-cyan"
                    >
                        View Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
