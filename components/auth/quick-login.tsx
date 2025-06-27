"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bot, LogIn, UserPlus, Users } from "lucide-react";
import { useState } from "react";

// Jogadores pré-definidos para teste rápido
const quickPlayers = [
    { id: "player1", name: "Alice", avatar: "👩‍💼" },
    { id: "player2", name: "Bob", avatar: "👨‍💻" },
    { id: "player3", name: "Charlie", avatar: "👨‍🎓" },
    { id: "player4", name: "Diana", avatar: "👩‍🎨" },
    { id: "player5", name: "Eve", avatar: "👩‍🔬" },
    { id: "player6", name: "Frank", avatar: "👨‍🍳" },
];

const botPlayers = [
    { id: "bot1", name: "AI-Crusher", avatar: "🤖", isBot: true },
    { id: "bot2", name: "BluffMaster", avatar: "🎭", isBot: true },
    { id: "bot3", name: "TightPlayer", avatar: "🛡️", isBot: true },
    { id: "bot4", name: "Aggressive", avatar: "⚡", isBot: true },
    { id: "bot5", name: "Calculator", avatar: "🧮", isBot: true },
];

interface QuickLoginProps {
    onLogin: (user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    }) => void;
    currentUser?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    } | null;
    onAddBot?: (gameId: string) => void;
    gameId?: string;
}

export default function QuickLogin({
    onLogin,
    currentUser,
    onAddBot,
    gameId,
}: QuickLoginProps) {
    const [customName, setCustomName] = useState("");
    const [showCustom, setShowCustom] = useState(false);

    const handleQuickLogin = (player: (typeof quickPlayers)[0]) => {
        onLogin({
            id: player.id,
            name: player.name,
            email: `${player.id}@demo.com`,
            avatar: player.avatar,
        });
    };

    const handleCustomLogin = () => {
        if (!customName.trim()) return;

        const customId = `custom_${Date.now()}`;
        onLogin({
            id: customId,
            name: customName.trim(),
            email: `${customId}@demo.com`,
        });
        setCustomName("");
        setShowCustom(false);
    };

    const handleBotAdd = (bot: (typeof botPlayers)[0]) => {
        if (onAddBot && gameId) {
            onAddBot(gameId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Current User */}
            {currentUser && (
                <Card className="neon-card glow-cyan">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">
                                {currentUser.avatar || "👤"}
                            </div>
                            <div>
                                <div className="font-semibold text-white">
                                    Logado como:
                                </div>
                                <div className="text-neon-cyan">
                                    {currentUser.name}
                                </div>
                            </div>
                            <Badge className="ml-auto bg-green-500">
                                Online
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Login Options */}
            <Card className="neon-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Login Rápido - Jogadores Demo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {quickPlayers.map((player) => (
                            <Button
                                key={player.id}
                                onClick={() => handleQuickLogin(player)}
                                variant="outline"
                                className={`p-3 h-auto flex flex-col items-center gap-2 ${
                                    currentUser?.id === player.id
                                        ? "bg-neon-cyan/20 border-neon-cyan"
                                        : "hover:bg-gray-800/50"
                                }`}
                                disabled={currentUser?.id === player.id}
                            >
                                <div className="text-2xl">{player.avatar}</div>
                                <div className="text-sm font-medium">
                                    {player.name}
                                </div>
                            </Button>
                        ))}
                    </div>

                    {/* Custom Player */}
                    <div className="border-t border-gray-700 pt-4">
                        {!showCustom ? (
                            <Button
                                onClick={() => setShowCustom(true)}
                                variant="outline"
                                className="w-full"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Criar Jogador Personalizado
                            </Button>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="customName">
                                    Nome do Jogador
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="customName"
                                        value={customName}
                                        onChange={(e) =>
                                            setCustomName(e.target.value)
                                        }
                                        placeholder="Digite seu nome"
                                        className="neon-input"
                                        onKeyPress={(e) =>
                                            e.key === "Enter" &&
                                            handleCustomLogin()
                                        }
                                    />
                                    <Button
                                        onClick={handleCustomLogin}
                                        disabled={!customName.trim()}
                                        className="neon-button"
                                    >
                                        <LogIn className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    onClick={() => setShowCustom(false)}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Bot Players (só mostra se tiver gameId) */}
            {gameId && onAddBot && (
                <Card className="neon-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            Adicionar Bots à Mesa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {botPlayers.map((bot) => (
                                <Button
                                    key={bot.id}
                                    onClick={() => handleBotAdd(bot)}
                                    variant="outline"
                                    className="p-3 h-auto flex items-center gap-3 hover:bg-purple-500/20 border-purple-500/50"
                                >
                                    <div className="text-xl">{bot.avatar}</div>
                                    <div className="text-left">
                                        <div className="font-medium">
                                            {bot.name}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            AI Player
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                            Os bots jogam automaticamente com estratégias
                            diferentes
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Instructions */}
            <Card className="neon-card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30">
                <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-300 mb-2">
                        💡 Como Jogar com Amigos:
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>
                            • <strong>Mesma máquina:</strong> Use o login rápido
                            para alternar entre jogadores
                        </li>
                        <li>
                            • <strong>Diferentes abas:</strong> Abra várias abas
                            do navegador e faça login diferente em cada
                        </li>
                        <li>
                            • <strong>Modo privativo:</strong> Use janela
                            anônima para mais uma conta
                        </li>
                        <li>
                            • <strong>Com bots:</strong> Adicione IAs para
                            completar a mesa
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
