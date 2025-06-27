"use client";

import { Card as CardType, Player } from "@/lib/poker-engine";
import { CommunityCards } from "./community-cards";
import { CurrentBetIndicator } from "./current-bet";
import { EmptySeat } from "./empty-seat";
import { PokerPlayer } from "./poker-player";
import { PokerPot } from "./poker-pot";

interface PokerTableBaseProps {
    players: Player[];
    activePlayerIndex: number;
    dealerPosition: number;
    communityCards: CardType[];
    pot: number;
    currentBet: number;
    className?: string;
}

export function PokerTableBase({
    players,
    activePlayerIndex,
    dealerPosition,
    communityCards,
    pot,
    currentBet,
    className = "",
}: PokerTableBaseProps) {
    // Posições dos jogadores para mesa de 8 lugares (layout padrão de poker)
    const tablePositions = [
        { x: 50, y: 8 }, // 1. Top center
        { x: 78, y: 18 }, // 2. Top right
        { x: 92, y: 50 }, // 3. Right center
        { x: 78, y: 82 }, // 4. Bottom right
        { x: 50, y: 92 }, // 5. Bottom center
        { x: 22, y: 82 }, // 6. Bottom left
        { x: 8, y: 50 }, // 7. Left center
        { x: 22, y: 18 }, // 8. Top left
    ];

    const getPlayerAtPosition = (positionIndex: number) => {
        return players[positionIndex] || null;
    };

    return (
        <div
            className={`relative w-full aspect-[4/3] max-w-5xl mx-auto ${className}`}
        >
            {/* Mesa principal (felt verde) com Tailwind */}
            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-green-800 via-green-600 to-green-700 border-8 border-yellow-500 shadow-2xl">
                {/* Efeito interno da mesa */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-green-700/50 to-green-900/30 shadow-inner"></div>

                {/* Área central da mesa */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {/* Pot - centralizado */}
                        <PokerPot amount={pot} className="" />

                        {/* Cartas comunitárias - abaixo do pot */}
                        <CommunityCards cards={communityCards} className="" />

                        {/* Indicador de aposta atual */}
                        <CurrentBetIndicator amount={currentBet} className="" />
                    </div>
                </div>
            </div>

            {/* Jogadores ao redor da mesa */}
            {tablePositions.map((pos, index) => {
                const player = getPlayerAtPosition(index);

                if (player) {
                    return (
                        <PokerPlayer
                            key={`player-${player.id}`}
                            player={player}
                            position={pos}
                            isActive={index === activePlayerIndex}
                            isDealer={index === dealerPosition}
                        />
                    );
                } else {
                    return (
                        <EmptySeat
                            key={`empty-${index}`}
                            position={pos}
                            seatNumber={index + 1}
                        />
                    );
                }
            })}
        </div>
    );
}
