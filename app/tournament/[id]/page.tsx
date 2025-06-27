"use client";

import Navbar from "@/components/layout/navbar";
import PokerGame from "@/components/poker/poker-game";
import MobileTournamentView from "@/components/tournament/mobile-tournament-view";
import TournamentClock from "@/components/tournament/tournament-clock";
import TournamentControls from "@/components/tournament/tournament-controls";
import TournamentRanking from "@/components/tournament/tournament-ranking";
import TournamentStats from "@/components/tournament/tournament-stats";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { useTournaments } from "@/hooks/use-tournaments";
import { Tournament } from "@/lib/tournament";
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    Plus,
    Trophy,
    Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TournamentPage() {
    const params = useParams();
    const router = useRouter();
    const {
        tournaments,
        isLoading,
        updateTournamentClock,
        updateTournamentStatus,
        addPlayerManually,
        eliminatePlayer,
        updatePlayerChips,
    } = useTournaments();
    const { auth } = useAuth();
    const { notifyElimination } = useNotifications();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState("");

    useEffect(() => {
        // First, let's check what's in localStorage when this component mounts
        const currentStored = localStorage.getItem(
            "temp-poker-app-tournaments-v2"
        );
        console.log(
            "🔍 DEBUG TournamentPage: localStorage on mount:",
            currentStored ? "HAS DATA" : "NO DATA"
        );
        console.log(
            "🔍 DEBUG TournamentPage: localStorage size:",
            currentStored ? currentStored.length : 0
        );

        // Garantir que params.id seja uma string
        const tournamentId = Array.isArray(params.id)
            ? params.id[0]
            : params.id;

        console.log("🔍 DEBUG: Looking for tournament ID:", tournamentId);
        console.log("🔍 DEBUG: tournaments.length:", tournaments.length);
        console.log("🔍 DEBUG: isLoading:", isLoading);
        console.log(
            "🔍 DEBUG: Available tournaments:",
            tournaments.map((t) => ({ id: t.id, name: t.name }))
        );

        let foundTournament = tournaments.find((t) => t.id === tournamentId);

        // If not found in state, try to find in localStorage as fallback
        if (!foundTournament && !isLoading) {
            console.log(
                "🔍 DEBUG: Tournament not found in state, checking localStorage directly"
            );
            console.log(
                "🔍 DEBUG: Checking localStorage with key: temp-poker-app-tournaments-v2"
            );
            try {
                const stored = localStorage.getItem(
                    "temp-poker-app-tournaments-v2"
                );
                console.log("🔍 DEBUG: localStorage content:", stored);
                console.log(
                    "🔍 DEBUG: localStorage raw length:",
                    stored ? stored.length : 0
                );
                if (stored) {
                    const parsedTournaments = JSON.parse(stored).map(
                        (t: any) => ({
                            ...t,
                            startTime: new Date(t.startTime),
                        })
                    );
                    console.log(
                        "🔍 DEBUG: Parsed tournaments from localStorage:",
                        parsedTournaments.map((t: any) => ({
                            id: t.id,
                            name: t.name,
                        }))
                    );
                    foundTournament = parsedTournaments.find(
                        (t: any) => t.id === tournamentId
                    );
                    console.log(
                        "🔍 DEBUG: Found in localStorage:",
                        foundTournament ? foundTournament.name : "NOT FOUND"
                    );
                } else {
                    console.log("🔍 DEBUG: No data found in localStorage");
                }
            } catch (error) {
                console.error(
                    "🔍 DEBUG: Error reading from localStorage:",
                    error
                );
            }
        }

        console.log(
            "🔍 DEBUG: Final found tournament:",
            foundTournament ? foundTournament.name : "NOT FOUND"
        );
        setTournament(foundTournament || null);
    }, [tournaments, params, isLoading]);

    const handleAddPlayer = () => {
        if (newPlayerName.trim() && tournament) {
            addPlayerManually(tournament.id, newPlayerName.trim());
            setNewPlayerName("");
            setShowAddPlayer(false);
        }
    };

    const handleUpdateClock = (currentLevel: number, timeRemaining: number) => {
        if (tournament) {
            updateTournamentClock(tournament.id, currentLevel, timeRemaining);
        }
    };

    const handleUpdateStatus = (status: Tournament["status"]) => {
        if (tournament) {
            updateTournamentStatus(tournament.id, status);
        }
    };

    const handleEliminatePlayer = (playerId: string) => {
        if (tournament) {
            const player = tournament.players?.find((p) => p.id === playerId);
            const activePlayers =
                tournament.players?.filter((p) => !p.isEliminated) || [];
            const position = activePlayers.length;

            eliminatePlayer(tournament.id, playerId);

            if (player) {
                notifyElimination(player.name, position);
            }
        }
    };

    const handleUpdateChips = (playerId: string, chips: number) => {
        if (tournament) {
            updatePlayerChips(tournament.id, playerId, chips);
        }
    };

    if (!auth.user) {
        router.push("/");
        return null;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-900 to-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4 text-neon-cyan">
                            Loading...
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-900 to-black text-white">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4 text-neon-red">
                            Tournament Not Found
                        </h1>
                        <p className="text-gray-400 mb-4">
                            The tournament you&apos;re looking for doesn&apos;t
                            exist or may have been deleted.
                        </p>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="neon-button bg-gradient-to-r from-pink-500 to-cyan-500 text-black font-semibold hover:glow-pink"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const isDirector = tournament.createdBy === auth.user.id;
    const isRegistered = tournament.registeredPlayers.includes(auth.user.id);

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-900 to-black text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="mb-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-neon-pink">
                                {tournament.name}
                            </h1>
                            <p className="text-gray-300 mb-4">
                                {tournament.description}
                            </p>
                            {isDirector && (
                                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold mb-2 glow-red">
                                    Tournament Director
                                </Badge>
                            )}
                            {isRegistered && !isDirector && (
                                <Badge className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold mb-2 glow-green">
                                    Registered
                                </Badge>
                            )}
                        </div>
                        <Badge
                            className={`text-black font-semibold ${
                                tournament.status === "upcoming"
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 glow-cyan"
                                    : tournament.status === "running"
                                    ? "bg-gradient-to-r from-green-500 to-lime-500 glow-green"
                                    : tournament.status === "paused"
                                    ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                                    : "bg-gradient-to-r from-gray-500 to-gray-600"
                            }`}
                        >
                            {tournament.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                {/* Mobile View */}
                <MobileTournamentView
                    tournament={tournament}
                    isDirector={isDirector}
                    onUpdateClock={handleUpdateClock}
                    onUpdateStatus={handleUpdateStatus}
                    onEliminatePlayer={handleEliminatePlayer}
                    onUpdateChips={handleUpdateChips}
                />

                {/* Desktop View */}
                <div className="hidden md:block space-y-6">
                    {/* Poker Table - Only when tournament is running */}
                    {tournament.status === "running" && (
                        <div className="w-full">
                            <PokerGame
                                tournament={tournament}
                                isDirector={isDirector}
                                onUpdateChips={handleUpdateChips}
                            />
                        </div>
                    )}

                    {/* Tournament Info Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Tournament Clock */}
                        <div className="xl:col-span-2">
                            <TournamentClock
                                tournament={tournament}
                                onUpdateClock={handleUpdateClock}
                                onUpdateStatus={handleUpdateStatus}
                                isDirector={isDirector}
                            />
                        </div>

                        {/* Tournament Ranking */}
                        <div className="xl:col-span-1">
                            <TournamentRanking
                                tournament={tournament}
                                onEliminatePlayer={handleEliminatePlayer}
                                onUpdateChips={handleUpdateChips}
                                isDirector={isDirector}
                            />
                        </div>

                        {/* Tournament Stats and Info */}
                        <div className="xl:col-span-1 space-y-6">
                            <TournamentStats tournament={tournament} />

                            {isDirector && (
                                <TournamentControls
                                    tournament={tournament}
                                    isDirector={isDirector}
                                />
                            )}

                            <Card className="neon-card bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 border-pink-500/30 hover:border-cyan-400/50">
                                <CardHeader>
                                    <CardTitle className="text-neon-cyan">
                                        Tournament Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-neon-cyan" />
                                        <div>
                                            <div className="font-medium text-white">
                                                Start Time
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {formatDate(
                                                    tournament.startTime
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-neon-green" />
                                        <div>
                                            <div className="font-medium text-white">
                                                Buy-in
                                            </div>
                                            <div className="text-sm text-neon-green font-semibold">
                                                ${tournament.buyIn}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-yellow-400" />
                                        <div>
                                            <div className="font-medium text-white">
                                                Prize Pool
                                            </div>
                                            <div className="text-sm text-yellow-400 font-semibold">
                                                $
                                                {tournament.prizePool.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-purple-400" />
                                        <div>
                                            <div className="font-medium text-white">
                                                Players
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                <span className="text-neon-cyan font-semibold">
                                                    {
                                                        tournament
                                                            .registeredPlayers
                                                            .length
                                                    }
                                                </span>{" "}
                                                /{" "}
                                                <span className="text-gray-500">
                                                    {tournament.maxPlayers}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="neon-card bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50 border-pink-500/30 hover:border-cyan-400/50">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-neon-pink">
                                            Registered Players
                                        </CardTitle>
                                        {isDirector &&
                                            tournament.status ===
                                                "upcoming" && (
                                                <Dialog
                                                    open={showAddPlayer}
                                                    onOpenChange={
                                                        setShowAddPlayer
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:text-green-300 hover:border-green-400"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Player
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="neon-card bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 border-pink-500/30">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-neon-cyan">
                                                                Add Player to
                                                                Tournament
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <Input
                                                                placeholder="Player name"
                                                                value={
                                                                    newPlayerName
                                                                }
                                                                onChange={(e) =>
                                                                    setNewPlayerName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                onKeyPress={(
                                                                    e
                                                                ) =>
                                                                    e.key ===
                                                                        "Enter" &&
                                                                    handleAddPlayer()
                                                                }
                                                                className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-400"
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    onClick={
                                                                        handleAddPlayer
                                                                    }
                                                                    disabled={
                                                                        !newPlayerName.trim()
                                                                    }
                                                                    className="neon-button bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold hover:glow-green disabled:opacity-50"
                                                                >
                                                                    Add Player
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        setShowAddPlayer(
                                                                            false
                                                                        )
                                                                    }
                                                                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {tournament.registeredPlayers.length ===
                                        0 ? (
                                            <p className="text-sm text-gray-400">
                                                No players registered yet
                                            </p>
                                        ) : (
                                            tournament.registeredPlayers.map(
                                                (playerId, index) => {
                                                    const playerNames =
                                                        (tournament as any)
                                                            .playerNames || {};
                                                    const playerName =
                                                        playerNames[playerId] ||
                                                        `Player ${index + 1}`;
                                                    const isCurrentUser =
                                                        playerId ===
                                                        auth.user?.id;
                                                    const isManualPlayer =
                                                        playerId.startsWith(
                                                            "manual-"
                                                        );

                                                    return (
                                                        <div
                                                            key={playerId}
                                                            className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-cyan-500/20 hover:border-cyan-400/40 flex items-center justify-between p-3 rounded-lg transition-all duration-200"
                                                        >
                                                            <span className="text-sm font-medium text-white">
                                                                {isCurrentUser
                                                                    ? "You"
                                                                    : playerName}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                {isCurrentUser && (
                                                                    <Badge className="bg-gradient-to-r from-green-500 to-cyan-500 text-black text-xs font-semibold">
                                                                        You
                                                                    </Badge>
                                                                )}
                                                                {isManualPlayer && (
                                                                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                                                                        Manual
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
