"use client";

import Navbar from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useCashGames } from "@/hooks/use-cash-games";
import { cashGameTypes, defaultCashGameSettings } from "@/lib/cash-game";
import {
    Clock,
    DollarSign,
    Eye,
    Gamepad2,
    Lock,
    Play,
    Plus,
    Unlock,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CashGamesPage() {
    const router = useRouter();
    const { auth } = useAuth();
    const { cashGames, isLoading, createCashGame, joinCashGame, getLobby } =
        useCashGames();
    const [showCreateGame, setShowCreateGame] = useState(false);
    const [selectedGameToJoin, setSelectedGameToJoin] = useState<string | null>(
        null
    );
    const [buyInAmount, setBuyInAmount] = useState(100);

    // Form states for creating a game
    const [gameName, setGameName] = useState("Mesa de Poker");
    const [gameType, setGameType] = useState("texas-holdem");
    const [smallBlind, setSmallBlind] = useState(
        defaultCashGameSettings.smallBlind
    );
    const [bigBlind, setBigBlind] = useState(defaultCashGameSettings.bigBlind);
    const [minBuyIn, setMinBuyIn] = useState(defaultCashGameSettings.minBuyIn);
    const [maxBuyIn, setMaxBuyIn] = useState(defaultCashGameSettings.maxBuyIn);
    const [maxPlayers, setMaxPlayers] = useState(
        defaultCashGameSettings.maxPlayers
    );
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!auth.user && !auth.isLoading) {
            router.push("/");
        }
    }, [auth.user, auth.isLoading, router]);

    if (auth.isLoading || !auth.user) {
        return <div>Loading...</div>;
    }

    const lobby = getLobby();
    const handleCreateGame = () => {
        if (!gameName.trim() || !auth.user) return;

        const newGame = createCashGame(
            {
                name: gameName.trim(),
                type: gameType as any,
                smallBlind,
                bigBlind,
                minBuyIn,
                maxBuyIn,
                maxPlayers,
                isPrivate,
                password: isPrivate ? password : undefined,
            },
            auth.user.id
        );

        setShowCreateGame(false);
        router.push(`/cash-game/${newGame.id}`);
    };
    const handleJoinGame = (gameId: string) => {
        if (!auth.user) return;

        const game = cashGames.find((g) => g.id === gameId);
        if (!game) return;

        if (buyInAmount < game.minBuyIn || buyInAmount > game.maxBuyIn) {
            alert(
                `Buy-in must be between $${game.minBuyIn} and $${game.maxBuyIn}`
            );
            return;
        }

        const success = joinCashGame(
            gameId,
            auth.user.id,
            auth.user.name,
            buyInAmount
        );
        if (success) {
            router.push(`/cash-game/${gameId}`);
        } else {
            alert(
                "Failed to join game. It might be full or you're already in it."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-neon-cyan">
                                Cash Games 🎮
                            </h1>
                            <p className="text-gray-300 text-lg">
                                Play poker against friends and players worldwide
                            </p>
                        </div>
                        <Dialog
                            open={showCreateGame}
                            onOpenChange={setShowCreateGame}
                        >
                            <DialogTrigger asChild>
                                <Button className="neon-button">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Table
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="neon-card max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create Cash Game</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="gameName">
                                            Table Name
                                        </Label>
                                        <Input
                                            id="gameName"
                                            value={gameName}
                                            onChange={(e) =>
                                                setGameName(e.target.value)
                                            }
                                            placeholder="My Poker Table"
                                            className="neon-input"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="gameType">
                                            Game Type
                                        </Label>
                                        <Select
                                            value={gameType}
                                            onValueChange={setGameType}
                                        >
                                            <SelectTrigger className="neon-input">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {cashGameTypes.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="smallBlind">
                                                Small Blind
                                            </Label>
                                            <Input
                                                id="smallBlind"
                                                type="number"
                                                value={smallBlind}
                                                onChange={(e) =>
                                                    setSmallBlind(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="neon-input"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="bigBlind">
                                                Big Blind
                                            </Label>
                                            <Input
                                                id="bigBlind"
                                                type="number"
                                                value={bigBlind}
                                                onChange={(e) =>
                                                    setBigBlind(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="neon-input"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="minBuyIn">
                                                Min Buy-in
                                            </Label>
                                            <Input
                                                id="minBuyIn"
                                                type="number"
                                                value={minBuyIn}
                                                onChange={(e) =>
                                                    setMinBuyIn(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="neon-input"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="maxBuyIn">
                                                Max Buy-in
                                            </Label>
                                            <Input
                                                id="maxBuyIn"
                                                type="number"
                                                value={maxBuyIn}
                                                onChange={(e) =>
                                                    setMaxBuyIn(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="neon-input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="maxPlayers">
                                            Max Players
                                        </Label>
                                        <Select
                                            value={maxPlayers.toString()}
                                            onValueChange={(v) =>
                                                setMaxPlayers(Number(v))
                                            }
                                        >
                                            <SelectTrigger className="neon-input">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[2, 3, 4, 5, 6, 7, 8, 9].map(
                                                    (num) => (
                                                        <SelectItem
                                                            key={num}
                                                            value={num.toString()}
                                                        >
                                                            {num} Players
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="isPrivate"
                                            checked={isPrivate}
                                            onCheckedChange={setIsPrivate}
                                        />
                                        <Label htmlFor="isPrivate">
                                            Private Table
                                        </Label>
                                    </div>

                                    {isPrivate && (
                                        <div>
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter password"
                                                className="neon-input"
                                            />
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleCreateGame}
                                        className="neon-button w-full"
                                        disabled={!gameName.trim()}
                                    >
                                        Create Table
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Lobby Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="neon-card glow-cyan">
                        <CardContent className="p-4 text-center">
                            <div className="text-sm text-gray-400">
                                Active Tables
                            </div>
                            <div className="text-2xl font-bold text-neon-cyan">
                                {lobby.totalTables}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="neon-card glow-green">
                        <CardContent className="p-4 text-center">
                            <div className="text-sm text-gray-400">
                                Players Online
                            </div>
                            <div className="text-2xl font-bold text-neon-green">
                                {lobby.activePlayers}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="neon-card glow-pink">
                        <CardContent className="p-4 text-center">
                            <div className="text-sm text-gray-400">
                                Available Tables
                            </div>
                            <div className="text-2xl font-bold text-neon-pink">
                                {lobby.availableTables.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Available Tables */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                        Available Tables
                    </h2>
                    {lobby.availableTables.length === 0 ? (
                        <Card className="neon-card">
                            <CardContent className="text-center py-8">
                                <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    No Active Tables
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Be the first to create a cash game table!
                                </p>
                                <Button
                                    onClick={() => setShowCreateGame(true)}
                                    className="neon-button"
                                >
                                    Create First Table
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {lobby.availableTables.map((game) => (
                                <Card key={game.id} className="neon-card">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {game.isPrivate ? (
                                                        <Lock className="h-4 w-4 text-red-400" />
                                                    ) : (
                                                        <Unlock className="h-4 w-4 text-green-400" />
                                                    )}
                                                    {game.name}
                                                </CardTitle>
                                                <p className="text-sm text-gray-400">
                                                    {
                                                        cashGameTypes.find(
                                                            (t) =>
                                                                t.id ===
                                                                game.type
                                                        )?.name
                                                    }
                                                </p>
                                            </div>
                                            <Badge
                                                className={
                                                    game.status === "waiting"
                                                        ? "bg-yellow-500"
                                                        : game.status ===
                                                          "active"
                                                        ? "bg-green-500"
                                                        : "bg-gray-500"
                                                }
                                            >
                                                {game.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-green-400" />
                                                <span>
                                                    ${game.smallBlind}/$
                                                    {game.bigBlind}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-400" />
                                                <span>
                                                    {game.currentPlayers}/
                                                    {game.maxPlayers}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-yellow-400" />
                                                <span>
                                                    ${game.minBuyIn}-$
                                                    {game.maxBuyIn}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-purple-400" />
                                                <span>
                                                    {new Date(
                                                        game.createdAt
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder={`Buy-in ($${game.minBuyIn}-$${game.maxBuyIn})`}
                                                value={buyInAmount}
                                                onChange={(e) =>
                                                    setBuyInAmount(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="neon-input flex-1"
                                                min={game.minBuyIn}
                                                max={game.maxBuyIn}
                                            />
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    router.push(
                                                        `/cash-game/${game.id}`
                                                    )
                                                }
                                                className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Ver
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleJoinGame(game.id)
                                                }
                                                className="neon-button"
                                                disabled={
                                                    game.currentPlayers >=
                                                    game.maxPlayers
                                                }
                                            >
                                                <Play className="h-4 w-4 mr-1" />
                                                Join
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
