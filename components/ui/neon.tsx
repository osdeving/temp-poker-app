"use client";

import { cn } from "@/lib/utils";
import React from "react";

// ============================================
// NEON GLOW COMPONENTS
// ============================================

interface NeonTextProps {
    children: React.ReactNode;
    color?: "pink" | "cyan" | "green" | "red";
    className?: string;
}

export function NeonText({
    children,
    color = "cyan",
    className,
}: NeonTextProps) {
    const colorClasses = {
        pink: "text-pink-400 drop-shadow-[0_0_10px_rgba(255,20,147,0.8)]",
        cyan: "text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]",
        green: "text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]",
        red: "text-red-400 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]",
    };

    return (
        <span className={cn(colorClasses[color], className)}>{children}</span>
    );
}

interface NeonCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export function NeonCard({ children, className, hover = true }: NeonCardProps) {
    return (
        <div
            className={cn(
                // Ultra-realistic glass mirror effect
                "glass-mirror glass-reflection",
                "bg-gradient-to-br from-pink-500/25 to-cyan-500/25",
                "bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_50%)]",
                "border border-pink-500/50",
                "backdrop-blur-[6px]",
                "transition-all duration-500 ease-out",
                "rounded-xl",

                // Enhanced glass reflection effects
                "relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:via-transparent before:to-white/8 before:opacity-50",
                "after:absolute after:top-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",

                // Enhanced hover effects with subtle touch
                hover && [
                    "hover:border-cyan-400/70",
                    "hover:bg-gradient-to-br hover:from-pink-500/30 hover:to-cyan-500/30",
                    "hover:shadow-[0_0_25px_rgba(255,20,147,0.4),0_0_50px_rgba(255,20,147,0.3),0_0_75px_rgba(0,255,255,0.2)]",
                    "hover:transform hover:-translate-y-1 hover:scale-[1.01]",
                    "hover:before:opacity-60",
                    "hover:backdrop-blur-[8px]",
                ],

                className
            )}
        >
            {children}
        </div>
    );
}

interface NeonButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
}

export function NeonButton({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className,
    disabled = false,
}: NeonButtonProps) {
    const variants = {
        primary: [
            "bg-gradient-to-r from-pink-500 to-cyan-500",
            "shadow-[0_0_20px_rgba(255,20,147,0.5)]",
            "hover:shadow-[0_0_30px_rgba(255,20,147,0.8),0_0_60px_rgba(0,255,255,0.4)]",
            "hover:transform hover:-translate-y-0.5",
            "text-black font-bold",
        ],
        secondary: [
            "bg-gradient-to-r from-purple-500 to-blue-500",
            "shadow-[0_0_20px_rgba(147,51,234,0.5)]",
            "hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]",
            "hover:transform hover:-translate-y-0.5",
            "text-white font-semibold",
        ],
        danger: [
            "bg-gradient-to-r from-red-500 to-orange-500",
            "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
            "hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]",
            "hover:transform hover:-translate-y-0.5",
            "text-white font-bold",
        ],
        success: [
            "bg-gradient-to-r from-green-500 to-emerald-500",
            "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
            "hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]",
            "hover:transform hover:-translate-y-0.5",
            "text-black font-bold",
        ],
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                // Base styles
                "border-none rounded-lg font-medium text-white",
                "transition-all duration-300 ease-in-out",
                "hover:-translate-y-0.5",
                "flex items-center justify-center gap-2",

                // Variant styles
                variants[variant],

                // Size styles
                sizes[size],

                // Disabled styles
                disabled &&
                    "opacity-50 cursor-not-allowed hover:transform-none",

                className
            )}
        >
            {children}
        </button>
    );
}

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
    return (
        <div
            className={cn(
                // Premium glass morphism with deep mirror effect
                "glass-premium mirror-deep",
                "bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-black/70",
                "bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]",
                "border border-white/30",
                "backdrop-blur-[4px]",
                "rounded-xl",
                "transition-all duration-500 ease-out",

                // Advanced glass reflection and shine effects
                "relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/15 before:via-white/6 before:to-transparent before:opacity-50",
                "after:absolute after:top-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent",

                // Enhanced hover effects with subtle holographic elements
                "hover:border-cyan-400/70",
                "hover:bg-gradient-to-br hover:from-gray-700/75 hover:via-gray-800/55 hover:to-black/75",
                "hover:shadow-[0_0_25px_rgba(255,20,147,0.3),0_0_50px_rgba(0,255,255,0.2),0_0_75px_rgba(255,255,255,0.1)]",
                "hover:before:opacity-70",
                "hover:transform hover:-translate-y-1 hover:scale-[1.005]",
                "hover:backdrop-blur-[6px]",

                className
            )}
        >
            {children}
        </div>
    );
}

interface NeonInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    className?: string;
}

