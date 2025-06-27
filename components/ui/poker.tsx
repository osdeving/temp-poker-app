"use client";

import { cn } from "@/lib/utils";
import React from "react";

// ============================================
// POKER-SPECIFIC COMPONENTS
// ============================================

interface PokerTableProps {
    children: React.ReactNode;
    className?: string;
}

export function PokerTable({ children, className }: PokerTableProps) {
    return (
        <div
            className={cn(
                // Felt texture with gradient
                "bg-gradient-to-br from-green-800 via-green-600 to-green-700",
                "rounded-full border-8 border-yellow-500",
                "shadow-2xl",
                // Inner felt effect
                "relative",
                "before:absolute before:inset-4 before:rounded-full",
                "before:bg-gradient-to-br before:from-green-700/50 before:to-green-900/30",
                "before:shadow-inner",
                className
            )}
        >
            {children}
        </div>
    );
}

interface PokerCardProps {
    suit?: "hearts" | "diamonds" | "clubs" | "spades";
    rank?: string;
    faceDown?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    animate?: boolean;
}

export function PokerCard({
    suit,
    rank,
    faceDown = false,
    size = "md",
    className,
    animate = false,
}: PokerCardProps) {
    const sizeClasses = {
        sm: "w-10 h-14 text-xs",
        md: "w-14 h-20 text-sm",
        lg: "w-20 h-28 text-lg",
    };

    const suitColors = {
        hearts: "text-red-600",
        diamonds: "text-red-600",
        clubs: "text-black",
        spades: "text-black",
    };

    const suitSymbols = {
        hearts: "♥",
        diamonds: "♦",
        clubs: "♣",
        spades: "♠",
    };

    if (faceDown) {
        return (
            <div
                className={cn(
                    sizeClasses[size],
                    "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
                    "border-2 border-blue-400 rounded-lg",
                    "shadow-[0_0_15px_rgba(59,130,246,0.5)] relative overflow-hidden",
                    "flex items-center justify-center",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-lg",
                    animate && "animate-[card-deal_0.5s_ease-out_forwards]",
                    "hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-all duration-300",
                    className
                )}
            >
                {/* Premium card back pattern */}
                <div className="absolute inset-0 opacity-90">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-800 rounded-lg" />
                    <div className="absolute inset-1 border border-blue-300/60 rounded opacity-80" />
                    <div className="absolute inset-2 border border-blue-300/40 rounded opacity-60" />
                    <div className="absolute inset-3 bg-gradient-to-br from-blue-400/20 to-transparent rounded" />
                </div>
                <div className="relative text-white font-bold text-lg drop-shadow-lg">
                    🂠
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite]"></div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                sizeClasses[size],
                "bg-gradient-to-br from-white via-gray-50 to-gray-100",
                "border-2 border-gray-800 rounded-lg",
                "shadow-[0_0_15px_rgba(0,0,0,0.3)] relative p-1",
                "flex flex-col justify-between",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/30 before:to-transparent before:rounded-lg before:pointer-events-none",
                animate && "animate-[card-deal_0.5s_ease-out_forwards]",
                "hover:shadow-[0_0_25px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300",
                "backdrop-blur-sm",
                className
            )}
        >
            {/* Top left corner */}
            <div
                className={cn(
                    "flex flex-col items-start text-xs font-bold",
                    suit && suitColors[suit]
                )}
            >
                <div className="leading-none">{rank}</div>
                <div className="leading-none">{suit && suitSymbols[suit]}</div>
            </div>

            {/* Center symbol */}
            <div
                className={cn(
                    "absolute inset-0 flex items-center justify-center text-xl font-bold",
                    suit && suitColors[suit]
                )}
            >
                {suit && suitSymbols[suit]}
            </div>

            {/* Bottom right corner (rotated) - only for md and lg sizes */}
            {size !== "sm" && (
                <div
                    className={cn(
                        "self-end flex flex-col items-end text-xs font-bold",
                        suit && suitColors[suit]
                    )}
                >
                    <div className="leading-none transform rotate-180">
                        {suit && suitSymbols[suit]}
                    </div>
                    <div className="leading-none transform rotate-180">
                        {rank}
                    </div>
                </div>
            )}
        </div>
    );
}

interface PokerChipProps {
    value: number;
    count?: number;
    size?: "sm" | "md" | "lg";
    animated?: boolean;
    className?: string;
}

