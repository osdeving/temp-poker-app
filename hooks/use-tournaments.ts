'use client';

import { useState, useEffect } from 'react';
import { Tournament, defaultBlindStructure } from '@/lib/tournament';

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load tournaments from localStorage
    const stored = localStorage.getItem('poker-tournaments');
    if (stored) {
      const parsedTournaments = JSON.parse(stored).map((t: any) => ({
        ...t,
        startTime: new Date(t.startTime),
      }));
      setTournaments(parsedTournaments);
    }
    setIsLoading(false);
  }, []);

  const saveTournaments = (newTournaments: Tournament[]) => {
    localStorage.setItem('poker-tournaments', JSON.stringify(newTournaments));
    setTournaments(newTournaments);
  };

  const createTournament = (tournamentData: Omit<Tournament, 'id' | 'registeredPlayers' | 'currentLevel' | 'timeRemaining' | 'prizePool'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: Math.random().toString(36).substr(2, 9),
      registeredPlayers: [],
      currentLevel: 0,
      timeRemaining: tournamentData.blindLevels[0]?.duration * 60 || 1200,
      prizePool: 0,
    };

    const updatedTournaments = [...tournaments, newTournament];
    saveTournaments(updatedTournaments);
    return newTournament;
  };

  const registerPlayer = (tournamentId: string, playerId: string) => {
    const updatedTournaments = tournaments.map(tournament => {
      if (tournament.id === tournamentId && 
          !tournament.registeredPlayers.includes(playerId) &&
          tournament.registeredPlayers.length < tournament.maxPlayers) {
        return {
          ...tournament,
          registeredPlayers: [...tournament.registeredPlayers, playerId],
          prizePool: tournament.prizePool + tournament.buyIn,
        };
      }
      return tournament;
    });
    saveTournaments(updatedTournaments);
  };

  const unregisterPlayer = (tournamentId: string, playerId: string) => {
    const updatedTournaments = tournaments.map(tournament => {
      if (tournament.id === tournamentId) {
        return {
          ...tournament,
          registeredPlayers: tournament.registeredPlayers.filter(id => id !== playerId),
          prizePool: Math.max(0, tournament.prizePool - tournament.buyIn),
        };
      }
      return tournament;
    });
    saveTournaments(updatedTournaments);
  };

  const updateTournamentStatus = (tournamentId: string, status: Tournament['status']) => {
    const updatedTournaments = tournaments.map(tournament => {
      if (tournament.id === tournamentId) {
        return { ...tournament, status };
      }
      return tournament;
    });
    saveTournaments(updatedTournaments);
  };

  const updateTournamentClock = (tournamentId: string, currentLevel: number, timeRemaining: number) => {
    const updatedTournaments = tournaments.map(tournament => {
      if (tournament.id === tournamentId) {
        return { ...tournament, currentLevel, timeRemaining };
      }
      return tournament;
    });
    saveTournaments(updatedTournaments);
  };

  return {
    tournaments,
    isLoading,
    createTournament,
    registerPlayer,
    unregisterPlayer,
    updateTournamentStatus,
    updateTournamentClock,
  };
};