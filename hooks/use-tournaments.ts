"use client";

import { Player, Tournament, defaultBlindStructure } from "@/lib/tournament";
import { useEffect, useState } from "react";

// Mock tournaments for testing
const createMockTournaments = (): Tournament[] => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return [
        {
            id: "mock-tournament-1",
            name: "Sunday Night Special",
            description: "Torneio semanal de domingo com buy-in baixo",
            buyIn: 50,
            startTime: tomorrow,
            maxPlayers: 100,
            blindLevels: defaultBlindStructure,
            status: "upcoming" as const,
            createdBy: "dev-user-123", // Match actual user ID
            registeredPlayers: ["dev-user-123", "player2"],
            players: [],
            currentLevel: 0,
            timeRemaining: 1200,
            prizePool: 100,
            startingChips: 10000,
        },
        {
            id: "mock-tournament-2",
            name: "Friday Freezeout",
            description: "Torneio freezeout sem recompra",
            buyIn: 100,
            startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
            maxPlayers: 50,
            blindLevels: defaultBlindStructure,
            status: "upcoming" as const,
            createdBy: "dev-user-123", // Match actual user ID
            registeredPlayers: ["dev-user-123"],
            players: [],
            currentLevel: 0,
            timeRemaining: 1200,
            prizePool: 100,
            startingChips: 10000,
        },
    ];
};

