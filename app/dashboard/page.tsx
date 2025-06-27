"use client";

import Navbar from "@/components/layout/navbar";
import CreateTournamentForm from "@/components/tournament/create-tournament-form";
import TournamentCard from "@/components/tournament/tournament-card";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { NeonText, UltraGlassCard } from "@/components/ui/neon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useTournaments } from "@/hooks/use-tournaments";
import { Calendar, DollarSign, Trophy, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const router = useRouter();
    const { auth } = useAuth();
    const {
        tournaments,
        isLoading,
        createTournament,
        registerPlayer,
        unregisterPlayer,
    } = useTournaments();
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        if (!auth.user && !auth.isLoading) {
            router.push("/");
        }
    }, [auth.user, auth.isLoading, router]);

    if (auth.isLoading || !auth.user) {
        return <div>Loading...</div>;
    }

    const handleCreateTournament = (tournamentData: any) => {
        console.log(
            "🔍 DEBUG handleCreateTournament: Creating tournament with data:",
            tournamentData
        );
        const newTournament = createTournament(tournamentData);
        console.log(
            "🔍 DEBUG handleCreateTournament: Tournament created:",
            newTournament
        );
        setShowCreateForm(false);

        // Optional: Auto-navigate to the new tournament
        // router.push(`/tournament/${newTournament.id}`);
    };

    const handleJoinTournament = (tournamentId: string) => {
        registerPlayer(tournamentId, auth.user!.id);
    };

    const handleLeaveTournament = (tournamentId: string) => {
        unregisterPlayer(tournamentId, auth.user!.id);
    };

    const handleViewTournament = (tournamentId: string) => {
        console.log(
            "🔍 DEBUG dashboard: Navigating to tournament ID:",
            tournamentId
        );
        console.log(
            "🔍 DEBUG dashboard: Available tournaments:",
            tournaments.map((t) => ({ id: t.id, name: t.name }))
        );
        router.push(`/tournament/${tournamentId}`);
    };

    // Debug function to clear localStorage
    const handleClearStorage = () => {
        localStorage.clear();
        window.location.reload();
    };

    const myTournaments = tournaments.filter(
        (t) =>
            t.registeredPlayers.includes(auth.user!.id) ||
            t.createdBy === auth.user!.id
    );

    const availableTournaments = tournaments.filter(
        (t) =>
            !t.registeredPlayers.includes(auth.user!.id) &&
            t.createdBy !== auth.user!.id &&
            t.status === "upcoming"
    );

    const stats = {
        totalTournaments: tournaments.length,
        myTournaments: myTournaments.length,
        runningTournaments: tournaments.filter((t) => t.status === "running")
            .length,
        totalPrizePool: tournaments.reduce((sum, t) => sum + t.prizePool, 0),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar onCreateTournament={() => setShowCreateForm(true)} />

            <div className="container mx-auto px-4 py-8">
                <FadeIn>
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <NeonText
                                color="cyan"
                                className="text-4xl font-bold"
                            >
                                Welcome back, {auth.user.name}! 🎲
                            </NeonText>
                            {/* DEBUG: Temporary button to test mock tournaments */}
                            <Button
                                onClick={handleClearStorage}
                                variant="destructive"
                                size="sm"
                                className="hidden"
                            >
                                🗑️ Clear Storage (Debug)
                            </Button>
                        </div>
                        <p className="text-gray-300 text-lg">
                            Manage your tournaments and join exciting poker
                            competitions.
                        </p>
                    </div>
                </FadeIn>

                {/* Stats Cards */}
                <SlideIn className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <UltraGlassCard variant="crystal" className="p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-gray-300">
                                Total Tournaments
                            </h3>
                            <Trophy className="h-4 w-4 text-pink-400" />
                        </div>
                        <div className="text-2xl font-bold text-pink-400">
                            {stats.totalTournaments}
                        </div>
                    </UltraGlassCard>

                    <UltraGlassCard variant="diamond" className="p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-gray-300">
                                My Tournaments
                            </h3>
                            <Users className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div className="text-2xl font-bold text-cyan-400">
                            {stats.myTournaments}
                        </div>
                    </UltraGlassCard>

                    <UltraGlassCard variant="sapphire" className="p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-gray-300">
                                Running Now
                            </h3>
                            <Calendar className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                            {stats.runningTournaments}
                        </div>
                    </UltraGlassCard>

                    <UltraGlassCard variant="emerald" className="p-6">
                        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-gray-300">
                                Total Prize Pool
                            </h3>
                            <DollarSign className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="text-2xl font-bold text-green-400">
                            ${stats.totalPrizePool.toLocaleString()}
                        </div>
                    </UltraGlassCard>
                </SlideIn>

                {/* Tournament Tabs */}
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList className="w-full">
                        {/* Mobile: Show only All tab */}
                        <div className="sm:hidden w-full">
                            <TabsTrigger value="all" className="w-full">
                                All ({tournaments.length})
                            </TabsTrigger>
                        </div>

                        {/* Desktop: Show all tabs */}
                        <div className="hidden sm:flex w-full">
                            <TabsTrigger
                                value="my-tournaments"
                                className="flex-1"
                            >
                                My Tournaments ({myTournaments.length})
                            </TabsTrigger>
                            <TabsTrigger value="available" className="flex-1">
                                Available ({availableTournaments.length})
                            </TabsTrigger>
                            <TabsTrigger value="all" className="flex-1">
                                All Tournaments ({tournaments.length})
                            </TabsTrigger>
                        </div>
                    </TabsList>

                    <TabsContent value="my-tournaments" className="space-y-4">
                        {myTournaments.length === 0 ? (
                            <Card>
                                <CardContent className="text-center py-8">
                                    <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        No tournaments yet
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Create your first tournament or join an
                                        existing one to get started.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myTournaments.map((tournament) => (
                                    <TournamentCard
                                        key={tournament.id}
                                        tournament={tournament}
                                        onJoin={handleJoinTournament}
                                        onLeave={handleLeaveTournament}
                                        onView={handleViewTournament}
                                        isRegistered={tournament.registeredPlayers.includes(
                                            auth.user!.id
                                        )}
                                        canRegister={
                                            tournament.createdBy !==
                                            auth.user!.id
                                        }
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
                                    <h3 className="text-lg font-semibold mb-2">
                                        No available tournaments
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Check back later for new tournaments to
                                        join.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {availableTournaments.map((tournament) => (
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
                            {tournaments.map((tournament) => (
                                <TournamentCard
                                    key={tournament.id}
                                    tournament={tournament}
                                    onJoin={handleJoinTournament}
                                    onLeave={handleLeaveTournament}
                                    onView={handleViewTournament}
                                    isRegistered={tournament.registeredPlayers.includes(
                                        auth.user!.id
                                    )}
                                    canRegister={
                                        tournament.createdBy !== auth.user!.id
                                    }
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
