"use client";

import Navbar from "@/components/layout/navbar";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { GlassCard, NeonButton, NeonInput, NeonText } from "@/components/ui/glass";
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
                <FadeIn>
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h1 className="text-4xl font-bold">
                                    <NeonText color="cyan">
                                        Cash Games 🎮
                                    </NeonText>
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Play poker against friends and players
                                    worldwide
                                </p>
                            </div>
                            <Dialog
                                open={showCreateGame}
                                onOpenChange={setShowCreateGame}
                            >
                                <DialogTrigger asChild>
                                    <NeonButton>
                                        <Plus className="h-4 w-4" />
                                        Create Table
                                    </NeonButton>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <GlassCard
                                        variant="crystal"
                                        className="p-6"
                                    >
                                        <DialogHeader>
                                            <DialogTitle>
                                                <NeonText color="cyan">
                                                    Create Cash Game
                                                </NeonText>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 mt-4">
                                            <div>
                                                <Label htmlFor="gameName">
                                                    Table Name
                                                </Label>
                                                <NeonInput
                                                    value={gameName}
                                                    onChange={(e) =>
                                                        setGameName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="My Poker Table"
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
                                                        {cashGameTypes.map(
                                                            (type) => (
                                                                <SelectItem
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    value={
                                                                        type.id
                                                                    }
                                                                >
                                                                    {type.name}
                                                                </SelectItem>
                                                            )
                                                        )}
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
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
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
                                                        {[
                                                            2, 3, 4, 5, 6, 7, 8,
                                                            9,
                                                        ].map((num) => (
                                                            <SelectItem
                                                                key={num}
                                                                value={num.toString()}
                                                            >
                                                                {num} Players
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="isPrivate"
                                                    checked={isPrivate}
                                                    onCheckedChange={
                                                        setIsPrivate
                                                    }
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
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter password"
                                                        className="neon-input"
                                                    />
                                                </div>
                                            )}

                                            <NeonButton
                                                onClick={handleCreateGame}
                                                className="w-full"
                                                disabled={!gameName.trim()}
                                            >
                                                Create Table
                                            </NeonButton>
                                        </div>
                                    </GlassCard>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </FadeIn>

                {/* Lobby Stats */}
                <SlideIn className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <GlassCard
                        variant="diamond"
                        className="p-4 text-center"
                    >
                        <div className="text-sm text-gray-400">
                            Active Tables
                        </div>
                        <div className="text-2xl font-bold">
                            <NeonText color="cyan">
                                {lobby.totalTables}
                            </NeonText>
                        </div>
                    </GlassCard>

                    <GlassCard
                        variant="emerald"
                        className="p-4 text-center"
                    >
                        <div className="text-sm text-gray-400">
                            Players Online
                        </div>
                        <div className="text-2xl font-bold">
                            <NeonText color="green">
                                {lobby.activePlayers}
                            </NeonText>
                        </div>
                    </GlassCard>

                    <GlassCard
                        variant="crystal"
                        className="p-4 text-center"
                    >
                        <div className="text-sm text-gray-400">
                            Available Tables
                        </div>
                        <div className="text-2xl font-bold">
                            <NeonText color="pink">
                                {lobby.availableTables.length}
                            </NeonText>
                        </div>
                    </GlassCard>
                </SlideIn>

                {/* Available Tables */}
                <SlideIn direction="up" className="space-y-6">
                    <h2 className="text-2xl font-bold">
                        <NeonText color="cyan">Available Tables</NeonText>
                    </h2>
                    {lobby.availableTables.length === 0 ? (
                        <GlassCard
                            variant="sapphire"
                            className="text-center py-8"
                        >
                            <Gamepad2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-white">
                                No Active Tables
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Be the first to create a cash game table!
                            </p>
                            <NeonButton onClick={() => setShowCreateGame(true)}>
                                Create First Table
                            </NeonButton>
                        </GlassCard>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {lobby.availableTables.map((game) => (
                                <GlassCard
                                    key={game.id}
                                    variant="diamond"
                                    className="p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                                {game.isPrivate ? (
                                                    <Lock className="h-4 w-4 text-red-400" />
                                                ) : (
                                                    <Unlock className="h-4 w-4 text-green-400" />
                                                )}
                                                <NeonText color="cyan">
                                                    {game.name}
                                                </NeonText>
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {
                                                    cashGameTypes.find(
                                                        (t) =>
                                                            t.id === game.type
                                                    )?.name
                                                }
                                            </p>
                                        </div>
                                        <Badge
                                            className={
                                                game.status === "waiting"
                                                    ? "bg-yellow-500"
                                                    : game.status === "active"
                                                    ? "bg-green-500"
                                                    : "bg-gray-500"
                                            }
                                        >
                                            {game.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="space-y-4">
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
                                            <NeonInput
                                                type="number"
                                                placeholder={`Buy-in ($${game.minBuyIn}-$${game.maxBuyIn})`}
                                                value={buyInAmount.toString()}
                                                onChange={(e) =>
                                                    setBuyInAmount(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <NeonButton
                                            variant="secondary"
                                            onClick={() =>
                                                router.push(
                                                    `/cash-game/${game.id}`
                                                )
                                            }
                                        >
                                            <Eye className="h-4 w-4" />
                                            Ver
                                        </NeonButton>
                                        <NeonButton
                                            onClick={() =>
                                                handleJoinGame(game.id)
                                            }
                                            disabled={
                                                game.currentPlayers >=
                                                game.maxPlayers
                                            }
                                        >
                                            <Play className="h-4 w-4" />
                                            Join
                                        </NeonButton>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </SlideIn>
            </div>
        </div>
    );
}
