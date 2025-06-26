"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Plus, Settings, Trophy, User } from "lucide-react";

interface NavbarProps {
    onCreateTournament?: () => void;
}

export default function Navbar({ onCreateTournament }: NavbarProps) {
    const { auth, logout } = useAuth();

    if (!auth.user) return null;

    return (
        <nav className="border-b nav-glass">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <h1 className="text-2xl font-bold gold-accent bg-clip-text text-transparent">
                        PokerPro
                    </h1>
                    <Button variant="ghost" className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Tournaments
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    {onCreateTournament && (
                        <Button
                            onClick={onCreateTournament}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Create Tournament
                        </Button>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src={auth.user.avatar}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback>
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="end"
                            forceMount
                        >
                            <div className="flex items-center justify-start gap-2 p-2">
                                <div className="flex flex-col space-y-1 leading-none">
                                    <p className="font-medium">
                                        {auth.user.name}
                                    </p>
                                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                                        {auth.user.email}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
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
