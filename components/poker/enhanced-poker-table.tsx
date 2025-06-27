"use client";

import { Card as CardType, Player } from "@/lib/poker-engine";
import { PokerTableBase } from "./poker-table-base";

interface EnhancedPokerTableProps {
    players: Player[];
    activePlayerIndex: number;
    dealerPosition: number;
    communityCards: CardType[];
    pot: number;
    currentBet: number;
    className?: string;
}

export function EnhancedPokerTable(props: EnhancedPokerTableProps) {
    return <PokerTableBase {...props} />;
}
