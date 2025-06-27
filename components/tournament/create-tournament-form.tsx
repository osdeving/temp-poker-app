"use client";

import { FadeIn } from "@/components/ui/animations";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard, NeonText } from "@/components/ui/neon";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BlindLevel, defaultBlindStructure } from "@/lib/tournament";
import { CalendarDays, DollarSign, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";

interface CreateTournamentFormProps {
    onSubmit: (tournamentData: {
        name: string;
        description: string;
        buyIn: number;
        startTime: Date;
        maxPlayers: number;
        blindLevels: BlindLevel[];
        status: "upcoming";
        createdBy: string;
    }) => void;
    createdBy: string;
}

export default function CreateTournamentForm({
    onSubmit,
    createdBy,
}: CreateTournamentFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        buyIn: 50,
        startTime: "",
        maxPlayers: 100,
    });

    const [blindLevels, setBlindLevels] = useState<BlindLevel[]>(
        defaultBlindStructure
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            ...formData,
            startTime: new Date(formData.startTime),
            blindLevels,
            status: "upcoming" as const,
            createdBy,
        });
    };

    const addBlindLevel = () => {
        const lastLevel = blindLevels[blindLevels.length - 1];
        const newLevel: BlindLevel = {
            level: lastLevel.level + 1,
            smallBlind: lastLevel.bigBlind,
            bigBlind: lastLevel.bigBlind * 2,
            duration: 20,
        };
        setBlindLevels([...blindLevels, newLevel]);
    };

    const removeBlindLevel = (index: number) => {
        if (blindLevels.length > 1) {
            setBlindLevels(blindLevels.filter((_, i) => i !== index));
        }
    };

    const updateBlindLevel = (
        index: number,
        field: keyof BlindLevel,
        value: number
    ) => {
        const updated = blindLevels.map((level, i) =>
            i === index ? { ...level, [field]: value } : level
        );
        setBlindLevels(updated);
    };

    return (
        <FadeIn>
            <form onSubmit={handleSubmit} className="space-y-6">
                <GlassCard>
                    <CardHeader>
                        <NeonText color="pink" className="text-xl font-bold">
                            Tournament Details
                        </NeonText>
                        <CardDescription className="text-gray-300">
                            Configure your tournament settings and blind
                            structure
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-white font-medium"
                                >
                                    Tournament Name
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="Sunday Night Tournament"
                                    required
                                    className="bg-black/30 border border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-500/80 focus:shadow-[0_0_10px_rgba(0,255,255,0.5)] focus:outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="buyIn"
                                    className="flex items-center gap-2 text-white font-medium"
                                >
                                    <DollarSign className="h-4 w-4 text-green-400" />
                                    Buy-in Amount
                                </Label>
                                <Input
                                    id="buyIn"
                                    type="number"
                                    value={formData.buyIn}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            buyIn: Number(e.target.value),
                                        }))
                                    }
                                    min="1"
                                    required
                                    className="bg-black/30 border border-cyan-500/30 text-white focus:border-cyan-500/80 focus:shadow-[0_0_10px_rgba(0,255,255,0.5)] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-white font-medium"
                            >
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="Describe your tournament..."
                                rows={3}
                                className="bg-gray-800/50 border-cyan-500/30 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="startTime"
                                    className="flex items-center gap-2 text-white font-medium"
                                >
                                    <CalendarDays className="h-4 w-4 text-cyan-400" />
                                    Start Time
                                </Label>
                                <Input
                                    id="startTime"
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            startTime: e.target.value,
                                        }))
                                    }
                                    required
                                    className="bg-black/30 border border-cyan-500/30 text-white focus:border-cyan-500/80 focus:shadow-[0_0_10px_rgba(0,255,255,0.5)] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="maxPlayers"
                                className="flex items-center gap-2 text-white font-medium"
                            >
                                <Users className="h-4 w-4 text-purple-400" />
                                Max Players
                            </Label>
                            <Select
                                value={formData.maxPlayers.toString()}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        maxPlayers: Number(value),
                                    }))
                                }
                            >
                                <SelectTrigger className="bg-gray-800/50 border-cyan-500/30 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-cyan-500/30">
                                    <SelectItem
                                        value="50"
                                        className="text-white hover:bg-gray-800"
                                    >
                                        50 Players
                                    </SelectItem>
                                    <SelectItem
                                        value="100"
                                        className="text-white hover:bg-gray-800"
                                    >
                                        100 Players
                                    </SelectItem>
                                    <SelectItem
                                        value="200"
                                        className="text-white hover:bg-gray-800"
                                    >
                                        200 Players
                                    </SelectItem>
                                    <SelectItem
                                        value="500"
                                        className="text-white hover:bg-gray-800"
                                    >
                                        500 Players
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </GlassCard>

                <GlassCard>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <NeonText
                                    color="cyan"
                                    className="text-xl font-bold"
                                >
                                    Blind Structure
                                </NeonText>
                                <CardDescription className="text-gray-300">
                                    Configure the blind levels for your
                                    tournament
                                </CardDescription>
                            </div>
                            <button
                                type="button"
                                onClick={addBlindLevel}
                                className="bg-gradient-to-r from-green-500/80 to-cyan-500/80 text-black font-bold px-4 py-2 rounded-lg text-sm hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-300"
                            >
                                <Plus className="h-4 w-4 mr-2 inline" />
                                Add Level
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                            {blindLevels.map((level, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-4 border border-pink-500/20 rounded-lg bg-gray-800/30 hover:border-pink-400/40 transition-colors"
                                >
                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                        <div>
                                            <Label className="text-xs text-gray-300 font-medium">
                                                Level
                                            </Label>
                                            <Input
                                                type="number"
                                                value={level.level}
                                                onChange={(e) =>
                                                    updateBlindLevel(
                                                        index,
                                                        "level",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="bg-gray-700/50 border-gray-600/50 text-white text-sm focus:border-cyan-400"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-300 font-medium">
                                                Small Blind
                                            </Label>
                                            <Input
                                                type="number"
                                                value={level.smallBlind}
                                                onChange={(e) =>
                                                    updateBlindLevel(
                                                        index,
                                                        "smallBlind",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="bg-gray-700/50 border-gray-600/50 text-white text-sm focus:border-green-400"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-300 font-medium">
                                                Big Blind
                                            </Label>
                                            <Input
                                                type="number"
                                                value={level.bigBlind}
                                                onChange={(e) =>
                                                    updateBlindLevel(
                                                        index,
                                                        "bigBlind",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="bg-gray-700/50 border-gray-600/50 text-white text-sm focus:border-green-400"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs text-gray-300 font-medium">
                                                Duration (min)
                                            </Label>
                                            <Input
                                                type="number"
                                                value={level.duration}
                                                onChange={(e) =>
                                                    updateBlindLevel(
                                                        index,
                                                        "duration",
                                                        Number(e.target.value)
                                                    )
                                                }
                                                min="1"
                                                className="bg-gray-700/50 border-gray-600/50 text-white text-sm focus:border-purple-400"
                                            />
                                        </div>
                                    </div>
                                    {blindLevels.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                removeBlindLevel(index)
                                            }
                                            className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>{" "}
                    </CardContent>
                </GlassCard>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500/80 to-cyan-500/80 text-black font-bold text-lg py-4 rounded-lg hover:shadow-[0_0_15px_rgba(255,20,147,0.8)] transition-all duration-300"
                >
                    Create Tournament
                </button>
            </form>
        </FadeIn>
    );
}