export const useTournaments = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Auto-save tournaments - DISABLED for debug
    // useAutoSave(tournaments, "temp-poker-app-tournaments-v2", 30000);

    useEffect(() => {
        // Limpar localStorage antigo para evitar conflitos
        const oldKey = "poker-tournaments";
        if (localStorage.getItem(oldKey)) {
            console.log("🔍 DEBUG: Removing old localStorage data");
            localStorage.removeItem(oldKey);
        }

        // Load tournaments from localStorage
        const stored = localStorage.getItem("temp-poker-app-tournaments-v2");
        console.log(
            "🔍 DEBUG useTournaments: stored data from new key:",
            stored
        );

        if (stored) {
            const parsedTournaments = JSON.parse(stored).map((t: any) => ({
                ...t,
                startTime: new Date(t.startTime),
            }));
            console.log(
                "🔍 DEBUG useTournaments: parsed tournaments:",
                parsedTournaments.map((t: any) => ({ id: t.id, name: t.name }))
            );
            setTournaments(parsedTournaments);
        } else {
            // Use mock tournaments when localStorage is empty
            console.log(
                "🔍 DEBUG: No stored data found, using mock tournaments"
            );
            const mockTournaments = createMockTournaments();
            console.log(
                "🔍 DEBUG: Mock tournaments created:",
                mockTournaments.map((t) => ({ id: t.id, name: t.name }))
            );
            setTournaments(mockTournaments);

            // Optionally save mock data to localStorage for persistence
            localStorage.setItem(
                "temp-poker-app-tournaments-v2",
                JSON.stringify(mockTournaments)
            );
        }
        setIsLoading(false);
        console.log("🔍 DEBUG useTournaments: loading finished");
    }, []);

    const saveTournaments = (newTournaments: Tournament[]) => {
        console.log(
            "🔍 DEBUG saveTournaments: Saving tournaments:",
            newTournaments.map((t) => ({ id: t.id, name: t.name }))
        );
        console.log(
            "🔍 DEBUG saveTournaments: Total tournaments to save:",
            newTournaments.length
        );

        const dataToSave = JSON.stringify(newTournaments);
        console.log("🔍 DEBUG saveTournaments: JSON size:", dataToSave.length);

        localStorage.setItem("temp-poker-app-tournaments-v2", dataToSave);

        // Verify it was saved
        const verifyStored = localStorage.getItem(
            "temp-poker-app-tournaments-v2"
        );
        console.log(
            "🔍 DEBUG saveTournaments: Verification - stored size:",
            verifyStored ? verifyStored.length : 0
        );

        setTournaments(newTournaments);
        console.log(
            "🔍 DEBUG saveTournaments: State updated with tournaments count:",
            newTournaments.length
        );
    };

    const createTournament = (
        tournamentData: Omit<
            Tournament,
            | "id"
            | "registeredPlayers"
            | "players"
            | "currentLevel"
            | "timeRemaining"
            | "prizePool"
        >
    ) => {
        const tournamentId = Math.random().toString(36).substring(2, 11);

        const newTournament: Tournament = {
            ...tournamentData,
            id: tournamentId,
            registeredPlayers: [],
            players: [],
            currentLevel: 0,
            timeRemaining: tournamentData.blindLevels[0]?.duration * 60 || 1200,
            prizePool: 0,
            startingChips: tournamentData.startingChips || 10000,
        };

        console.log(
            "🔍 DEBUG createTournament: New tournament created with ID:",
            tournamentId
        );
        console.log("🔍 DEBUG createTournament: Tournament data:", {
            id: newTournament.id,
            name: newTournament.name,
        });

        const updatedTournaments = [...tournaments, newTournament];
        saveTournaments(updatedTournaments);
        console.log(
            "🔍 DEBUG createTournament: Saved tournaments count:",
            updatedTournaments.length
        );
        return newTournament;
    };

    const registerPlayer = (tournamentId: string, playerId: string) => {
        const updatedTournaments = tournaments.map((tournament) => {
            if (
                tournament.id === tournamentId &&
                !tournament.registeredPlayers.includes(playerId) &&
                tournament.registeredPlayers.length < tournament.maxPlayers
            ) {
                const newPlayer: Player = {
                    id: playerId,
                    name:
                        playerId === "dev-user-123"
                            ? "You"
                            : `Player ${
                                  tournament.registeredPlayers.length + 1
                              }`,
                    chipCount: tournament.startingChips || 10000,
                    isEliminated: false,
                };

                return {
                    ...tournament,
                    registeredPlayers: [
                        ...tournament.registeredPlayers,
                        playerId,
                    ],
                    players: [...(tournament.players || []), newPlayer],
                    prizePool: tournament.prizePool + tournament.buyIn,
                };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const unregisterPlayer = (tournamentId: string, playerId: string) => {
        const updatedTournaments = tournaments.map((tournament) => {
            if (tournament.id === tournamentId) {
                return {
                    ...tournament,
                    registeredPlayers: tournament.registeredPlayers.filter(
                        (id) => id !== playerId
                    ),
                    prizePool: Math.max(
                        0,
                        tournament.prizePool - tournament.buyIn
                    ),
                };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const updateTournamentStatus = (
        tournamentId: string,
        status: Tournament["status"]
    ) => {
        const updatedTournaments = tournaments.map((tournament) => {
            if (tournament.id === tournamentId) {
                return { ...tournament, status };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const updateTournamentClock = (
        tournamentId: string,
        currentLevel: number,
        timeRemaining: number
    ) => {
        const updatedTournaments = tournaments.map((tournament) => {
            if (tournament.id === tournamentId) {
                return { ...tournament, currentLevel, timeRemaining };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const addPlayerManually = (tournamentId: string, playerName: string) => {
        // Create a fake player ID for manually added players
        const fakePlayerId = `manual-${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const updatedTournaments = tournaments.map((tournament) => {
            if (
                tournament.id === tournamentId &&
                tournament.registeredPlayers.length < tournament.maxPlayers
            ) {
                const newPlayer: Player = {
                    id: fakePlayerId,
                    name: playerName,
                    chipCount: tournament.startingChips || 10000,
                    isEliminated: false,
                };

                return {
                    ...tournament,
                    registeredPlayers: [
                        ...tournament.registeredPlayers,
                        fakePlayerId,
                    ],
                    players: [...(tournament.players || []), newPlayer],
                    prizePool: tournament.prizePool + tournament.buyIn,
                    // Store player names in a separate field for backward compatibility
                    playerNames: {
                        ...((tournament as any).playerNames || {}),
                        [fakePlayerId]: playerName,
                    },
                };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const eliminatePlayer = (tournamentId: string, playerId: string) => {
        const updatedTournaments = tournaments.map((tournament) => {
            if (tournament.id === tournamentId) {
                const activePlayers =
                    tournament.players?.filter((p) => !p.isEliminated) || [];
                const position = activePlayers.length;

                const updatedPlayers =
                    tournament.players?.map((player) => {
                        if (player.id === playerId) {
                            return {
                                ...player,
                                isEliminated: true,
                                position,
                                eliminatedAt: new Date(),
                            };
                        }
                        return player;
                    }) || [];

                return {
                    ...tournament,
                    players: updatedPlayers,
                };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const updatePlayerChips = (
        tournamentId: string,
        playerId: string,
        newChipCount: number
    ) => {
        const updatedTournaments = tournaments.map((tournament) => {
            if (tournament.id === tournamentId) {
                const updatedPlayers =
                    tournament.players?.map((player) => {
                        if (player.id === playerId) {
                            return { ...player, chipCount: newChipCount };
                        }
                        return player;
                    }) || [];

                return {
                    ...tournament,
                    players: updatedPlayers,
                };
            }
            return tournament;
        });
        saveTournaments(updatedTournaments);
    };

    const getRanking = (tournament: Tournament) => {
        if (!tournament.players) return [];

        const eliminated = tournament.players
            .filter((p) => p.isEliminated)
            .sort((a, b) => (b.position || 0) - (a.position || 0));

        const active = tournament.players
            .filter((p) => !p.isEliminated)
            .sort((a, b) => b.chipCount - a.chipCount);

        return [...active, ...eliminated];
    };

    return {
        tournaments,
        isLoading,
        createTournament,
        registerPlayer,
        unregisterPlayer,
        addPlayerManually,
        eliminatePlayer,
        updatePlayerChips,
        getRanking,
        updateTournamentStatus,
        updateTournamentClock,
    };
};
