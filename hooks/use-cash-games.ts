"use client";

import {
    CashGame,
    CashGameLobby,
    CashGamePlayer,
    generateHandId,
} from "@/lib/cash-game";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "temp-poker-app-cash-games-v1";

export function useCashGames() {
    const [cashGames, setCashGames] = useState<CashGame[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load cash games from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsedGames = JSON.parse(stored).map((game: any) => ({
                    ...game,
                    createdAt: new Date(game.createdAt),
                }));
                setCashGames(parsedGames);
            }
        } catch (error) {
            console.error("Error loading cash games:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save cash games to localStorage
    const saveCashGames = useCallback((games: CashGame[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
            setCashGames(games);
        } catch (error) {
            console.error("Error saving cash games:", error);
        }
    }, []);

    // Create a new cash game
    const createCashGame = useCallback(
        (gameData: Partial<CashGame>, createdBy: string): CashGame => {
            const newGame: CashGame = {
                id: `cashgame_${Date.now()}_${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                name: gameData.name || "Cash Game",
                type: gameData.type || "texas-holdem",
                gameMode: gameData.gameMode || "cash",
                smallBlind: gameData.smallBlind || 1,
                bigBlind: gameData.bigBlind || 2,
                minBuyIn: gameData.minBuyIn || 40,
                maxBuyIn: gameData.maxBuyIn || 200,
                maxPlayers: gameData.maxPlayers || 6,
                currentPlayers: 0,
                players: [],
                isPrivate: gameData.isPrivate || false,
                password: gameData.password,
                createdBy,
                createdAt: new Date(),
                status: "waiting",
            };

            const updatedGames = [...cashGames, newGame];
            saveCashGames(updatedGames);
            return newGame;
        },
        [cashGames, saveCashGames]
    );

    // Join a cash game
    const joinCashGame = useCallback(
        (
            gameId: string,
            playerId: string,
            playerName: string,
            buyInAmount: number
        ) => {
            const gameIndex = cashGames.findIndex((g) => g.id === gameId);
            if (gameIndex === -1) return false;

            const game = { ...cashGames[gameIndex] };

            // Check if player already in game
            if (game.players.some((p) => p.id === playerId)) return false;

            // Check if game is full
            if (game.players.length >= game.maxPlayers) return false;

            // Check buy-in amount
            if (buyInAmount < game.minBuyIn || buyInAmount > game.maxBuyIn)
                return false;

            // Find available seat
            const occupiedSeats = game.players.map((p) => p.seatPosition);
            let seatPosition = 0;
            for (let i = 0; i < game.maxPlayers; i++) {
                if (!occupiedSeats.includes(i)) {
                    seatPosition = i;
                    break;
                }
            }

            const newPlayer: CashGamePlayer = {
                id: playerId,
                name: playerName,
                chipCount: buyInAmount,
                seatPosition,
                isConnected: true,
                isReady: false,
                currentBet: 0,
                hasActed: false,
            };

            game.players.push(newPlayer);
            game.currentPlayers = game.players.length;

            // Start game if minimum players (2) are ready
            if (game.players.length >= 2 && game.status === "waiting") {
                game.status = "active";
                // Initialize first hand
                game.currentHand = {
                    handId: generateHandId(),
                    dealerPosition: 0,
                    smallBlindPosition: 1 % game.players.length,
                    bigBlindPosition: 2 % game.players.length,
                    communityCards: [],
                    pot: 0,
                    currentBet: game.bigBlind,
                    activePlayerPosition: 3 % game.players.length,
                    stage: "preflop",
                    sidePots: [],
                };

                // Post blinds
                game.players[game.currentHand.smallBlindPosition].chipCount -=
                    game.smallBlind;
                game.players[game.currentHand.smallBlindPosition].currentBet =
                    game.smallBlind;
                game.players[game.currentHand.bigBlindPosition].chipCount -=
                    game.bigBlind;
                game.players[game.currentHand.bigBlindPosition].currentBet =
                    game.bigBlind;
                game.currentHand.pot = game.smallBlind + game.bigBlind;
            }

            const updatedGames = [...cashGames];
            updatedGames[gameIndex] = game;
            saveCashGames(updatedGames);
            return true;
        },
        [cashGames, saveCashGames]
    );

    // Leave a cash game
    const leaveCashGame = useCallback(
        (gameId: string, playerId: string) => {
            const gameIndex = cashGames.findIndex((g) => g.id === gameId);
            if (gameIndex === -1) return false;

            const game = { ...cashGames[gameIndex] };
            game.players = game.players.filter((p) => p.id !== playerId);
            game.currentPlayers = game.players.length;

            // End game if no players left
            if (game.players.length === 0) {
                game.status = "finished";
            } else if (game.players.length === 1) {
                game.status = "waiting";
                game.currentHand = undefined;
            }

            const updatedGames = [...cashGames];
            updatedGames[gameIndex] = game;
            saveCashGames(updatedGames);
            return true;
        },
        [cashGames, saveCashGames]
    );

    // Player action (fold, call, raise, etc.)
    const playerAction = useCallback(
        (
            gameId: string,
            playerId: string,
            action: CashGamePlayer["action"],
            amount?: number
        ) => {
            const gameIndex = cashGames.findIndex((g) => g.id === gameId);
            if (gameIndex === -1) return false;

            const game = { ...cashGames[gameIndex] };
            if (!game.currentHand) return false;

            const playerIndex = game.players.findIndex(
                (p) => p.id === playerId
            );
            if (playerIndex === -1) return false;

            const player = game.players[playerIndex];

            // Validate if it's player's turn
            if (game.currentHand.activePlayerPosition !== player.seatPosition)
                return false;

            // Process action
            switch (action) {
                case "fold":
                    player.action = "fold";
                    player.hasActed = true;
                    break;
                case "call":
                    const callAmount =
                        game.currentHand.currentBet - player.currentBet;
                    player.chipCount -= callAmount;
                    player.currentBet = game.currentHand.currentBet;
                    game.currentHand.pot += callAmount;
                    player.action = "call";
                    player.hasActed = true;
                    break;
                case "raise":
                    if (amount && amount > game.currentHand.currentBet) {
                        const totalBet = amount;
                        const additionalAmount = totalBet - player.currentBet;
                        player.chipCount -= additionalAmount;
                        player.currentBet = totalBet;
                        game.currentHand.currentBet = totalBet;
                        game.currentHand.pot += additionalAmount;
                        player.action = "raise";
                        player.hasActed = true;

                        // Reset other players' hasActed status for the new betting round
                        game.players.forEach((p, i) => {
                            if (i !== playerIndex && p.action !== "fold") {
                                p.hasActed = false;
                            }
                        });
                    }
                    break;
                case "check":
                    if (player.currentBet === game.currentHand.currentBet) {
                        player.action = "check";
                        player.hasActed = true;
                    }
                    break;
                case "all-in":
                    const allInAmount = player.chipCount + player.currentBet;
                    game.currentHand.pot += player.chipCount;
                    player.currentBet = allInAmount;
                    player.chipCount = 0;
                    player.action = "all-in";
                    player.hasActed = true;
                    break;
            }

            // Move to next player
            const activePlayers = game.players.filter(
                (p) => p.action !== "fold"
            );
            let nextPosition = (player.seatPosition + 1) % game.maxPlayers;
            let attempts = 0;

            while (attempts < game.maxPlayers) {
                const nextPlayer = game.players.find(
                    (p) => p.seatPosition === nextPosition
                );
                if (nextPlayer && nextPlayer.action !== "fold") {
                    game.currentHand.activePlayerPosition = nextPosition;
                    break;
                }
                nextPosition = (nextPosition + 1) % game.maxPlayers;
                attempts++;
            }

            // Check if betting round is complete
            const playersInHand = game.players.filter(
                (p) => p.action !== "fold"
            );
            const allPlayersActed = playersInHand.every((p) => p.hasActed);
            const allBetsEqual = playersInHand.every(
                (p) =>
                    p.currentBet === (game.currentHand?.currentBet || 0) ||
                    p.chipCount === 0
            );

            if (allPlayersActed && allBetsEqual) {
                // Move to next stage
                const stages: Array<
                    "preflop" | "flop" | "turn" | "river" | "showdown"
                > = ["preflop", "flop", "turn", "river", "showdown"];
                const currentStageIndex = stages.indexOf(
                    game.currentHand.stage
                );

                if (currentStageIndex < stages.length - 1) {
                    game.currentHand.stage = stages[currentStageIndex + 1];
                    game.currentHand.currentBet = 0;

                    // Reset players for new betting round
                    game.players.forEach((p) => {
                        if (p.action !== "fold") {
                            p.currentBet = 0;
                            p.hasActed = false;
                            p.action = undefined;
                        }
                    });

                    // Add community cards
                    switch (game.currentHand.stage) {
                        case "flop":
                            game.currentHand.communityCards = [
                                "A♠",
                                "K♥",
                                "Q♦",
                            ];
                            break;
                        case "turn":
                            game.currentHand.communityCards.push("J♣");
                            break;
                        case "river":
                            game.currentHand.communityCards.push("10♠");
                            break;
                    }

                    // Set first active player for new round
                    game.currentHand.activePlayerPosition =
                        game.currentHand.smallBlindPosition;
                }
            }

            const updatedGames = [...cashGames];
            updatedGames[gameIndex] = game;
            saveCashGames(updatedGames);
            return true;
        },
        [cashGames, saveCashGames]
    );

    // Add a bot to a cash game
    const addBot = useCallback(
        (gameId: string) => {
            const gameIndex = cashGames.findIndex((g) => g.id === gameId);
            if (gameIndex === -1) return false;

            const game = { ...cashGames[gameIndex] };

            // Check if game is full
            if (game.players.length >= game.maxPlayers) return false;

            // Create bot player
            const botNames = [
                "AI-Crusher",
                "BluffMaster",
                "TightPlayer",
                "Aggressive",
                "Calculator",
            ];
            const botAvatars = ["🤖", "🎭", "🛡️", "⚡", "🧮"];
            const usedNames = game.players.map((p) => p.name);
            const availableBots = botNames.filter(
                (name) => !usedNames.includes(name)
            );

            if (availableBots.length === 0) return false;

            const botName = availableBots[0];
            const botIndex = botNames.indexOf(botName);
            const botId = `bot_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 5)}`;

            // Find available seat
            const occupiedSeats = game.players.map((p) => p.seatPosition);
            let seatPosition = 0;
            for (let i = 0; i < game.maxPlayers; i++) {
                if (!occupiedSeats.includes(i)) {
                    seatPosition = i;
                    break;
                }
            }

            const buyInAmount =
                Math.floor(Math.random() * (game.maxBuyIn - game.minBuyIn)) +
                game.minBuyIn;

            const botPlayer: CashGamePlayer = {
                id: botId,
                name: botName,
                chipCount: buyInAmount,
                seatPosition,
                isConnected: true,
                isReady: true,
                currentBet: 0,
                hasActed: false,
                isBot: true,
            };

            game.players.push(botPlayer);
            game.currentPlayers = game.players.length;

            // Start game if minimum players (2) are ready
            if (game.players.length >= 2 && game.status === "waiting") {
                game.status = "active";
                // Initialize first hand
                game.currentHand = {
                    handId: generateHandId(),
                    dealerPosition: 0,
                    smallBlindPosition: 1 % game.players.length,
                    bigBlindPosition: 2 % game.players.length,
                    communityCards: [],
                    pot: 0,
                    currentBet: game.bigBlind,
                    activePlayerPosition: 3 % game.players.length,
                    stage: "preflop",
                    sidePots: [],
                };

                // Post blinds
                game.players[game.currentHand.smallBlindPosition].chipCount -=
                    game.smallBlind;
                game.players[game.currentHand.smallBlindPosition].currentBet =
                    game.smallBlind;
                game.players[game.currentHand.bigBlindPosition].chipCount -=
                    game.bigBlind;
                game.players[game.currentHand.bigBlindPosition].currentBet =
                    game.bigBlind;
                game.currentHand.pot = game.smallBlind + game.bigBlind;
            }

            const updatedGames = [...cashGames];
            updatedGames[gameIndex] = game;
            saveCashGames(updatedGames);
            return true;
        },
        [cashGames, saveCashGames]
    );

    // Get lobby information
    const getLobby = useCallback((): CashGameLobby => {
        const availableTables = cashGames.filter(
            (g) =>
                g.status === "waiting" ||
                (g.status === "active" && g.currentPlayers < g.maxPlayers)
        );

        const activePlayers = cashGames.reduce(
            (total, game) => total + game.currentPlayers,
            0
        );

        return {
            totalTables: cashGames.length,
            activePlayers,
            availableTables,
            myTables: [], // Would need user context to determine this
        };
    }, [cashGames]);

    return {
        cashGames,
        isLoading,
        createCashGame,
        joinCashGame,
        leaveCashGame,
        playerAction,
        addBot,
        getLobby,
    };
}
