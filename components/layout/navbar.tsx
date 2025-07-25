"use client";

import { HoverGlow } from "@/components/ui/animations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NeonButton, NeonText } from "@/components/ui/glass";
import { useAuth } from "@/hooks/use-auth";
import {
    Gamepad2,
    LogOut,
    Plus,
    Settings,
    Trophy,
    User,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
    onCreateTournament?: () => void;
}

export default function Navbar({ onCreateTournament }: NavbarProps) {
    const { auth, logout } = useAuth();
    const router = useRouter();

    if (!auth.user) return null;

    return (
        <nav className="border-b border-gray-800 glass-premium backdrop-blur-[40px] border-pink-500/20">
            <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 h-12 sm:h-14 md:h-16 flex items-center justify-between relative">
                {/* Glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 pointer-events-none"></div>

                <div className="flex items-center gap-1 sm:gap-3 md:gap-6 flex-shrink-0 min-w-0 relative z-10">
                    <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold flex items-center gap-1 flex-shrink-0">
                        🃏
                        <NeonText
                            color="pink"
                            className="inline text-xs sm:text-base md:text-lg lg:text-xl"
                        >
                            PokerPro
                        </NeonText>
                    </h1>

                    {/* Tournament Button */}
                    <HoverGlow color="cyan">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-1 sm:gap-2 text-cyan-400 p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base"
                            size="sm"
                        >
                            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span className="hidden xs:inline sm:inline text-xs sm:text-sm md:text-base">
                                Tournaments
                            </span>
                        </Button>
                    </HoverGlow>

                    {/* Cash Games Button */}
                    <HoverGlow color="green">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/cash-games")}
                            className="flex items-center gap-1 sm:gap-2 text-green-400 p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base"
                            size="sm"
                        >
                            <Gamepad2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span className="hidden sm:inline text-xs sm:text-sm md:text-base">
                                Cash Games
                            </span>
                        </Button>
                    </HoverGlow>

                    {/* Interactive Showcase Button */}
                    <HoverGlow color="cyan">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/interactive-showcase")}
                            className="flex items-center gap-1 sm:gap-2 text-cyan-400 p-1 sm:p-2 md:p-3 text-xs sm:text-sm md:text-base"
                            size="sm"
                        >
                            <Settings className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span className="hidden lg:inline text-xs sm:text-sm md:text-base">
                                Components
                            </span>
                        </Button>
                    </HoverGlow>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 md:gap-4 flex-shrink-0 relative z-10">
                    {onCreateTournament && (
                        <NeonButton
                            onClick={onCreateTournament}
                            size="sm"
                            className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 flex items-center gap-1 sm:gap-2"
                        >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm md:text-base">
                                Create
                            </span>
                            <span className="hidden md:inline text-xs sm:text-sm md:text-base ml-1">
                                Tournament
                            </span>
                        </NeonButton>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-full p-0"
                            >
                                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
                                    <AvatarImage
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="text-xs sm:text-sm md:text-base font-semibold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-44 sm:w-48 md:w-56 neon-card bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 border-pink-500/30"
                            align="end"
                            forceMount
                        >
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium text-white text-sm">
                                        {auth.user.name}
                                    </p>
                                    <p className="w-[120px] sm:w-[150px] md:w-[180px] truncate text-xs text-gray-400">
                                        {auth.user.email}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                                onClick={() => router.push("/demo-login")}
                                className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50 text-sm"
                            >
                                <Users className="mr-2 h-4 w-4 text-blue-400" />
                                <span>Demo Login</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50 text-sm">
                                <User className="mr-2 h-4 w-4 text-neon-cyan" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-800/50 focus:bg-gray-800/50 text-sm">
                                <Settings className="mr-2 h-4 w-4 text-purple-400" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20 hover:text-red-300 text-sm"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
