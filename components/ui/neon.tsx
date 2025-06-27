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
                // Base styles - matching original neon-card
                "bg-gradient-to-br from-pink-500/10 to-cyan-500/10",
                "border border-pink-500/30",
                "backdrop-blur-[10px]",
                "transition-all duration-300",
                "rounded-lg",

                // Hover effects - matching original glow-pink
                hover && [
                    "hover:border-cyan-500/50",
                    "hover:shadow-[0_0_20px_rgba(255,20,147,0.5),0_0_40px_rgba(255,20,147,0.3)]",
                    "hover:transform hover:-translate-y-1",
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
                // Glass morphism effect
                "bg-gradient-to-br from-gray-900/50 via-black/50 to-gray-900/50",
                "border border-pink-500/30",
                "backdrop-blur-[15px]",
                "rounded-lg",
                "transition-all duration-300",

                // Hover effects similar to poker-card
                "hover:border-cyan-400/50",
                "hover:shadow-[0_0_20px_rgba(255,20,147,0.3)]",

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
