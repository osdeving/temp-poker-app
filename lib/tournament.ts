export interface BlindLevel {
    level: number;
    smallBlind: number;
    bigBlind: number;
    ante?: number;
    duration: number; // in minutes
}

export interface Player {
    id: string;
    name: string;
    chipCount: number;
    position?: number; // Final position when eliminated
    eliminatedAt?: Date;
    isEliminated: boolean;
}

export interface Tournament {
    id: string;
    name: string;
    description: string;
    buyIn: number;
    startTime: Date;
    status: "upcoming" | "running" | "paused" | "finished";
    maxPlayers: number;
    registeredPlayers: string[];
    players: Player[]; // Enhanced player tracking
    blindLevels: BlindLevel[];
    currentLevel: number;
    timeRemaining: number; // in seconds
    createdBy: string;
    prizePool: number;
    playerNames?: { [key: string]: string }; // For backward compatibility
    startingChips: number;
}

export const defaultBlindStructure: BlindLevel[] = [
    { level: 1, smallBlind: 25, bigBlind: 50, duration: 20 },
    { level: 2, smallBlind: 50, bigBlind: 100, duration: 20 },
    { level: 3, smallBlind: 75, bigBlind: 150, duration: 20 },
    { level: 4, smallBlind: 100, bigBlind: 200, duration: 20 },
    { level: 5, smallBlind: 150, bigBlind: 300, duration: 20 },
    { level: 6, smallBlind: 200, bigBlind: 400, duration: 20 },
    { level: 7, smallBlind: 300, bigBlind: 600, duration: 20 },
    { level: 8, smallBlind: 400, bigBlind: 800, duration: 20 },
    { level: 9, smallBlind: 500, bigBlind: 1000, duration: 20 },
    { level: 10, smallBlind: 600, bigBlind: 1200, duration: 20 },
];

export const formatChips = (amount: number): string => {
    if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
};

export const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
};