export function PokerChip({
    value,
    count = 1,
    size = "md",
    animated = false,
    className,
}: PokerChipProps) {
    const getChipColor = (val: number) => {
        if (val >= 100000)
            return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 border-yellow-300 text-black shadow-[0_0_15px_rgba(255,215,0,0.6)]";
        if (val >= 50000)
            return "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-purple-300 text-white shadow-[0_0_15px_rgba(147,51,234,0.6)]";
        if (val >= 10000)
            return "bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 border-orange-300 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)]";
        if (val >= 1000)
            return "bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-400 text-white shadow-[0_0_15px_rgba(75,85,99,0.6)]";
        if (val >= 500)
            return "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 border-purple-300 text-white shadow-[0_0_15px_rgba(147,51,234,0.6)]";
        if (val >= 100)
            return "bg-gradient-to-br from-green-600 via-green-700 to-green-800 border-green-300 text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]";
        if (val >= 25)
            return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-blue-300 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]";
        if (val >= 5)
            return "bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-red-300 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]";
        return "bg-gradient-to-br from-gray-100 via-white to-gray-200 border-gray-600 text-black shadow-[0_0_10px_rgba(0,0,0,0.3)]";
    };

    const sizeClasses = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
    };

    const formatValue = (val: number) => {
        if (val >= 100000) return `${(val / 1000).toFixed(0)}K`;
        if (val >= 10000) return `${(val / 1000).toFixed(0)}K`;
        if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
        return val.toString();
    };

    return (
        <div className="relative">
            {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        sizeClasses[size],
                        getChipColor(value),
                        "rounded-full border-2 flex items-center justify-center",
                        "font-bold absolute",
                        "before:absolute before:inset-0.5 before:rounded-full",
                        "before:border before:border-white/20",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-gradient-to-t after:from-black/20 after:to-white/20",
                        "relative overflow-hidden",
                        animated &&
                            "animate-[chip-stack_0.3s_ease-out_forwards]",
                        "hover:scale-110 transition-all duration-200",
                        className
                    )}
                    style={{
                        bottom: `${index * 2}px`,
                        left: 0,
                        zIndex: index + 1,
                        animationDelay: `${index * 100}ms`,
                    }}
                >
                    {/* Chip shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-full"></div>

                    {/* Chip value */}
                    <span className="relative z-10 font-black text-shadow">
                        {formatValue(value)}
                    </span>

                    {/* Holographic shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite] rounded-full"></div>
                </div>
            ))}
        </div>
    );
}

interface PotContainerProps {
    amount: number;
    children?: React.ReactNode;
    className?: string;
}

export function PotContainer({
    amount,
    children,
    className,
}: PotContainerProps) {
    return (
        <div
            className={cn(
                "relative text-center",
                // Glow effect
                "drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]",
                // Animated glow
                "before:absolute before:inset-[-10px] before:rounded-full",
                "before:bg-gradient-radial before:from-yellow-400/10 before:to-transparent",
                "before:animate-[pot-glow_2s_ease-in-out_infinite_alternate]",
                className
            )}
        >
            <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-3 rounded-full shadow-lg relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur-sm opacity-70" />
                <div className="relative z-10">
                    <div className="text-lg font-bold">💰 POT</div>
                    <div className="text-2xl font-black">
                        ${amount.toLocaleString()}
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
}

interface PlayerSpotlightProps {
    children: React.ReactNode;
    isActive?: boolean;
    className?: string;
}

export function PlayerSpotlight({
    children,
    isActive = false,
    className,
}: PlayerSpotlightProps) {
    return (
        <div
            className={cn(
                "relative transition-all duration-300",
                isActive && [
                    "before:absolute before:inset-[-10px] before:rounded-full",
                    "before:bg-gradient-radial before:from-cyan-400/30 before:to-transparent",
                    "before:animate-[player-glow_1.5s_ease-in-out_infinite_alternate]",
                ],
                className
            )}
        >
            {children}
        </div>
    );
}

interface ActionButtonsProps {
    children: React.ReactNode;
    className?: string;
}

export function ActionButtons({ children, className }: ActionButtonsProps) {
    return (
        <div
            className={cn(
                "backdrop-blur-[10px] bg-black/30",
                "border border-white/10 rounded-lg p-4",
                "flex gap-2 flex-wrap",
                className
            )}
        >
            {children}
        </div>
    );
}

interface CommunityCardsAreaProps {
    children: React.ReactNode;
    className?: string;
}

export function CommunityCardsArea({
    children,
    className,
}: CommunityCardsAreaProps) {
    return (
        <div
            className={cn(
                "flex gap-2 justify-center items-center",
                "perspective-[1000px]",
                className
            )}
        >
            {children}
        </div>
    );
}
