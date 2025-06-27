"use client";

import { FadeIn, HoverGlow, SlideIn } from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import { NeonButton, NeonText, GlassCard } from "@/components/ui/glass";
import { Tournament } from "@/lib/tournament";
import { useState } from "react";
import PokerTable from "./poker-table-premium";

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
        "4♦",
        "3♣",
        "2♠",
    ];

    const handlePlayerAction = (action: string, amount?: number) => {
        console.log(`Player action: ${action}`, amount);
        // Implementar lógica das ações dos jogadores

        // Avançar para o próximo jogador
        const nextPlayerIndex = (activePlayerIndex + 1) % players.length;
        setActivePlayerIndex(nextPlayerIndex);

        // Atualizar chips se necessário
        if (action === "fold" || action === "call" || action === "raise") {
            // Implementar lógica de apostas
        }
    };

    const nextPhase = () => {
        const phases = [
            "preflop",
            "flop",
            "turn",
            "river",
            "showdown",
        ] as const;
        const currentIndex = phases.indexOf(gameState);

        if (currentIndex < phases.length - 1) {
            const nextPhase = phases[currentIndex + 1];
            setGameState(nextPhase);

            // Adicionar cartas comunitárias baseado na fase
            switch (nextPhase) {
                case "flop":
                    setCommunityCards(sampleCards.slice(0, 3));
                    break;
                case "turn":
                    setCommunityCards(sampleCards.slice(0, 4));
                    break;
                case "river":
                    setCommunityCards(sampleCards.slice(0, 5));
                    break;
                case "showdown":
                    // Revelar cartas dos jogadores
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
            <FadeIn>
                <GlassCard variant="crystal" className="text-center py-12">
                    <NeonText className="text-2xl font-bold mb-4">
                        🎮 Aguardando Jogadores
                    </NeonText>
                    <p className="text-gray-300 text-lg">
                        É necessário pelo menos 2 jogadores para começar uma
                        mesa.
                    </p>
                </GlassCard>
            </FadeIn>
        );
    }

    return (
        <SlideIn className="space-y-6">
            {/* Informações da Mesa */}
            <GlassCard variant="diamond" className="p-6">
                <div className="flex justify-between items-center">
                    <NeonText className="text-2xl font-bold">
                        🎯 Mesa Principal - {tournament.name}
                    </NeonText>
                    <div className="flex gap-6 text-sm">
                        <div className="text-center">
                            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold">
                                {gameState.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="text-center">
                            <div className="text-neon-green font-bold text-lg">
                                $
                                {tournament.blindLevels[tournament.currentLevel]
                                    ?.smallBlind || 25}
                                / $
                                {tournament.blindLevels[tournament.currentLevel]
                                    ?.bigBlind || 50}
                            </div>
                            <div className="text-gray-400 text-xs">BLINDS</div>
                        </div>
                        <div className="text-center">
                            <div className="text-neon-yellow font-bold text-lg">
                                ${pot.toLocaleString()}
                            </div>
                            <div className="text-gray-400 text-xs">POT</div>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Mesa de Poker */}
            <HoverGlow>
                <PokerTable
                    tournament={tournament}
                    players={players}
                    communityCards={communityCards}
                    pot={pot}
                    currentBet={currentBet}
                    isPlayerTurn={true}
                    onPlayerAction={handlePlayerAction}
                />
            </HoverGlow>

            {/* Controles do Diretor */}
            {isDirector && (
                <GlassCard variant="emerald" className="p-6">
                    <NeonText className="text-xl font-bold mb-4">
                        🎛️ Controles do Diretor
                    </NeonText>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <NeonButton
                            variant="primary"
                            onClick={nextPhase}
                            disabled={gameState === "showdown"}
                            className="w-full"
                        >
                            Próxima Fase
                        </NeonButton>
                        <NeonButton
                            variant="secondary"
                            onClick={newHand}
                            className="w-full"
                        >
                            Nova Mão
                        </NeonButton>
                        <NeonButton
                            variant="success"
                            onClick={() => setPot(pot + 100)}
                            className="w-full"
                        >
                            +$100 Pot
                        </NeonButton>
                        <NeonButton
                            variant="danger"
                            onClick={() => setPot(Math.max(0, pot - 100))}
                            className="w-full"
                        >
                            -$100 Pot
                        </NeonButton>
                    </div>
                </GlassCard>
            )}

            {/* Estatísticas da Mesa */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <GlassCard variant="sapphire" className="p-4 text-center">
                    <NeonText className="text-lg font-bold text-neon-cyan">
                        {players.length}
                    </NeonText>
                    <div className="text-gray-400 text-sm">
                        Jogadores na Mesa
                    </div>
                </GlassCard>

                <GlassCard variant="crystal" className="p-4 text-center">
                    <NeonText className="text-lg font-bold text-neon-green">
                        {communityCards.length}/5
                    </NeonText>
                    <div className="text-gray-400 text-sm">
                        Cartas Comunitárias
                    </div>
                </GlassCard>

                <GlassCard variant="diamond" className="p-4 text-center">
                    <NeonText className="text-lg font-bold text-neon-pink">
                        ${currentBet}
                    </NeonText>
                    <div className="text-gray-400 text-sm">Aposta Atual</div>
                </GlassCard>
            </div>
        </SlideIn>
    );
}
