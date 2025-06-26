'use client';

import { Tournament } from '@/lib/tournament';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign, Trophy } from 'lucide-react';
import { formatChips } from '@/lib/tournament';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin?: (tournamentId: string) => void;
  onLeave?: (tournamentId: string) => void;
  onView?: (tournamentId: string) => void;
  isRegistered?: boolean;
  canRegister?: boolean;
}

export default function TournamentCard({
  tournament,
  onJoin,
  onLeave,
  onView,
  isRegistered = false,
  canRegister = true,
}: TournamentCardProps) {
  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card className="tournament-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{tournament.name}</CardTitle>
            <CardDescription className="mt-1">
              {tournament.description}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(tournament.status)} text-white`}>
            {tournament.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>Buy-in: ${tournament.buyIn}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span>Prize: {formatChips(tournament.prizePool)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>{formatDate(tournament.startTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <span>{tournament.registeredPlayers.length}/{tournament.maxPlayers}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {tournament.status === 'upcoming' && canRegister && (
            <>
              {isRegistered ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onLeave?.(tournament.id)}
                  className="flex-1"
                >
                  Leave
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => onJoin?.(tournament.id)}
                  disabled={tournament.registeredPlayers.length >= tournament.maxPlayers}
                  className="flex-1"
                >
                  {tournament.registeredPlayers.length >= tournament.maxPlayers ? 'Full' : 'Join'}
                </Button>
              )}
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(tournament.id)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}