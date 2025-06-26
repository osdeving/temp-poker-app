"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/use-notifications";
import { Tournament } from "@/lib/tournament";
import {
    BarChart3,
    ChevronLeft,
    ChevronRight,
    Clock,
    Settings,
    Trophy,
} from "lucide-react";
import { useState } from "react";
import TournamentClock from "./tournament-clock";
import TournamentControls from "./tournament-controls";
import TournamentRanking from "./tournament-ranking";
import TournamentStats from "./tournament-stats";

interface MobileTournamentViewProps {
    tournament: Tournament;
    isDirector: boolean;
    onUpdateClock: (currentLevel: number, timeRemaining: number) => void;
    onUpdateStatus: (status: Tournament["status"]) => void;
    onEliminatePlayer: (playerId: string) => void;
    onUpdateChips: (playerId: string, chips: number) => void;
}

export default function MobileTournamentView({
    tournament,
    isDirector,
    onUpdateClock,
    onUpdateStatus,
    onEliminatePlayer,
    onUpdateChips,
}: MobileTournamentViewProps) {
    const [activeTab, setActiveTab] = useState("clock");
    const { notifyElimination } = useNotifications();

    const handleEliminatePlayer = (playerId: string) => {
        const player = tournament.players?.find((p) => p.id === playerId);
        const activePlayers =
            tournament.players?.filter((p) => !p.isEliminated) || [];
        const position = activePlayers.length;

        onEliminatePlayer(playerId);

        if (player) {
            notifyElimination(player.name, position);
        }
    };

    return (
        <div className="block md:hidden">
            {/* Mobile Header */}
            <Card className="poker-card mb-4">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">
                                {tournament.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {tournament.description}
                            </p>
                        </div>
                        <Badge
                            className={
                                tournament.status === "upcoming"
                                    ? "status-badge-upcoming"
                                    : tournament.status === "running"
                                    ? "status-badge-running"
                                    : tournament.status === "paused"
                                    ? "status-badge-paused"
                                    : "status-badge-finished"
                            }
                        >
                            {tournament.status.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xs text-muted-foreground">
                                Players
                            </div>
                            <div className="font-bold">
                                {tournament.registeredPlayers.length}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">
                                Prize Pool
                            </div>
                            <div className="font-bold text-green-600">
                                ${tournament.prizePool.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground">
                                Buy-in
                            </div>
                            <div className="font-bold">${tournament.buyIn}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                        value="clock"
                        className="flex items-center gap-1"
                    >
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">Clock</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="ranking"
                        className="flex items-center gap-1"
                    >
                        <Trophy className="h-4 w-4" />
                        <span className="hidden sm:inline">Ranking</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="stats"
                        className="flex items-center gap-1"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Stats</span>
                    </TabsTrigger>
                    {isDirector && (
                        <TabsTrigger
                            value="controls"
                            className="flex items-center gap-1"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="hidden sm:inline">Controls</span>
                        </TabsTrigger>
                    )}
                </TabsList>

                <div className="mt-4">
                    <TabsContent value="clock" className="space-y-4">
                        <TournamentClock
                            tournament={tournament}
                            onUpdateClock={onUpdateClock}
                            onUpdateStatus={onUpdateStatus}
                            isDirector={isDirector}
                        />
                    </TabsContent>

                    <TabsContent value="ranking" className="space-y-4">
                        <TournamentRanking
                            tournament={tournament}
                            onEliminatePlayer={handleEliminatePlayer}
                            onUpdateChips={onUpdateChips}
                            isDirector={isDirector}
                        />
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4">
                        <TournamentStats tournament={tournament} />
                    </TabsContent>

                    {isDirector && (
                        <TabsContent value="controls" className="space-y-4">
                            <TournamentControls
                                tournament={tournament}
                                isDirector={isDirector}
                            />
                        </TabsContent>
                    )}
                </div>
            </Tabs>

            {/* Quick Navigation */}
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm"
                    onClick={() => {
                        const tabs = ["clock", "ranking", "stats"];
                        if (isDirector) tabs.push("controls");
                        const currentIndex = tabs.indexOf(activeTab);
                        const prevIndex =
                            currentIndex > 0
                                ? currentIndex - 1
                                : tabs.length - 1;
                        setActiveTab(tabs[prevIndex]);
                    }}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm"
                    onClick={() => {
                        const tabs = ["clock", "ranking", "stats"];
                        if (isDirector) tabs.push("controls");
                        const currentIndex = tabs.indexOf(activeTab);
                        const nextIndex =
                            currentIndex < tabs.length - 1
                                ? currentIndex + 1
                                : 0;
                        setActiveTab(tabs[nextIndex]);
                    }}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
