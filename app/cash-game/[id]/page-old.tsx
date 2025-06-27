"use client";

import Navbar from "@/components/layout/navbar";
import AdvancedPokerGame from "@/components/poker/advanced-poker-game";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useCashGames } from "@/hooks/use-cash-games";
import { CashGame } from "@/lib/cash-game";
import { ArrowLeft, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CashGamePage() {
    const params = useParams();
    const router = useRouter();
    const { auth } = useAuth();
    const { cashGames, isLoading, addBotToCashGame, leaveCashGame } = useCashGames();
    const [game, setGame] = useState<CashGame | null>(null);

    useEffect(() => {
        if (!auth.user && !auth.isLoading) {
            router.push("/");
            return;
        }

        const gameId = Array.isArray(params.id) ? params.id[0] : params.id;
        const foundGame = cashGames.find((g) => g.id === gameId);
        setGame(foundGame || null);
    }, [cashGames, params.id, auth.user, auth.isLoading, router]);

    if (auth.isLoading || !auth.user) {
        return <div>Loading...</div>;
    }

    if (!game) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Card className="neon-card max-w-md mx-auto">
                        <CardContent className="text-center py-8">
                            <h3 className="text-lg font-semibold mb-2">
                                Game Not Found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                The cash game you're looking for doesn't exist
                                or has ended.
                            </p>
                            <Button
                                onClick={() => router.push("/cash-games")}
                                className="neon-button"
                            >
                                Back to Lobby
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const currentPlayer = game.players.find((p) => p.id === auth.user!.id);
    const isInGame = !!currentPlayer;

    // Convert players to poker engine format
    const enginePlayers = game.players.map(player => ({
        id: player.id,
        name: player.name,
        chips: player.chipCount,
        avatar: player.avatar
    }));

    const handleGameEnd = (winner: any) => {
        console.log('Winner:', winner);
        // Aqui você pode implementar lógica para fim de jogo
    };

    const handleLeaveGame = () => {
        if (!auth.user) return;

        const success = leaveCashGame(game.id, auth.user.id);
        if (success) {
            router.push("/cash-games");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/cash-games")}
                        className="mb-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Voltar ao Lobby
                    </Button>

                    <Card className="neon-card">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>{game.name}</span>
                                <div className="flex gap-2">
                                    <Badge className="bg-neon-green/20 text-neon-green">
                                        {game.type.replace('-', ' ').toUpperCase()}
                                    </Badge>
                                    <Badge className="bg-neon-cyan/20 text-neon-cyan">
                                        {game.players.length}/{game.maxPlayers} Jogadores
                                    </Badge>
                                    <Badge className={`${
                                        game.status === 'active'
                                            ? 'bg-green-500'
                                            : game.status === 'waiting'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                    }`}>
                                        {game.status === 'active'
                                            ? 'Em Jogo'
                                            : game.status === 'waiting'
                                                ? 'Aguardando'
                                                : 'Finalizado'
                                        }
                                    </Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">Small Blind:</span>
                                    <div className="text-neon-green font-semibold">${game.smallBlind}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Big Blind:</span>
                                    <div className="text-neon-green font-semibold">${game.bigBlind}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Min Buy-in:</span>
                                    <div className="text-neon-pink font-semibold">${game.minBuyIn}</div>
                                </div>
                                <div>
                                    <span className="text-gray-400">Max Buy-in:</span>
                                    <div className="text-neon-pink font-semibold">${game.maxBuyIn}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Game Actions */}
                {!isInGame && game.status === 'waiting' && (
                    <Card className="neon-card mb-8">
                        <CardContent className="text-center py-6">
                            <h3 className="text-lg font-semibold mb-4">Entrar na Mesa</h3>
                            <p className="text-gray-400 mb-4">
                                Você precisa estar sentado na mesa para jogar.
                            </p>
                            <Button
                                className="neon-button"
                                onClick={() => {
                                    // Aqui você implementaria a lógica de join
                                    console.log('Join game');
                                }}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Sentar na Mesa
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Advanced Poker Game Engine */}
                {enginePlayers.length >= 2 && (
                    <AdvancedPokerGame
                        players={enginePlayers}
                        smallBlind={game.smallBlind}
                        bigBlind={game.bigBlind}
                        onGameEnd={handleGameEnd}
                    />
                )}

                {/* Game Controls */}
                <Card className="neon-card mt-8">
                    <CardHeader>
                        <CardTitle>Controles da Mesa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                onClick={() => addBotToCashGame(game.id)}
                                variant="outline"
                                className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
                                disabled={game.players.length >= game.maxPlayers}
                            >
                                🤖 Adicionar Bot
                            </Button>

                            {isInGame && (
                                <Button
                                    onClick={handleLeaveGame}
                                    variant="destructive"
                                >
                                    Sair da Mesa
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Player List */}
                <Card className="neon-card mt-8">
                    <CardHeader>
                        <CardTitle>Jogadores na Mesa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {game.players.map((player) => (
                                <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                                    <div className="text-2xl">{player.avatar || '👤'}</div>
                                    <div>
                                        <div className="font-semibold text-white">
                                            {player.name}
                                            {player.id === auth.user!.id && (
                                                <Badge className="ml-2 bg-neon-cyan/20 text-neon-cyan text-xs">
                                                    Você
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-neon-green text-sm">
                                            ${player.chipCount.toLocaleString()}
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            Assento {player.seatPosition}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/cash-games")}
                        className="mb-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Lobby
                    </Button>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-neon-cyan mb-2">
                                {game.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>Texas Hold'em</span>
                                <span>
                                    ${game.smallBlind}/${game.bigBlind}
                                </span>
                                <span>
                                    {game.currentPlayers}/{game.maxPlayers}{" "}
                                    players
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                className={
                                    game.status === "waiting"
                                        ? "bg-yellow-500"
                                        : game.status === "active"
                                        ? "bg-green-500"
                                        : "bg-gray-500"
                                }
                            >
                                {game.status.toUpperCase()}
                            </Badge>
                            {isInGame && (
                                <Button
                                    onClick={handleLeaveGame}
                                    variant="destructive"
                                    size="sm"
                                >
                                    Leave Table
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {game.status === "waiting" ? (
                    /* Waiting Room */
                    <Card className="neon-card">
                        <CardContent className="text-center py-8">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                Waiting for Players
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Need at least 2 players to start the game.
                            </p>
                            <div className="space-y-2">
                                {game.players.map((player) => (
                                    <div
                                        key={player.id}
                                        className="flex justify-between items-center p-2 bg-gray-800 rounded"
                                    >
                                        <span>{player.name}</span>
                                        <span className="text-green-400">
                                            ${player.chipCount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Active Game */
                    <div className="space-y-6">
                        {/* Poker Table */}
                        <PokerTable
                            tournament={{
                                id: game.id,
                                name: game.name,
                                description: `${game.smallBlind}/${game.bigBlind} Cash Game`,
                                buyIn: 0,
                                startTime: game.createdAt,
                                status: "running",
                                maxPlayers: game.maxPlayers,
                                registeredPlayers: game.players.map(
                                    (p) => p.id
                                ),
                                players: [],
                                blindLevels: [],
                                currentLevel: 0,
                                timeRemaining: 0,
                                createdBy: game.createdBy,
                                prizePool: 0,
                                startingChips: 0,
                            }}
                            players={tablePlayer}
                            communityCards={
                                game.currentHand?.communityCards || []
                            }
                            pot={game.currentHand?.pot || 0}
                            currentBet={game.currentHand?.currentBet || 0}
                            isPlayerTurn={
                                isInGame &&
                                currentPlayer?.seatPosition ===
                                    game.currentHand?.activePlayerPosition
                            }
                            onPlayerAction={handlePlayerAction}
                        />

                        {/* Game Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="neon-card">
                                <CardContent className="p-4 text-center">
                                    <div className="text-sm text-gray-400">
                                        Current Hand
                                    </div>
                                    <div className="text-xl font-bold text-neon-cyan">
                                        {game.currentHand?.stage.toUpperCase() ||
                                            "N/A"}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="neon-card">
                                <CardContent className="p-4 text-center">
                                    <div className="text-sm text-gray-400">
                                        Pot Size
                                    </div>
                                    <div className="text-xl font-bold text-neon-green">
                                        ${game.currentHand?.pot || 0}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="neon-card">
                                <CardContent className="p-4 text-center">
                                    <div className="text-sm text-gray-400">
                                        To Call
                                    </div>
                                    <div className="text-xl font-bold text-neon-pink">
                                        $
                                        {currentPlayer
                                            ? (game.currentHand?.currentBet ||
                                                  0) - currentPlayer.currentBet
                                            : 0}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Player Stats */}
                        {isInGame && currentPlayer && (
                            <Card className="neon-card">
                                <CardHeader>
                                    <CardTitle>Your Stats</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="text-sm text-gray-400">
                                                Chips
                                            </div>
                                            <div className="text-lg font-bold text-green-400">
                                                ${currentPlayer.chipCount}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">
                                                Current Bet
                                            </div>
                                            <div className="text-lg font-bold text-yellow-400">
                                                ${currentPlayer.currentBet}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">
                                                Position
                                            </div>
                                            <div className="text-lg font-bold text-blue-400">
                                                Seat{" "}
                                                {currentPlayer.seatPosition + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-400">
                                                Status
                                            </div>
                                            <div className="text-lg font-bold text-purple-400">
                                                {currentPlayer.action?.toUpperCase() ||
                                                    "WAITING"}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