export function NeonInput({
    placeholder,
    value,
    onChange,
    type = "text",
    className,
}: NeonInputProps) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={cn(
                "bg-black/30 border border-cyan-500/30 text-white",
                "px-4 py-2 rounded-lg",
                "transition-all duration-300",
                "focus:border-cyan-500/80 focus:shadow-[0_0_10px_rgba(0,255,255,0.5)]",
                "focus:outline-none",
                "placeholder:text-gray-400",
                className
            )}
        />
    );
}

interface MirrorCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: "light" | "medium" | "heavy";
}

export function MirrorCard({
    children,
    className,
    intensity = "medium",
}: MirrorCardProps) {
    const intensityStyles = {
        light: {
            bg: "bg-gradient-to-br from-white/10 to-gray-800/20",
            blur: "backdrop-blur-[3px]",
            reflection: "before:from-white/12 before:to-transparent",
            shine: "after:via-white/20",
            glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]",
        },
        medium: {
            bg: "bg-gradient-to-br from-white/15 to-gray-700/25",
            blur: "backdrop-blur-[4px]",
            reflection: "before:from-white/18 before:to-transparent",
            shine: "after:via-white/25",
            glow: "hover:shadow-[0_0_25px_rgba(255,255,255,0.12),0_0_50px_rgba(255,20,147,0.15)]",
        },
        heavy: {
            bg: "bg-gradient-to-br from-white/20 to-gray-600/30",
            blur: "backdrop-blur-[6px]",
            reflection: "before:from-white/25 before:to-transparent",
            shine: "after:via-white/35",
            glow: "hover:shadow-[0_0_35px_rgba(255,255,255,0.15),0_0_70px_rgba(255,20,147,0.2),0_0_105px_rgba(0,255,255,0.15)]",
        },
    };

    const styles = intensityStyles[intensity];

    return (
        <div
            className={cn(
                // Enhanced mirror glass effect with holographic touches
                "glass-mirror glass-reflection holographic",
                styles.bg,
                "border border-white/30",
                styles.blur,
                "rounded-xl",
                "transition-all duration-700 ease-out",

                // Advanced mirror reflection effects
                "relative overflow-hidden",
                `before:absolute before:inset-0 before:bg-gradient-to-br ${styles.reflection} before:opacity-80`,
                `after:absolute after:top-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-r after:from-transparent ${styles.shine} after:to-transparent`,

                // Enhanced hover effects with subtle 3D transformation
                "hover:border-white/40",
                "hover:transform hover:-translate-y-1 hover:scale-[1.01]",
                styles.glow,
                "hover:before:opacity-75",
                "hover:backdrop-blur-[8px]",

                // Subtle entrance animation
                "animate-[fadeIn_0.8s_ease-out]",

                className
            )}
        >
            {children}
        </div>
    );
}

// ============================================
// ADVANCED GLASS EFFECTS
// ============================================

interface UltraGlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: "crystal" | "diamond" | "sapphire" | "emerald";
}

export function UltraGlassCard({
    children,
    className,
    variant = "crystal",
}: UltraGlassCardProps) {
    const variants = {
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
    };

    const variantStyles = variants[variant];

    return (
        <div
            className={cn(
                // Ultra-premium glass effect
                "glass-premium mirror-deep glass-reflection",
                variantStyles.bg,
                "border-2",
                variantStyles.border,
                "backdrop-blur-[6px]",
                "rounded-2xl",
                "transition-all duration-700 ease-out",

                // Advanced reflection system (mais sutil)
                "relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-white/8 before:to-transparent before:opacity-60",
                `after:absolute after:top-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-r after:from-transparent ${variantStyles.highlight} after:to-transparent`,

                // Enhanced hover with subtle 3D depth
                "hover:border-opacity-70",
                "hover:transform hover:-translate-y-2 hover:scale-[1.02]",
                variantStyles.glow,
                "hover:before:opacity-75",
                "hover:backdrop-blur-[8px]",

                // Entrance animation
                "animate-[fadeIn_1s_ease-out]",

                className
            )}
        >
            {children}
        </div>
    );
}

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
}

export function HolographicCard({ children, className }: HolographicCardProps) {
    return (
        <div
            className={cn(
                // Holographic base
                "holographic glass-reflection",
                "bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-cyan-500/20",
                "border-2 border-transparent",
                "backdrop-blur-[8px]",
                "rounded-2xl",
                "transition-all duration-500 ease-out",

                // Holographic border animation
                "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-border",
                "p-[2px]",

                // Advanced reflection effects
                "relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/25 before:via-transparent before:to-white/15 before:opacity-60",
                "after:absolute after:top-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-r after:from-pink-400/50 after:via-white/70 after:to-cyan-400/50",

                // Hover effects with color shift
                "hover:transform hover:-translate-y-3 hover:scale-[1.03]",
                "hover:shadow-[0_0_60px_rgba(255,20,147,0.4),0_0_120px_rgba(147,51,234,0.3),0_0_180px_rgba(0,255,255,0.2)]",
                "hover:before:opacity-80",

                className
            )}
        >
            <div className="bg-black/20 rounded-[calc(1rem-2px)] h-full w-full p-6">
                {children}
            </div>
        </div>
    );
}
