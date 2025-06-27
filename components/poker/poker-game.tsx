"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tournament } from "@/lib/tournament";
import { useState } from "react";
import PokerTable from "./poker-table";

interface PokerGameProps {
    tournament: Tournament;
    isDirector: boolean;
    onUpdateChips: (playerId: string, chips: number) => void;
}

export default function PokerGame({
    tournament,
    isDirector,
    onUpdateChips,
}: PokerGameProps) {
    // Estados do jogo
    const [gameState, setGameState] = useState<
        "preflop" | "flop" | "turn" | "river" | "showdown"
    >("preflop");
    const [pot, setPot] = useState(0);
    const [currentBet, setCurrentBet] = useState(0);
    const [communityCards, setCommunityCards] = useState<string[]>([]);
    const [activePlayerIndex, setActivePlayerIndex] = useState(0);
    const [dealerPosition, setDealerPosition] = useState(0);

    // Simular jogadores da mesa (primeiros 9 do torneio)
    const activePlayers =
        tournament.players?.filter((p) => !p.isEliminated).slice(0, 9) || [];

    const players = activePlayers.map((player, index) => ({
        id: player.id,
        name: player.name,
        chips: player.chipCount || 0,
        isDealer: index === dealerPosition,
        isSmallBlind: index === (dealerPosition + 1) % activePlayers.length,
        isBigBlind: index === (dealerPosition + 2) % activePlayers.length,
        cards: ["?", "?"], // Cartas ocultas por padrão
        currentBet: 0,
        action: undefined,
        isActive: index === activePlayerIndex,
        position: index,
    }));

    // Cartas de exemplo para demonstração
    const sampleCards = [
        "A♠",
        "K♥",
        "Q♦",
        "J♣",
        "10♠",
        "9♥",
        "8♦",
        "7♣",
        "6♠",
        "5♥",
    ];

    const handlePlayerAction = (action: string, amount?: number) => {
        console.log(
            `Player action: ${action}`,
            amount ? `Amount: ${amount}` : ""
        );

        // Avançar para próximo jogador
        setActivePlayerIndex((prev) => (prev + 1) % players.length);

        // Simular lógica básica
        if (action === "raise" && amount) {
            setCurrentBet(amount);
            setPot((prev) => prev + amount);
        } else if (action === "call") {
            setPot((prev) => prev + currentBet);
        }
    };

    const nextStreet = () => {
        const states: Array<
            "preflop" | "flop" | "turn" | "river" | "showdown"
        > = ["preflop", "flop", "turn", "river", "showdown"];
        const currentIndex = states.indexOf(gameState);

        if (currentIndex < states.length - 1) {
            const nextState = states[currentIndex + 1];
            setGameState(nextState);

            // Adicionar cartas comunitárias
            switch (nextState) {
                case "flop":
                    setCommunityCards(sampleCards.slice(0, 3));
                    break;
                case "turn":
                    setCommunityCards(sampleCards.slice(0, 4));
                    break;
                case "river":
                    setCommunityCards(sampleCards.slice(0, 5));
                    break;
            }

            setCurrentBet(0);
            setActivePlayerIndex(0);
        }
    };

    const newHand = () => {
        setGameState("preflop");
        setPot(0);
        setCurrentBet(0);
        setCommunityCards([]);
        setActivePlayerIndex(0);
        setDealerPosition((prev) => (prev + 1) % players.length);
    };

    if (activePlayers.length < 2) {
        return (
            <Card className="neon-card">
                <CardContent className="text-center py-8">
                    <h3 className="text-lg font-semibold mb-2">
                        Aguardando Jogadores
                    </h3>
                    <p className="text-muted-foreground">
                        É necessário pelo menos 2 jogadores para começar uma
                        mesa.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Informações da Mesa */}
            <Card className="neon-card">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Mesa Principal - {tournament.name}</span>
                        <div className="flex gap-2">
                            <span className="text-sm text-neon-cyan">
                                Fase: {gameState.toUpperCase()}
                            </span>
                            <span className="text-sm text-neon-green">
                                Blinds: $
                                {tournament.blindLevels[tournament.currentLevel]
                                    ?.smallBlind || 25}
                                /$
                                {tournament.blindLevels[tournament.currentLevel]
                                    ?.bigBlind || 50}
                            </span>
                        </div>
                    </CardTitle>
                </CardHeader>
            </Card>

            {/* Mesa de Poker */}
            <PokerTable
                tournament={tournament}
                players={players}
                communityCards={communityCards}
                pot={pot}
                currentBet={currentBet}
                isPlayerTurn={true} // Por enquanto sempre true para demonstração
                onPlayerAction={handlePlayerAction}
            />

            {/* Controles do Diretor */}
            {isDirector && (
                <Card className="neon-card">
                    <CardHeader>
                        <CardTitle>Controles do Diretor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                onClick={nextStreet}
                                className="neon-button"
                                disabled={gameState === "showdown"}
                            >
                                Próxima Fase (
                                {gameState === "preflop"
                                    ? "Flop"
                                    : gameState === "flop"
                                    ? "Turn"
                                    : gameState === "turn"
                                    ? "River"
                                    : gameState === "river"
                                    ? "Showdown"
                                    : "Fim"}
                                )
                            </Button>
                            <Button
                                onClick={newHand}
                                variant="outline"
                                className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20"
                            >
                                Nova Mão
                            </Button>
                            <Button
                                onClick={() => {
                                    // Simular cartas reveladas para demonstração
                                    const updatedPlayers = players.map((p) => ({
                                        ...p,
                                        cards: [
                                            sampleCards[
                                                Math.floor(
                                                    Math.random() *
                                                        sampleCards.length
                                                )
                                            ],
                                            sampleCards[
                                                Math.floor(
                                                    Math.random() *
                                                        sampleCards.length
                                                )
                                            ],
                                        ],
                                    }));
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Revelar Cartas (Debug)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Informações da Mão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">
                            Jogadores Ativos
                        </div>
                        <div className="text-2xl font-bold text-neon-cyan">
                            {activePlayers.length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">Pot Total</div>
                        <div className="text-2xl font-bold text-neon-green">
                            ${pot.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="neon-card">
                    <CardContent className="p-4 text-center">
                        <div className="text-sm text-gray-400">Big Blind</div>
                        <div className="text-2xl font-bold text-neon-pink">
                            $
                            {tournament.blindLevels[tournament.currentLevel]
                                ?.bigBlind || 50}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
