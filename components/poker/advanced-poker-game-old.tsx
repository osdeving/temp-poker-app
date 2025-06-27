"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
    GameState,
    Player,
    PokerAction,
    PokerEngine,
} from "@/lib/poker-engine";
import { useEffect, useState } from "react";
import { CommunityCards, PotDisplay } from "./poker-cards";
import { PokerTable, ActionButtons } from "./poker-table-visual";

interface AdvancedPokerGameProps {
    players: { id: string; name: string; chips: number; avatar?: string }[];
    smallBlind?: number;
    bigBlind?: number;
    onGameEnd?: (winner: Player) => void;
}

export default function AdvancedPokerGame({
    players,
    smallBlind = 25,
    bigBlind = 50,
    onGameEnd,
}: AdvancedPokerGameProps) {
    const [engine, setEngine] = useState<PokerEngine | null>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [raiseAmount, setRaiseAmount] = useState<number[]>([bigBlind]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (players.length >= 2) {
            const newEngine = new PokerEngine(players, smallBlind, bigBlind);
            setEngine(newEngine);
            const initialState = newEngine.startNewHand();
            setGameState(initialState);
        }
    }, [players, smallBlind, bigBlind]);

    // Auto-play para bots
    useEffect(() => {
        if (!engine || !gameState || isProcessing) return;

        const currentPlayer = engine.getCurrentPlayer();
        if (currentPlayer?.id.startsWith("bot_")) {
            const timer = setTimeout(() => {
                const botAction = engine.simulateBotAction();
                if (botAction) {
                    handlePlayerAction(botAction);
                }
            }, 1500); // Bot pensa por 1.5s

            return () => clearTimeout(timer);
        }
    }, [gameState, engine, isProcessing]);

    const handlePlayerAction = async (action: PokerAction) => {
        if (!engine || !gameState) return;

        setIsProcessing(true);

        try {
            const result = engine.processAction(action);

            if (result.success) {
                setGameState({ ...result.newState });

                // Check se a mão acabou
                const activePlayers = result.newState.players.filter(
                    (p) => !p.isFolded
                );
                if (
                    activePlayers.length <= 1 ||
                    result.newState.gamePhase === "ended"
                ) {
                    if (onGameEnd && activePlayers.length > 0) {
                        onGameEnd(activePlayers[0]);
                    }
                }
            } else {
                alert(result.message || "Ação inválida");
            }
        } catch (error) {
            console.error("Erro ao processar ação:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleNewHand = () => {
        if (!engine) return;
        const newState = engine.startNewHand();
        setGameState(newState);
        setRaiseAmount([bigBlind]);
    };

    const handleNextStreet = () => {
        if (!engine) return;
        const newState = engine.advanceToNextStreet();
        setGameState(newState);
    };

    if (!gameState || !engine) {
        return (
            <Card className="neon-card">
                <CardContent className="text-center py-8">
                    <p>Iniciando jogo...</p>
                </CardContent>
            </Card>
        );
    }

    const currentPlayer = engine.getCurrentPlayer();
    const availableActions = currentPlayer
        ? engine.getAvailableActions(currentPlayer.id)
        : [];
    const isCurrentPlayerBot = currentPlayer?.id.startsWith("bot_") || false;

    return (
        <div className="space-y-6">
            {/* Informações da Mesa */}
            <Card className="neon-card">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Mesa de Poker - Mão #{gameState.round}</span>
                        <div className="flex gap-2 text-sm">
                            <Badge className="bg-neon-cyan/20 text-neon-cyan">
                                {gameState.gamePhase.toUpperCase()}
                            </Badge>
                            <Badge className="bg-neon-green/20 text-neon-green">
                                SB: ${gameState.smallBlind} / BB: $
                                {gameState.bigBlind}
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Mesa Principal */}
            <Card className="neon-card">
                <CardContent className="p-6">
                    {/* Pot Display */}
                    <PotDisplay amount={gameState.pot} className="mb-6" />
                    
                    {/* Cartas Comunitárias */}
                    <CommunityCards cards={gameState.communityCards} />
                    
                    {gameState.currentBet > 0 && (
                        <div className="text-center mb-6">
                            <div className="inline-block bg-neon-pink/20 text-neon-pink px-4 py-2 rounded-lg">
                                <span className="font-semibold">Aposta atual: ${gameState.currentBet}</span>
                            </div>
                        </div>
                    )}

                    {/* Mesa de Poker Visual */}
                    <PokerTable 
                        players={gameState.players}
                        activePlayerIndex={gameState.activePlayerIndex}
                        dealerPosition={gameState.dealerPosition}
                        className="mb-6"
                    />
                </CardContent>
            </Card>

                    {/* Jogadores */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gameState.players.map((player, index) => (
                            <Card
                                key={player.id}
                                className={`p-4 ${
                                    index === gameState.activePlayerIndex &&
                                    !isCurrentPlayerBot
                                        ? "ring-2 ring-neon-cyan glow-cyan"
                                        : player.isFolded
                                        ? "opacity-50"
                                        : "neon-card"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">
                                        {player.avatar || "👤"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white flex items-center gap-2">
                                            {player.name}
                                            {player.isDealer && (
                                                <Badge className="bg-yellow-500 text-black text-xs">
                                                    D
                                                </Badge>
                                            )}
                                            {player.isSmallBlind && (
                                                <Badge className="bg-blue-500 text-xs">
                                                    SB
                                                </Badge>
                                            )}
                                            {player.isBigBlind && (
                                                <Badge className="bg-red-500 text-xs">
                                                    BB
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-neon-green">
                                            Chips: $
                                            {player.chips.toLocaleString()}
                                        </div>
                                        {player.currentBet > 0 && (
                                            <div className="text-neon-pink text-sm">
                                                Apostou: ${player.currentBet}
                                            </div>
                                        )}
                                        {player.isFolded && (
                                            <Badge className="bg-gray-500">
                                                Foldou
                                            </Badge>
                                        )}
                                        {player.isAllIn && (
                                            <Badge className="bg-purple-500">
                                                All-in
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Cartas do Jogador */}
                                {player.cards.length > 0 && (
                                    <div className="mt-2 flex gap-1">
                                        {player.cards.map((card, cardIndex) => (
                                            <div
                                                key={cardIndex}
                                                className="bg-white text-black p-1 rounded text-xs font-bold w-8 h-10 flex items-center justify-center"
                                            >
                                                {gameState.gamePhase ===
                                                    "showdown" ||
                                                (index ===
                                                    gameState.activePlayerIndex &&
                                                    !isCurrentPlayerBot)
                                                    ? `${card.rank}${card.suit}`
                                                    : "?"}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Controles do Jogador */}
            {currentPlayer &&
                !isCurrentPlayerBot &&
                gameState.gamePhase !== "ended" && (
                    <Card className="neon-card glow-cyan">
                        <CardHeader>
                            <CardTitle>
                                Sua vez, {currentPlayer.name}!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {availableActions.includes("fold") && (
                                    <Button
                                        onClick={() =>
                                            handlePlayerAction({
                                                type: "fold",
                                                playerId: currentPlayer.id,
                                            })
                                        }
                                        variant="destructive"
                                        disabled={isProcessing}
                                    >
                                        Fold
                                    </Button>
                                )}

                                {availableActions.includes("check") && (
                                    <Button
                                        onClick={() =>
                                            handlePlayerAction({
                                                type: "check",
                                                playerId: currentPlayer.id,
                                            })
                                        }
                                        className="neon-button bg-blue-600 hover:bg-blue-700"
                                        disabled={isProcessing}
                                    >
                                        Check
                                    </Button>
                                )}

                                {availableActions.includes("call") && (
                                    <Button
                                        onClick={() =>
                                            handlePlayerAction({
                                                type: "call",
                                                playerId: currentPlayer.id,
                                            })
                                        }
                                        className="neon-button bg-green-600 hover:bg-green-700"
                                        disabled={isProcessing}
                                    >
                                        Call $
                                        {gameState.currentBet -
                                            currentPlayer.currentBet}
                                    </Button>
                                )}

                                {availableActions.includes("raise") && (
                                    <div className="flex items-center gap-2">
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                Raise: ${raiseAmount[0]}
                                            </div>
                                            <Slider
                                                value={raiseAmount}
                                                onValueChange={setRaiseAmount}
                                                max={currentPlayer.chips}
                                                min={bigBlind}
                                                step={bigBlind}
                                                className="w-32"
                                            />
                                        </div>
                                        <Button
                                            onClick={() =>
                                                handlePlayerAction({
                                                    type: "raise",
                                                    amount: raiseAmount[0],
                                                    playerId: currentPlayer.id,
                                                })
                                            }
                                            className="neon-button bg-orange-600 hover:bg-orange-700"
                                            disabled={isProcessing}
                                        >
                                            Raise
                                        </Button>
                                    </div>
                                )}

                                {availableActions.includes("all-in") && (
                                    <Button
                                        onClick={() =>
                                            handlePlayerAction({
                                                type: "all-in",
                                                playerId: currentPlayer.id,
                                            })
                                        }
                                        className="neon-button bg-purple-600 hover:bg-purple-700"
                                        disabled={isProcessing}
                                    >
                                        All-in (${currentPlayer.chips})
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

            {/* Controles do Diretor */}
            <Card className="neon-card">
                <CardHeader>
                    <CardTitle>Controles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-wrap">
                        <Button onClick={handleNewHand} className="neon-button">
                            Nova Mão
                        </Button>
                        <Button
                            onClick={handleNextStreet}
                            variant="outline"
                            className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
                            disabled={gameState.gamePhase === "ended"}
                        >
                            Próxima Fase (
                            {gameState.gamePhase === "preflop"
                                ? "Flop"
                                : gameState.gamePhase === "flop"
                                ? "Turn"
                                : gameState.gamePhase === "turn"
                                ? "River"
                                : gameState.gamePhase === "river"
                                ? "Showdown"
                                : "Fim"}
                            )
                        </Button>
                        {engine && (
                            <Button
                                onClick={() => {
                                    const success = engine.addBot(
                                        `Bot-${Date.now()}`,
                                        2000
                                    );
                                    if (success) {
                                        setGameState({
                                            ...engine.getGameState(),
                                        });
                                    }
                                }}
                                variant="outline"
                                size="sm"
                                disabled={gameState.players.length >= 9}
                            >
                                Adicionar Bot
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Status da Mesa */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">Jogadores</div>
                        <div className="text-2xl font-bold text-neon-cyan">
                            {
                                gameState.players.filter((p) => !p.isFolded)
                                    .length
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">Pot</div>
                        <div className="text-2xl font-bold text-neon-green">
                            ${gameState.pot.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">Fase</div>
                        <div className="text-2xl font-bold text-neon-pink">
                            {gameState.gamePhase.toUpperCase()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">Mão</div>
                        <div className="text-2xl font-bold text-neon-purple">
                            #{gameState.round}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
