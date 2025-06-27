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
import { EnhancedPokerTable } from "./enhanced-poker-table";
import { ActionButtons } from "./poker-table-visual";

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

            {/* Mesa Principal Melhorada com Layout Integrado */}
            <Card className="neon-card">
                <CardContent className="p-6">
                    {/* Mesa de Poker Visual Melhorada com Pot e Cartas no Centro */}
                    <EnhancedPokerTable
                        players={gameState.players}
                        activePlayerIndex={gameState.activePlayerIndex}
                        dealerPosition={gameState.dealerPosition}
                        communityCards={gameState.communityCards}
                        pot={gameState.pot}
                        currentBet={gameState.currentBet}
                        className="mb-6"
                    />
                </CardContent>
            </Card>

            {/* Controles do Jogador com Visual Melhorado */}
            {currentPlayer &&
                !isCurrentPlayerBot &&
                gameState.gamePhase !== "ended" && (
                    <Card className="neon-card glow-cyan border-2 border-neon-cyan">
                        <CardHeader className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
                            <CardTitle className="text-center text-neon-cyan">
                                🎮 Sua vez, {currentPlayer.name}!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {/* Action Buttons Melhorados */}
                            <ActionButtons
                                availableActions={availableActions}
                                onAction={(action, amount) =>
                                    handlePlayerAction({
                                        type: action as any,
                                        amount,
                                        playerId: currentPlayer.id,
                                    })
                                }
                                currentBet={
                                    gameState.currentBet -
                                    currentPlayer.currentBet
                                }
                                playerChips={currentPlayer.chips}
                                bigBlind={bigBlind}
                                className="mb-4"
                            />

                            {/* Raise Slider */}
                            {availableActions.includes("raise") && (
                                <div className="bg-orange-900/20 p-4 rounded-lg border border-orange-500/50">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="text-sm text-orange-300">
                                                Valor do Raise: $
                                                {raiseAmount[0]}
                                            </div>
                                            <Slider
                                                value={raiseAmount}
                                                onValueChange={setRaiseAmount}
                                                max={currentPlayer.chips}
                                                min={bigBlind}
                                                step={bigBlind}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>Min: ${bigBlind}</span>
                                                <span>
                                                    Max: ${currentPlayer.chips}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                handlePlayerAction({
                                                    type: "raise",
                                                    amount: raiseAmount[0],
                                                    playerId: currentPlayer.id,
                                                })
                                            }
                                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3"
                                            disabled={isProcessing}
                                        >
                                            🚀 Raise ${raiseAmount[0]}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

            {/* Controles do Diretor */}
            <Card className="neon-card">
                <CardHeader>
                    <CardTitle>🎯 Controles da Mesa</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-wrap">
                        <Button
                            onClick={handleNewHand}
                            className="neon-button bg-green-600 hover:bg-green-700"
                        >
                            🆕 Nova Mão
                        </Button>
                        <Button
                            onClick={handleNextStreet}
                            variant="outline"
                            className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
                            disabled={gameState.gamePhase === "ended"}
                        >
                            ⏭️ Próxima Fase (
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
                                className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                            >
                                🤖 Adicionar Bot
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Status da Mesa Melhorado */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="neon-card bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-cyan-400">
                            👥 Jogadores Ativos
                        </div>
                        <div className="text-3xl font-bold text-neon-cyan">
                            {
                                gameState.players.filter((p) => !p.isFolded)
                                    .length
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card bg-gradient-to-br from-green-900/20 to-emerald-900/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-green-400">
                            💰 Pot Total
                        </div>
                        <div className="text-3xl font-bold text-neon-green">
                            ${gameState.pot.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card bg-gradient-to-br from-pink-900/20 to-rose-900/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-pink-400">
                            🎯 Fase Atual
                        </div>
                        <div className="text-2xl font-bold text-neon-pink">
                            {gameState.gamePhase.toUpperCase()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card bg-gradient-to-br from-purple-900/20 to-violet-900/20">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-purple-400">🃏 Mão #</div>
                        <div className="text-3xl font-bold text-neon-purple">
                            {gameState.round}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
