'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useTournaments } from '@/hooks/use-tournaments';
import Navbar from '@/components/layout/navbar';
import TournamentCard from '@/components/tournament/tournament-card';
import CreateTournamentForm from '@/components/tournament/create-tournament-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { auth } = useAuth();
  const { 
    tournaments, 
    isLoading, 
    createTournament, 
    registerPlayer, 
    unregisterPlayer 
  } = useTournaments();
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!auth.user && !auth.isLoading) {
      router.push('/');
    }
  }, [auth.user, auth.isLoading, router]);

  if (auth.isLoading || !auth.user) {
    return <div>Loading...</div>;
  }

  const handleCreateTournament = (tournamentData: any) => {
    createTournament(tournamentData);
    setShowCreateForm(false);
  };

  const handleJoinTournament = (tournamentId: string) => {
    registerPlayer(tournamentId, auth.user!.id);
  };

  const handleLeaveTournament = (tournamentId: string) => {
    unregisterPlayer(tournamentId, auth.user!.id);
  };

  const handleViewTournament = (tournamentId: string) => {
    router.push(`/tournament/${tournamentId}`);
  };

  const myTournaments = tournaments.filter(t => 
    t.registeredPlayers.includes(auth.user!.id) || t.createdBy === auth.user!.id
  );
  
  const availableTournaments = tournaments.filter(t => 
    !t.registeredPlayers.includes(auth.user!.id) && 
    t.createdBy !== auth.user!.id &&
    t.status === 'upcoming'
  );

  const stats = {
    totalTournaments: tournaments.length,
    myTournaments: myTournaments.length,
    runningTournaments: tournaments.filter(t => t.status === 'running').length,
    totalPrizePool: tournaments.reduce((sum, t) => sum + t.prizePool, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCreateTournament={() => setShowCreateForm(true)} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {auth.user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your tournaments and join exciting poker competitions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTournaments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tournaments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.myTournaments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running Now</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.runningTournaments}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prize Pool</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalPrizePool.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tournament Tabs */}
        <Tabs defaultValue="my-tournaments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-tournaments">My Tournaments ({myTournaments.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({availableTournaments.length})</TabsTrigger>
            <TabsTrigger value="all">All Tournaments ({tournaments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="my-tournaments" className="space-y-4">
            {myTournaments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No tournaments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first tournament or join an existing one to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myTournaments.map(tournament => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onJoin={handleJoinTournament}
                    onLeave={handleLeaveTournament}
                    onView={handleViewTournament}
                    isRegistered={tournament.registeredPlayers.includes(auth.user!.id)}
                    canRegister={tournament.createdBy !== auth.user!.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            {availableTournaments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No available tournaments</h3>
                  <p className="text-muted-foreground">
                    Check back later for new tournaments to join.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableTournaments.map(tournament => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onJoin={handleJoinTournament}
                    onView={handleViewTournament}
                    isRegistered={false}
                    canRegister={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tournaments.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onJoin={handleJoinTournament}
                  onLeave={handleLeaveTournament}
                  onView={handleViewTournament}
                  isRegistered={tournament.registeredPlayers.includes(auth.user!.id)}
                  canRegister={tournament.createdBy !== auth.user!.id}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Tournament Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Tournament</DialogTitle>
          </DialogHeader>
          <CreateTournamentForm
            onSubmit={handleCreateTournament}
            createdBy={auth.user.id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}