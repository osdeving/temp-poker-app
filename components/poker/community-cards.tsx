"use client";

import { Card as CardType } from "@/lib/poker-engine";
import { PlayingCard } from "./poker-cards";

interface CommunityCardsProps {
    cards: CardType[];
    className?: string;
}

export function CommunityCards({ cards, className = "" }: CommunityCardsProps) {
    return (
        <div className={`relative z-10 ${className}`}>
            <div className="flex justify-center items-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                    const card = cards[index];
                    return (
                        <div key={index} className="w-12 h-16">
                            {card ? (
                                <PlayingCard
                                    card={card}
                                    size="sm"
                                    className="transition-all duration-300 hover:shadow-xl hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full border-2 border-dashed border-gray-400 rounded-lg bg-gray-100/20 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                        ?
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
