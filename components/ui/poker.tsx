"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
          "bg-gradient-to-br from-blue-500 to-blue-700",
          "border-2 border-blue-800 rounded-lg",
          "shadow-lg relative overflow-hidden",
          "flex items-center justify-center",
          animate && "animate-[card-deal_0.5s_ease-out_forwards]",
          className
        )}
      >
        {/* Card back pattern */}
        <div className="absolute inset-0 opacity-80">
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700" />
          <div className="absolute inset-1 border border-blue-300 opacity-60 rounded" />
          <div className="absolute inset-2 border border-blue-300 opacity-40 rounded" />
        </div>
        <div className="relative text-white font-bold text-lg">🂠</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        "bg-white border-2 border-gray-800 rounded-lg",
        "shadow-lg relative p-1",
        "flex flex-col justify-between",
        animate && "animate-[card-deal_0.5s_ease-out_forwards]",
        className
      )}
    >
      {/* Top left corner */}
      <div className={cn("flex flex-col items-start text-xs font-bold", suit && suitColors[suit])}>
        <div className="leading-none">{rank}</div>
        <div className="leading-none">{suit && suitSymbols[suit]}</div>
      </div>

      {/* Center symbol */}
      <div className={cn("absolute inset-0 flex items-center justify-center text-xl font-bold", suit && suitColors[suit])}>
        {suit && suitSymbols[suit]}
      </div>

      {/* Bottom right corner (rotated) - only for md and lg sizes */}
      {size !== "sm" && (
        <div className={cn("self-end flex flex-col items-end text-xs font-bold", suit && suitColors[suit])}>
          <div className="leading-none transform rotate-180">{suit && suitSymbols[suit]}</div>
          <div className="leading-none transform rotate-180">{rank}</div>
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
    if (val >= 1000) return "bg-black border-white text-white";
    if (val >= 500) return "bg-purple-600 border-purple-300 text-white";
    if (val >= 100) return "bg-green-600 border-green-300 text-white";
    if (val >= 25) return "bg-blue-600 border-blue-300 text-white";
    if (val >= 5) return "bg-red-600 border-red-300 text-white";
    return "bg-white border-gray-600 text-black";
  };

  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const formatValue = (val: number) => {
    if (val >= 1000) return "1K";
    if (val >= 500) return "500";
    if (val >= 100) return "100";
    if (val >= 25) return "25";
    if (val >= 5) return "5";
    return "1";
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
            "font-bold shadow-lg absolute",
            "before:absolute before:inset-0.5 before:rounded-full",
            "before:border before:border-white/20",
            animated && "animate-pulse",
            className
          )}
          style={{
            bottom: `${index * 2}px`,
            left: 0,
            zIndex: index + 1,
          }}
        >
          {formatValue(value)}
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

export function PotContainer({ amount, children, className }: PotContainerProps) {
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
          <div className="text-2xl font-black">${amount.toLocaleString()}</div>
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

export function PlayerSpotlight({ children, isActive = false, className }: PlayerSpotlightProps) {
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

export function CommunityCardsArea({ children, className }: CommunityCardsAreaProps) {
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
