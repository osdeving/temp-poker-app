'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTournaments } from '@/hooks/use-tournaments';
import { useAuth } from '@/hooks/use-auth';
import { Tournament } from '@/lib/tournament';
import TournamentClock from '@/components/tournament/tournament-clock';
import Navbar from '@/components/layout/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, DollarSign, Trophy, Calendar } from 'lucide-react';

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const { tournaments, updateTournamentClock, updateTournamentStatus } = useTournaments();
  const { auth } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    const foundTournament = tournaments.find(t => t.id === params.id);
    setTournament(foundTournament || null);
  }, [tournaments, params.id]);

  if (!auth.user) {
    router.push('/');
    return null;
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Tournament Not Found</h1>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isDirector = tournament.createdBy === auth.user.id;
  const isRegistered = tournament.registeredPlayers.includes(auth.user.id);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-muted-foreground mb-4">{tournament.description}</p>
              {isDirector && (
                <Badge variant="secondary" className="mb-2">Tournament Director</Badge>
              )}
              {isRegistered && !isDirector && (
                <Badge variant="default" className="mb-2">Registered</Badge>
              )}
            </div>
            <Badge className={`${
              tournament.status === 'upcoming' ? 'bg-blue-500' :
              tournament.status === 'running' ? 'bg-green-500' :
              tournament.status === 'paused' ? 'bg-yellow-500' :
              'bg-gray-500'
            } text-white`}>
              {tournament.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tournament Clock */}
          <div className="lg:col-span-2">
            <TournamentClock
              tournament={tournament}
              onUpdateClock={updateTournamentClock}
              onUpdateStatus={updateTournamentStatus}
              isDirector={isDirector}
            />
          </div>

          {/* Tournament Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tournament Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Start Time</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(tournament.startTime)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium">Buy-in</div>
                    <div className="text-sm text-muted-foreground">
                      ${tournament.buyIn}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <div>
                    <div className="font-medium">Prize Pool</div>
                    <div className="text-sm text-muted-foreground">
                      ${tournament.prizePool.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Players</div>
                    <div className="text-sm text-muted-foreground">
                      {tournament.registeredPlayers.length} / {tournament.maxPlayers}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registered Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {tournament.registeredPlayers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No players registered yet</p>
                  ) : (
                    tournament.registeredPlayers.map((playerId, index) => (
                      <div key={playerId} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">Player {index + 1}</span>
                        {playerId === auth.user?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}