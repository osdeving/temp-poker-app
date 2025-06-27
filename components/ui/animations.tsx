"use client";

import { cn } from "@/lib/utils";
import React from "react";

// ============================================
// ANIMATION COMPONENTS
// ============================================

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 500,
    className,
}: FadeInProps) {
    return (
        <div
            className={cn("animate-[fadeIn_0.5s_ease-out_forwards]", className)}
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
}

interface SlideInProps {
    children: React.ReactNode;
    direction?: "left" | "right" | "up" | "down";
    delay?: number;
    duration?: number;
    className?: string;
}

export function SlideIn({
    children,
    direction = "left",
    delay = 0,
    duration = 300,
    className,
}: SlideInProps) {
    const directionClasses = {
        left: "animate-[slideInLeft_0.3s_ease-out_forwards]",
        right: "animate-[slideInRight_0.3s_ease-out_forwards]",
        up: "animate-[slideInUp_0.3s_ease-out_forwards]",
        down: "animate-[slideInDown_0.3s_ease-out_forwards]",
    };

    return (
        <div
            className={cn(directionClasses[direction], className)}
            style={{
                animationDelay: `${delay}ms`,
                animationDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
}

interface BounceProps {
    children: React.ReactNode;
    subtle?: boolean;
    className?: string;
}

export function Bounce({ children, subtle = true, className }: BounceProps) {
    return (
        <div
            className={cn(
                subtle
                    ? "animate-[bounceSubtle_2s_ease-in-out_infinite]"
                    : "animate-bounce",
                className
            )}
        >
            {children}
        </div>
    );
}

interface GlowPulseProps {
    children: React.ReactNode;
    color?: "yellow" | "cyan" | "pink" | "green";
    className?: string;
}

export function GlowPulse({
    children,
    color = "yellow",
    className,
}: GlowPulseProps) {
    const colorClasses = {
        yellow: "animate-[glowPulseYellow_2s_ease-in-out_infinite]",
        cyan: "animate-[glowPulseCyan_2s_ease-in-out_infinite]",
        pink: "animate-[glowPulsePink_2s_ease-in-out_infinite]",
        green: "animate-[glowPulseGreen_2s_ease-in-out_infinite]",
    };

    return <div className={cn(colorClasses[color], className)}>{children}</div>;
}

interface EliminationFlashProps {
    children: React.ReactNode;
    active?: boolean;
    className?: string;
}

export function EliminationFlash({
    children,
    active = false,
    className,
}: EliminationFlashProps) {
    return (
        <div
            className={cn(
                active && "animate-[eliminationFlash_0.5s_ease-in-out]",
                className
            )}
        >
            {children}
        </div>
    );
}

interface LoadingSkeletonProps {
    width?: string;
    height?: string;
    className?: string;
}

export function LoadingSkeleton({
    width = "100%",
    height = "1rem",
    className,
}: LoadingSkeletonProps) {
    return (
        <div
            className={cn(
                "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300",
                "bg-[length:200%_100%] animate-[loading_1.5s_infinite]",
                "rounded",
                className
            )}
            style={{ width, height }}
        />
    );
}

interface HoverGlowProps {
    children: React.ReactNode;
    color?: "cyan" | "pink" | "green" | "red";
    className?: string;
}

export function HoverGlow({
    children,
    color = "cyan",
    className,
}: HoverGlowProps) {
    const glowClasses = {
        cyan: [
            "hover:shadow-[0_0_20px_rgba(0,255,255,0.5),0_0_40px_rgba(0,255,255,0.3)]",
            "hover:border-cyan-400/50",
        ],
        pink: [
            "hover:shadow-[0_0_20px_rgba(255,20,147,0.5),0_0_40px_rgba(255,20,147,0.3)]",
            "hover:border-pink-400/50",
        ],
        green: [
            "hover:shadow-[0_0_20px_rgba(0,255,0,0.5),0_0_40px_rgba(0,255,0,0.3)]",
            "hover:border-green-400/50",
        ],
        red: [
            "hover:shadow-[0_0_20px_rgba(255,0,0,0.5),0_0_40px_rgba(255,0,0,0.3)]",
            "hover:border-red-400/50",
        ],
    };

    return (
        <div
            className={cn(
                "transition-all duration-300",
                "hover:transform hover:-translate-y-1",
                glowClasses[color],
                className
            )}
        >
            {children}
        </div>
    );
}

interface ShimmerEffectProps {
    children: React.ReactNode;
    className?: string;
}

export function ShimmerEffect({ children, className }: ShimmerEffectProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden",
                "before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full",
                "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
                "before:transition-[left] before:duration-500",
                "hover:before:left-[100%]",
                className
            )}
        >
            {children}
        </div>
    );
}
