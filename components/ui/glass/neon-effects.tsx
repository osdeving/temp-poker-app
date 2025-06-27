"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { glassConfig } from "./config";
import type { NeonColor, NeonEffectProps } from "./types";

// ============================================
// NEON TEXT COMPONENT
// ============================================

interface NeonTextProps extends NeonEffectProps {
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function NeonText({
    children,
    color = "cyan",
    intensity = "medium",
    glow = true,
    className,
    size = "md",
}: NeonTextProps) {
    const config = glassConfig.neonColors[color];

    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
    };

    const intensityClasses = {
        low: "opacity-70",
        medium: "opacity-90",
        high: "opacity-100",
    };

    return (
        <span
            className={cn(
                config.text,
                glow && config.shadow,
                sizeClasses[size],
                intensityClasses[intensity],
                "font-medium",
                className
            )}
        >
            {children}
        </span>
    );
}

// ============================================
// NEON BUTTON COMPONENT
// ============================================

interface NeonButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
    color?: NeonColor;
}

export function NeonButton({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className,
    disabled = false,
    color,
}: NeonButtonProps) {
    const variants = {
        primary: {
            bg: "bg-gradient-to-r from-pink-500 to-cyan-500",
            shadow: "shadow-[0_0_20px_rgba(255,20,147,0.5)]",
            hover: "hover:shadow-[0_0_30px_rgba(255,20,147,0.8),0_0_60px_rgba(0,255,255,0.4)]",
            text: "text-black font-bold",
        },
        secondary: {
            bg: "bg-gradient-to-r from-purple-500 to-blue-500",
            shadow: "shadow-[0_0_20px_rgba(147,51,234,0.5)]",
            hover: "hover:shadow-[0_0_30px_rgba(147,51,234,0.8)]",
            text: "text-white font-semibold",
        },
        danger: {
            bg: "bg-gradient-to-r from-red-500 to-orange-500",
            shadow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
            hover: "hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]",
            text: "text-white font-bold",
        },
        success: {
            bg: "bg-gradient-to-r from-green-500 to-emerald-500",
            shadow: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
            hover: "hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]",
            text: "text-black font-bold",
        },
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    const variantConfig = variants[variant];

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                // Base styles
                "border-none rounded-lg font-medium",
                "transition-all duration-300 ease-in-out",
                "hover:-translate-y-0.5",
                "flex items-center justify-center gap-2",

                // Variant styles
                variantConfig.bg,
                variantConfig.shadow,
                variantConfig.hover,
                variantConfig.text,

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

// ============================================
// NEON INPUT COMPONENT
// ============================================

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    color?: NeonColor;
    intensity?: "low" | "medium" | "high";
    glow?: boolean;
}

export function NeonInput({
    color = "cyan",
    intensity = "medium",
    glow = true,
    className,
    ...props
}: NeonInputProps) {
    const config = glassConfig.neonColors[color];

    const intensityClasses = {
        low: "opacity-70",
        medium: "opacity-90",
        high: "opacity-100",
    };

    return (
        <input
            className={cn(
                // Base styles
                "w-full px-4 py-2 rounded-lg border border-gray-600",
                "bg-black/40 backdrop-blur-sm",
                "text-white placeholder-gray-400",
                "transition-all duration-300",
                "focus:outline-none focus:ring-2",

                // Neon effects
                config.text,
                glow && config.shadow,
                glow && "hover:shadow-lg focus:shadow-lg",
                intensityClasses[intensity],

                // Focus effects
                "focus:border-current focus:border-opacity-80",
                glow && `focus:${config.shadow}`,

                className
            )}
            {...props}
        />
    );
}
