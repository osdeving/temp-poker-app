import type { GlassConfig } from "./types";

// ============================================
// GLASS COMPONENTS CONFIGURATION
// ============================================

export const glassConfig: GlassConfig = {
    blur: {
        none: "backdrop-blur-[0px]",
        light: "backdrop-blur-[2px]",
        medium: "backdrop-blur-[6px]",
        heavy: "backdrop-blur-[12px]",
        extreme: "backdrop-blur-[20px]",
    },
    variants: {
        crystal: {
            bg: "bg-gradient-to-br from-white/25 to-gray-100/15",
            border: "border-white/40",
            glow: "hover:shadow-[0_0_50px_rgba(255,255,255,0.3),0_0_100px_rgba(255,255,255,0.15)]",
            highlight: "after:via-white/60",
        },
        diamond: {
            bg: "bg-gradient-to-br from-blue-200/20 to-cyan-300/15",
            border: "border-cyan-300/50",
            glow: "hover:shadow-[0_0_50px_rgba(0,255,255,0.4),0_0_100px_rgba(0,255,255,0.2)]",
            highlight: "after:via-cyan-300/60",
        },
        sapphire: {
            bg: "bg-gradient-to-br from-blue-500/20 to-indigo-600/15",
            border: "border-blue-400/50",
            glow: "hover:shadow-[0_0_50px_rgba(59,130,246,0.4),0_0_100px_rgba(99,102,241,0.2)]",
            highlight: "after:via-blue-400/60",
        },
        emerald: {
            bg: "bg-gradient-to-br from-emerald-400/20 to-green-500/15",
            border: "border-emerald-400/50",
            glow: "hover:shadow-[0_0_50px_rgba(16,185,129,0.4),0_0_100px_rgba(34,197,94,0.2)]",
            highlight: "after:via-emerald-400/60",
        },
        ruby: {
            bg: "bg-gradient-to-br from-red-400/20 to-pink-500/15",
            border: "border-red-400/50",
            glow: "hover:shadow-[0_0_50px_rgba(239,68,68,0.4),0_0_100px_rgba(236,72,153,0.2)]",
            highlight: "after:via-red-400/60",
        },
        amethyst: {
            bg: "bg-gradient-to-br from-purple-400/20 to-violet-500/15",
            border: "border-purple-400/50",
            glow: "hover:shadow-[0_0_50px_rgba(147,51,234,0.4),0_0_100px_rgba(139,92,246,0.2)]",
            highlight: "after:via-purple-400/60",
        },
    },
    neonColors: {
        pink: {
            text: "text-pink-400",
            shadow: "drop-shadow-[0_0_10px_rgba(255,20,147,0.8)]",
            glow: "shadow-[0_0_20px_rgba(255,20,147,0.5)]",
        },
        cyan: {
            text: "text-cyan-400",
            shadow: "drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]",
            glow: "shadow-[0_0_20px_rgba(0,255,255,0.5)]",
        },
        green: {
            text: "text-green-400",
            shadow: "drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]",
            glow: "shadow-[0_0_20px_rgba(0,255,0,0.5)]",
        },
        red: {
            text: "text-red-400",
            shadow: "drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]",
            glow: "shadow-[0_0_20px_rgba(255,0,0,0.5)]",
        },
        blue: {
            text: "text-blue-400",
            shadow: "drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]",
            glow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]",
        },
        purple: {
            text: "text-purple-400",
            shadow: "drop-shadow-[0_0_10px_rgba(147,51,234,0.8)]",
            glow: "shadow-[0_0_20px_rgba(147,51,234,0.5)]",
        },
        orange: {
            text: "text-orange-400",
            shadow: "drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]",
            glow: "shadow-[0_0_20px_rgba(251,146,60,0.5)]",
        },
        yellow: {
            text: "text-yellow-400",
            shadow: "drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]",
            glow: "shadow-[0_0_20px_rgba(250,204,21,0.5)]",
        },
    },
};
