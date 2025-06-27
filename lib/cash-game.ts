export interface CashGamePlayer {
    id: string;
    name: string;
    chipCount: number;
    seatPosition: number;
    isConnected: boolean;
    isReady: boolean;
    cards?: string[];
    currentBet: number;
    hasActed: boolean;
    action?: "fold" | "call" | "raise" | "check" | "all-in";
    lastAction?: string;
    isBot?: boolean;
}

export interface CashGame {
    id: string;
    name: string;
    type: "texas-holdem" | "omaha" | "seven-card-stud";
    gameMode: "cash" | "sit-n-go";
    smallBlind: number;
    bigBlind: number;
    minBuyIn: number;
    maxBuyIn: number;
    maxPlayers: number;
    currentPlayers: number;
    players: CashGamePlayer[];
    isPrivate: boolean;
    password?: string;
    createdBy: string;
    createdAt: Date;
    status: "waiting" | "active" | "paused" | "finished";
    currentHand?: {
        handId: string;
        dealerPosition: number;
        smallBlindPosition: number;
        bigBlindPosition: number;
        communityCards: string[];
        pot: number;
        currentBet: number;
        activePlayerPosition: number;
        stage: "preflop" | "flop" | "turn" | "river" | "showdown";
        sidePots: Array<{
            amount: number;
            eligiblePlayers: string[];
        }>;
    };
}

export interface CashGameLobby {
    totalTables: number;
    activePlayers: number;
    availableTables: CashGame[];
    myTables: CashGame[];
}

export const defaultCashGameSettings = {
    smallBlind: 1,
    bigBlind: 2,
    minBuyIn: 40, // 20x big blind
    maxBuyIn: 200, // 100x big blind
    maxPlayers: 8,
};

export const cashGameTypes = [
    {
        id: "texas-holdem",
        name: "Texas Hold'em",
        description: "Most popular poker variant",
        maxPlayers: 8,
    },
    {
        id: "omaha",
        name: "Omaha",
        description: "4 hole cards, use exactly 2",
        maxPlayers: 8,
    },
    {
        id: "seven-card-stud",
        name: "Seven Card Stud",
        description: "Classic poker variant",
        maxPlayers: 8,
    },
] as const;

// Utility functions
export const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
};

export const calculatePotOdds = (potSize: number, betSize: number): number => {
    return betSize / (potSize + betSize);
};

export const generateHandId = (): string => {
    return `hand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getNextActivePlayer = (
    players: CashGamePlayer[],
    currentPosition: number
): number => {
    const activePlayers = players.filter(
        (p) => p.isConnected && p.chipCount > 0
    );
    if (activePlayers.length === 0) return -1;

    let nextPosition = (currentPosition + 1) % players.length;
    let attempts = 0;

    while (attempts < players.length) {
        const player = players[nextPosition];
        if (player && player.isConnected && player.chipCount > 0) {
            return nextPosition;
        }
        nextPosition = (nextPosition + 1) % players.length;
        attempts++;
    }

    return -1;
};
