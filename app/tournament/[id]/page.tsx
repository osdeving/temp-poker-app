"use client";

import Navbar from "@/components/layout/navbar";
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
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                    </div>
                </div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">
                            Tournament Not Found
                        </h1>
                        <p className="text-muted-foreground mb-4">
                            The tournament you&apos;re looking for doesn&apos;t
                            exist or may have been deleted.
                        </p>
                        <Button onClick={() => router.push("/dashboard")}>
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
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/dashboard")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {tournament.name}
                            </h1>
                            <p className="text-muted-foreground mb-4">
                                {tournament.description}
                            </p>
                            {isDirector && (
                                <Badge className="director-badge mb-2">
                                    Tournament Director
                                </Badge>
                            )}
                            {isRegistered && !isDirector && (
                                <Badge className="registered-badge mb-2">
                                    Registered
                                </Badge>
                            )}
                        </div>
                        <Badge
                            className={
                                tournament.status === "upcoming"
                                    ? "status-badge-upcoming"
                                    : tournament.status === "running"
                                    ? "status-badge-running"
                                    : tournament.status === "paused"
                                    ? "status-badge-paused"
                                    : "status-badge-finished"
                            }
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
                <div className="hidden md:grid grid-cols-1 xl:grid-cols-4 gap-6">
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

                        <Card className="poker-card">
                            <CardHeader>
                                <CardTitle>Tournament Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <div>
                                        <div className="font-medium">
                                            Start Time
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(tournament.startTime)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <div>
                                        <div className="font-medium">
                                            Buy-in
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            ${tournament.buyIn}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-yellow-600" />
                                    <div>
                                        <div className="font-medium">
                                            Prize Pool
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            $
                                            {tournament.prizePool.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-purple-600" />
                                    <div>
                                        <div className="font-medium">
                                            Players
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {
                                                tournament.registeredPlayers
                                                    .length
                                            }{" "}
                                            / {tournament.maxPlayers}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="poker-card">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Registered Players</CardTitle>
                                    {isDirector &&
                                        tournament.status === "upcoming" && (
                                            <Dialog
                                                open={showAddPlayer}
                                                onOpenChange={setShowAddPlayer}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Plus className="h-4 w-4 mr-2" />
                                                        Add Player
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
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
                                                            onKeyPress={(e) =>
                                                                e.key ===
                                                                    "Enter" &&
                                                                handleAddPlayer()
                                                            }
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={
                                                                    handleAddPlayer
                                                                }
                                                                disabled={
                                                                    !newPlayerName.trim()
                                                                }
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
                                        <p className="text-sm text-muted-foreground">
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
                                                    playerId === auth.user?.id;
                                                const isManualPlayer =
                                                    playerId.startsWith(
                                                        "manual-"
                                                    );

                                                return (
                                                    <div
                                                        key={playerId}
                                                        className="player-list-item flex items-center justify-between p-3 rounded-lg"
                                                    >
                                                        <span className="text-sm font-medium">
                                                            {isCurrentUser
                                                                ? "You"
                                                                : playerName}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            {isCurrentUser && (
                                                                <Badge className="registered-badge text-xs">
                                                                    You
                                                                </Badge>
                                                            )}
                                                            {isManualPlayer && (
                                                                <Badge className="manual-player-badge text-xs">
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
    );
}
