"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { NeonButton, NeonText, UltraGlassCard } from "@/components/ui/neon";
import { useNotifications } from "@/hooks/use-notifications";
import { Tournament } from "@/lib/tournament";
import {
    AlertTriangle,
    CheckCircle,
    Download,
    FileText,
    RotateCcw,
    Settings,
    Share2,
} from "lucide-react";

interface TournamentControlsProps {
    tournament: Tournament;
    isDirector: boolean;
    onResetTournament?: () => void;
    onExportData?: () => void;
}

export default function TournamentControls({
    tournament,
    isDirector,
    onResetTournament,
    onExportData,
}: TournamentControlsProps) {
    const { notify } = useNotifications();

    const handleExportTournamentData = () => {
        const tournamentData = {
            name: tournament.name,
            description: tournament.description,
            buyIn: tournament.buyIn,
            prizePool: tournament.prizePool,
            players:
                tournament.players?.map((player) => ({
                    name: player.name,
                    chipCount: player.chipCount,
                    isEliminated: player.isEliminated,
                    position: player.position,
                    eliminatedAt: player.eliminatedAt,
                })) || [],
            currentLevel: tournament.currentLevel + 1,
            status: tournament.status,
            startTime: tournament.startTime,
            blindLevels: tournament.blindLevels,
            timeRemaining: tournament.timeRemaining,
            exportedAt: new Date().toISOString(),
        };

        const dataStr = JSON.stringify(tournamentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `tournament-${tournament.name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        notify(
            "success",
            "Tournament Data Exported",
            "Tournament data has been downloaded successfully"
        );
        onExportData?.();
    };

    const handleShareTournament = async () => {
        const shareData = {
            title: `${tournament.name} - Poker Tournament`,
            text: `Join the "${tournament.name}" poker tournament! Buy-in: $${
                tournament.buyIn
            }, Prize Pool: $${tournament.prizePool.toLocaleString()}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                notify(
                    "success",
                    "Tournament Shared",
                    "Share dialog opened successfully"
                );
            } catch (err) {
                // User cancelled or error occurred
            }
        } else {
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(
                    `${shareData.title}\n${shareData.text}\n${shareData.url}`
                );
                notify(
                    "success",
                    "Link Copied",
                    "Tournament link copied to clipboard"
                );
            } catch (err) {
                notify("error", "Share Failed", "Unable to share tournament");
            }
        }
    };

    const generateTournamentReport = () => {
        const activePlayers =
            tournament.players?.filter((p) => !p.isEliminated) || [];
        const eliminatedPlayers =
            tournament.players?.filter((p) => p.isEliminated) || [];
        const totalChips =
            tournament.players?.reduce((sum, p) => sum + p.chipCount, 0) || 0;

        const report = `
TOURNAMENT REPORT
================

Tournament: ${tournament.name}
Description: ${tournament.description}
Status: ${tournament.status.toUpperCase()}
Start Time: ${tournament.startTime.toLocaleString()}

FINANCIAL INFO
--------------
Buy-in: $${tournament.buyIn}
Prize Pool: $${tournament.prizePool.toLocaleString()}
Players Registered: ${tournament.registeredPlayers.length}

CURRENT STANDINGS
-----------------
Players Remaining: ${activePlayers.length}
Players Eliminated: ${eliminatedPlayers.length}

ACTIVE PLAYERS (by chip count):
${activePlayers
    .sort((a, b) => b.chipCount - a.chipCount)
    .map(
        (player, index) =>
            `${index + 1}. ${
                player.name
            } - ${player.chipCount.toLocaleString()} chips`
    )
    .join("\n")}

${
    eliminatedPlayers.length > 0
        ? `
ELIMINATED PLAYERS:
${eliminatedPlayers
    .sort((a, b) => (b.position || 0) - (a.position || 0))
    .map(
        (player) =>
            `${player.position}. ${player.name} - ${
                player.eliminatedAt
                    ? new Date(player.eliminatedAt).toLocaleString()
                    : "Unknown time"
            }`
    )
    .join("\n")}
`
        : ""
}

BLIND STRUCTURE
---------------
Current Level: ${tournament.currentLevel + 1}
Current Blinds: ${
            tournament.blindLevels[tournament.currentLevel]?.smallBlind
        }/${tournament.blindLevels[tournament.currentLevel]?.bigBlind}
Time Remaining: ${Math.floor(tournament.timeRemaining / 60)}:${(
            tournament.timeRemaining % 60
        )
            .toString()
            .padStart(2, "0")}

STATISTICS
----------
Total Chips in Play: ${totalChips.toLocaleString()}
Average Stack: ${
            activePlayers.length > 0
                ? Math.round(totalChips / activePlayers.length).toLocaleString()
                : "N/A"
        }
Elimination Rate: ${
            tournament.registeredPlayers.length > 0
                ? (
                      (eliminatedPlayers.length /
                          tournament.registeredPlayers.length) *
                      100
                  ).toFixed(1)
                : "0"
        }%

Generated on: ${new Date().toLocaleString()}
        `.trim();

        const reportBlob = new Blob([report], { type: "text/plain" });
        const url = URL.createObjectURL(reportBlob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `tournament-report-${tournament.name
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}-${new Date().toISOString().split("T")[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        notify(
            "success",
            "Report Generated",
            "Tournament report has been downloaded"
        );
    };

    const handleResetTournament = () => {
        onResetTournament?.();
        notify(
            "warning",
            "Tournament Reset",
            "Tournament has been reset to initial state"
        );
    };

    if (!isDirector) {
        return null;
    }

    return (
        <UltraGlassCard variant="crystal" className="space-y-4">
            <NeonText className="text-xl font-bold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tournament Controls
            </NeonText>
            <div className="space-y-4">
                {/* Export and Reporting */}
                <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                        Export & Reports
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                        <NeonButton
                            variant="secondary"
                            size="sm"
                            onClick={handleExportTournamentData}
                            className="justify-start"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export Data (JSON)
                        </NeonButton>
                        <NeonButton
                            variant="secondary"
                            size="sm"
                            onClick={generateTournamentReport}
                            className="justify-start"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                        </NeonButton>
                    </div>
                </div>

                {/* Sharing */}
                <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                        Sharing
                    </h4>
                    <NeonButton
                        variant="secondary"
                        size="sm"
                        onClick={handleShareTournament}
                        className="w-full justify-start"
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Tournament
                    </NeonButton>
                </div>

                {/* Advanced Controls */}
                {tournament.status === "upcoming" && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground">
                            Advanced
                        </h4>
                        <Dialog>
                            <DialogTrigger asChild>
                                <NeonButton
                                    variant="danger"
                                    size="sm"
                                    className="w-full justify-start"
                                >
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset Tournament
                                </NeonButton>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        Reset Tournament
                                    </DialogTitle>
                                    <DialogDescription>
                                        This action will reset the tournament to
                                        its initial state. All player
                                        eliminations, chip counts, and time
                                        progress will be lost. This action
                                        cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline">Cancel</Button>
                                    <NeonButton
                                        variant="danger"
                                        onClick={handleResetTournament}
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Tournament
                                    </NeonButton>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Tournament Status */}
                <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Tournament Status:
                        </span>
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
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {tournament.status.toUpperCase()}
                        </Badge>
                    </div>
                </div>
            </div>
        </UltraGlassCard>
    );
}
