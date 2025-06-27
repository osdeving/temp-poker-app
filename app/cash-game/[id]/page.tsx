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
    const { cashGames, leaveCashGame, joinCashGame, addBot } = useCashGames();
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
    const enginePlayers = game.players.map((player) => ({
        id: player.id,
        name: player.name,
        chips: player.chipCount,
        avatar: "👤", // Default avatar since CashGamePlayer doesn't have avatar
    }));

    const handleAddBot = () => {
        if (!game || !auth.user) return;

        // Use the addBot function from the hook
        const success = addBot(game.id);

        if (success) {
            // Refresh game data
            const gameId = Array.isArray(params.id) ? params.id[0] : params.id;
            const updatedGame = cashGames.find((g) => g.id === gameId);
            setGame(updatedGame || null);
        }
    };

    const handleJoinGame = () => {
        if (!auth.user || !game) return;

        // Check if already in game
        if (isInGame) {
            alert("Você já está sentado nesta mesa!");
            return;
        }

        const buyInAmount = game.minBuyIn * 2; // Default buy-in
        const success = joinCashGame(
            game.id,
            auth.user.id,
            auth.user.name,
            buyInAmount
        );

        if (success) {
            // Refresh game data
            const gameId = Array.isArray(params.id) ? params.id[0] : params.id;
            const updatedGame = cashGames.find((g) => g.id === gameId);
            setGame(updatedGame || null);
        } else {
            alert(
                "Não foi possível entrar na mesa. Verifique se há vagas disponíveis."
            );
        }
    };

    const handleGameEnd = (winner: any) => {
        console.log("Winner:", winner);
        // Implementar lógica para fim de jogo
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
                                        {game.type
                                            .replace("-", " ")
                                            .toUpperCase()}
                                    </Badge>
                                    <Badge className="bg-neon-cyan/20 text-neon-cyan">
                                        {game.players.length}/{game.maxPlayers}{" "}
                                        Jogadores
                                    </Badge>
                                    <Badge
                                        className={`${
                                            game.status === "active"
                                                ? "bg-green-500"
                                                : game.status === "waiting"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {game.status === "active"
                                            ? "Em Jogo"
                                            : game.status === "waiting"
                                            ? "Aguardando"
                                            : "Finalizado"}
                                    </Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-400">
                                        Small Blind:
                                    </span>
                                    <div className="text-neon-green font-semibold">
                                        ${game.smallBlind}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400">
                                        Big Blind:
                                    </span>
                                    <div className="text-neon-green font-semibold">
                                        ${game.bigBlind}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400">
                                        Min Buy-in:
                                    </span>
                                    <div className="text-neon-pink font-semibold">
                                        ${game.minBuyIn}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-gray-400">
                                        Max Buy-in:
                                    </span>
                                    <div className="text-neon-pink font-semibold">
                                        ${game.maxBuyIn}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Game Actions */}
                {!isInGame && game.players.length < game.maxPlayers && (
                    <Card className="neon-card mb-8">
                        <CardContent className="text-center py-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Entrar na Mesa
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Você precisa estar sentado na mesa para jogar.
                                Buy-in: ${game.minBuyIn * 2}
                            </p>
                            <Button
                                className="neon-button"
                                onClick={handleJoinGame}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Sentar na Mesa
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Already in game message */}
                {isInGame && (
                    <Card className="neon-card mb-8">
                        <CardContent className="text-center py-6">
                            <h3 className="text-lg font-semibold mb-4 text-green-400">
                                ✅ Você está na mesa!
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Você está sentado na posição{" "}
                                {currentPlayer?.seatPosition} com $
                                {currentPlayer?.chipCount.toLocaleString()} em
                                fichas.
                            </p>
                            <Button
                                variant="outline"
                                onClick={handleLeaveGame}
                                className="border-red-500 text-red-400 hover:bg-red-500/20"
                            >
                                Sair da Mesa
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Table full message */}
                {!isInGame && game.players.length >= game.maxPlayers && (
                    <Card className="neon-card mb-8">
                        <CardContent className="text-center py-6">
                            <h3 className="text-lg font-semibold mb-4 text-red-400">
                                Mesa Lotada
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Esta mesa está cheia ({game.players.length}/
                                {game.maxPlayers} jogadores). Aguarde alguém
                                sair ou escolha outra mesa.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Advanced Poker Game Engine */}
                {enginePlayers.length >= 1 ? (
                    <AdvancedPokerGame
                        players={enginePlayers}
                        smallBlind={game.smallBlind}
                        bigBlind={game.bigBlind}
                        onGameEnd={handleGameEnd}
                    />
                ) : (
                    <Card className="neon-card">
                        <CardContent className="text-center py-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Mesa Vazia
                            </h3>
                            <p className="text-gray-400 mb-4">
                                Adicione pelo menos 1 jogador ou bot para
                                começar.
                            </p>
                            <Button
                                onClick={handleAddBot}
                                className="neon-button"
                                disabled={
                                    game.players.length >= game.maxPlayers
                                }
                            >
                                🤖 Adicionar Bot
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Game Controls */}
                <Card className="neon-card mt-8">
                    <CardHeader>
                        <CardTitle>Controles da Mesa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                onClick={handleAddBot}
                                variant="outline"
                                className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
                                disabled={
                                    game.players.length >= game.maxPlayers
                                }
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
                                <div
                                    key={player.id}
                                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                                >
                                    <div className="text-2xl">👤</div>
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
