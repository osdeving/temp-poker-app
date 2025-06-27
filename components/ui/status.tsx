"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ============================================
// STATUS BADGE COMPONENTS
// ============================================

interface StatusBadgeProps {
  status: "upcoming" | "running" | "paused" | "finished";
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const statusStyles = {
    upcoming: [
      "bg-gradient-to-r from-cyan-500/80 to-blue-500/80",
      "text-black font-bold",
      "shadow-none",
    ],
    running: [
      "bg-gradient-to-r from-pink-500/90 to-red-500/90",
      "text-white font-bold",
      "drop-shadow-[0_0_5px_rgba(255,20,147,0.8)]",
      "animate-pulse",
    ],
    paused: [
      "bg-gradient-to-r from-orange-500/80 to-yellow-500/80",
      "text-black font-bold",
      "shadow-none",
    ],
    finished: [
      "bg-gradient-to-r from-gray-500/80 to-gray-600/80",
      "text-white",
      "drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
    ],
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs",
        "transition-all duration-200",
        statusStyles[status],
        className
      )}
    >
      {children}
    </span>
  );
}

interface TournamentStatusCardProps {
  status: "upcoming" | "running" | "finished";
  children: React.ReactNode;
  className?: string;
}

export function TournamentStatusCard({ status, children, className }: TournamentStatusCardProps) {
  const statusStyles = {
    upcoming: [
      "bg-gradient-to-br from-green-500/20 to-cyan-500/20",
      "border-green-500/50",
      "text-green-400",
    ],
    running: [
      "bg-gradient-to-br from-pink-500/20 to-red-500/20",
      "border-pink-500/50",
      "text-pink-400",
    ],
    finished: [
      "bg-gradient-to-br from-gray-500/20 to-gray-700/20",
      "border-gray-500/50",
      "text-gray-400",
    ],
  };

  return (
    <div
      className={cn(
        "border rounded-lg p-4",
        "transition-all duration-300",
        statusStyles[status],
        className
      )}
    >
      {children}
    </div>
  );
}

interface PlayerBadgeProps {
  type: "director" | "registered" | "manual";
  children: React.ReactNode;
  className?: string;
}

export function PlayerBadge({ type, children, className }: PlayerBadgeProps) {
  const typeStyles = {
    director: [
      "bg-gradient-to-r from-red-500/90 to-red-600/90",
      "text-white font-bold",
      "drop-shadow-[0_0_5px_rgba(255,0,50,0.8)]",
    ],
    registered: [
      "bg-gradient-to-r from-green-500/90 to-emerald-500/90",
      "text-black font-bold",
      "shadow-none",
    ],
    manual: [
      "bg-gradient-to-r from-purple-500/90 to-violet-500/90",
      "text-white font-bold",
      "drop-shadow-[0_0_5px_rgba(150,100,255,0.8)]",
    ],
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded text-xs",
        "transition-all duration-200",
        typeStyles[type],
        className
      )}
    >
      {children}
    </span>
  );
}

interface RankingItemProps {
  position: number;
  isEliminated?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function RankingItem({ position, isEliminated = false, children, className }: RankingItemProps) {
  const getPositionStyles = () => {
    if (isEliminated) {
      return [
        "bg-gradient-to-r from-red-500/10 to-red-600/5",
        "border-l-4 border-red-500",
        "opacity-70",
      ];
    }

    switch (position) {
      case 1:
        return [
          "bg-gradient-to-r from-yellow-500/10 to-amber-500/5",
          "border-l-4 border-yellow-500",
        ];
      case 2:
        return [
          "bg-gradient-to-r from-gray-400/10 to-gray-500/5",
          "border-l-4 border-gray-400",
        ];
      case 3:
        return [
          "bg-gradient-to-r from-orange-500/10 to-orange-600/5",
          "border-l-4 border-orange-500",
        ];
      default:
        return [
          "bg-gradient-to-r from-slate-700/10 to-slate-800/5",
          "border-l-4 border-slate-600",
        ];
    }
  };

  return (
    <div
      className={cn(
        "relative p-3 transition-all duration-300",
        "hover:translate-x-1",
        ...getPositionStyles(),
        className
      )}
    >
      {children}
    </div>
  );
}

interface ClockDisplayProps {
  children: React.ReactNode;
  warning?: boolean;
  danger?: boolean;
  className?: string;
}

export function ClockDisplay({ children, warning = false, danger = false, className }: ClockDisplayProps) {
  return (
    <div
      className={cn(
        "font-mono tracking-wider transition-all duration-300",
        "drop-shadow-[0_0_10px_rgba(0,255,255,0.8),0_0_20px_rgba(0,255,255,0.5)]",
        warning && [
          "!text-amber-400 !drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]",
          "animate-pulse",
        ],
        danger && [
          "!text-red-400 !drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]",
          "animate-pulse duration-500",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}
