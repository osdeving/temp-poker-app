"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { glassConfig } from "./config";
import type { GlassVariant, NeonColor } from "./types";

// ============================================
// PARTICLE FIELD COMPONENT
// ============================================

interface ParticleFieldProps {
    children: React.ReactNode;
    className?: string;
    particleCount?: number;
    particleColor?: NeonColor;
    speed?: "slow" | "medium" | "fast";
}

export function ParticleField({
    children,
    className,
    particleCount = 50,
    particleColor = "cyan",
    speed = "medium",
}: ParticleFieldProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<
        Array<{ id: number; x: number; y: number; size: number }>
    >([]);

    const speedMap = {
        slow: "animate-[particle_8s_linear_infinite]",
        medium: "animate-[particle_5s_linear_infinite]",
        fast: "animate-[particle_3s_linear_infinite]",
    };

    const colorConfig = glassConfig.neonColors[particleColor];

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden", className)}
        >
            {/* Particle layer */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className={cn(
                            "absolute rounded-full opacity-60",
                            speedMap[speed],
                            colorConfig.text.replace("text-", "bg-"),
                            `shadow-[0_0_10px_${
                                colorConfig.glow.split("[")[1].split("]")[0]
                            }]`
                        )}
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Content layer */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// ============================================
// GRADIENT SHIFT CARD COMPONENT
// ============================================

interface GradientShiftCardProps {
    children: React.ReactNode;
    className?: string;
    gradients?: Array<string>;
    shiftSpeed?: number;
    blur?: "none" | "light" | "medium" | "heavy";
}

export function GradientShiftCard({
    children,
    className,
    gradients = [
        "from-pink-500/20 via-purple-500/15 to-cyan-500/20",
        "from-blue-500/20 via-indigo-500/15 to-purple-500/20",
        "from-green-500/20 via-emerald-500/15 to-blue-500/20",
        "from-orange-500/20 via-red-500/15 to-pink-500/20",
    ],
    shiftSpeed = 3000,
    blur = "medium",
}: GradientShiftCardProps) {
    const [currentGradient, setCurrentGradient] = useState(0);
    const blurClass = glassConfig.blur[blur];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGradient((prev) => (prev + 1) % gradients.length);
        }, shiftSpeed);

        return () => clearInterval(interval);
    }, [gradients.length, shiftSpeed]);

    return (
        <div
            className={cn(
                // Base styles
                "gradient-shift-card relative overflow-hidden",
                `bg-gradient-to-br ${gradients[currentGradient]}`,
                "border-2 border-white/30",
                blurClass,
                "rounded-xl",

                // Smooth gradient transitions
                "transition-all duration-1000 ease-in-out",

                // Hover effects
                "hover:transform hover:-translate-y-2 hover:scale-[1.02]",
                "hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]",

                className
            )}
        >
            {children}
        </div>
    );
}

// ============================================
// GLITCH CARD COMPONENT
// ============================================

interface GlitchCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: GlassVariant;
    glitchIntensity?: "subtle" | "medium" | "intense";
    triggerOnHover?: boolean;
}

export function GlitchCard({
    children,
    className,
    variant = "crystal",
    glitchIntensity = "medium",
    triggerOnHover = true,
}: GlitchCardProps) {
    const [isGlitching, setIsGlitching] = useState(false);
    const config = glassConfig.variants[variant];

    const triggerGlitch = () => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 500);
    };

    const intensityStyles = {
        subtle: "animate-[glitch_0.3s_ease-in-out]",
        medium: "animate-[glitch_0.5s_ease-in-out]",
        intense: "animate-[glitch_0.8s_ease-in-out]",
    };

    return (
        <div
            className={cn(
                // Base card styles
                "glitch-card relative overflow-hidden",
                config.bg,
                "border-2",
                config.border,
                "backdrop-blur-[8px]",
                "rounded-xl",
                "transition-all duration-300 ease-out",

                // Glitch effect
                isGlitching && [
                    intensityStyles[glitchIntensity],
                    "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:to-blue-500/20 before:mix-blend-difference",
                    "after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-l after:from-green-500/20 after:to-purple-500/20 after:mix-blend-color-dodge",
                ],

                // Hover effects
                "hover:transform hover:-translate-y-1",
                config.glow,

                className
            )}
            onMouseEnter={triggerOnHover ? triggerGlitch : undefined}
            onClick={triggerGlitch}
        >
            {children}
        </div>
    );
}

// ============================================
// LIQUID CARD COMPONENT
// ============================================

interface LiquidCardProps {
    children: React.ReactNode;
    className?: string;
    liquidColor?: NeonColor;
    flowSpeed?: "slow" | "medium" | "fast";
    intensity?: "subtle" | "medium" | "intense";
}

export function LiquidCard({
    children,
    className,
    liquidColor = "cyan",
    flowSpeed = "medium",
    intensity = "medium",
}: LiquidCardProps) {
    const colorConfig = glassConfig.neonColors[liquidColor];

    const speedMap = {
        slow: "animate-[liquid_8s_ease-in-out_infinite]",
        medium: "animate-[liquid_5s_ease-in-out_infinite]",
        fast: "animate-[liquid_3s_ease-in-out_infinite]",
    };

    const intensityMap = {
        subtle: "opacity-30",
        medium: "opacity-50",
        intense: "opacity-70",
    };

    return (
        <div
            className={cn(
                // Base liquid card
                "liquid-card relative overflow-hidden",
                "bg-gradient-to-br from-gray-800/70 via-gray-900/50 to-black/70",
                "border-2 border-white/30",
                "backdrop-blur-[8px]",
                "rounded-xl",
                "transition-all duration-500 ease-out",

                // Hover effects
                "hover:transform hover:-translate-y-2 hover:scale-[1.02]",
                `hover:shadow-[0_0_50px_${
                    colorConfig.glow.split("[")[1].split("]")[0]
                }]`,

                className
            )}
        >
            {/* Liquid flow effect */}
            <div
                className={cn(
                    "absolute inset-0 pointer-events-none",
                    "bg-gradient-to-r",
                    colorConfig.text.replace("text-", "from-") + "/40",
                    "via-transparent",
                    colorConfig.text.replace("text-", "to-") + "/40",
                    speedMap[flowSpeed],
                    intensityMap[intensity]
                )}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// ============================================
// MAGNETIC CARD COMPONENT
// ============================================

interface MagneticCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: GlassVariant;
    magnetStrength?: "weak" | "medium" | "strong";
}

export function MagneticCard({
    children,
    className,
    variant = "crystal",
    magnetStrength = "medium",
}: MagneticCardProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const config = glassConfig.variants[variant];

    const strengthMap = {
        weak: 5,
        medium: 10,
        strong: 15,
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        const strength = strengthMap[magnetStrength];

        setMousePosition({
            x: deltaX * strength,
            y: deltaY * strength,
        });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
    };

    return (
        <div
            ref={cardRef}
            className={cn(
                // Base magnetic card
                "magnetic-card",
                config.bg,
                "border-2",
                config.border,
                "backdrop-blur-[8px]",
                "rounded-xl",
                "transition-all duration-200 ease-out",
                "cursor-pointer",

                // Hover effects
                config.glow,

                className
            )}
            style={{
                transform: `translate(${mousePosition.x}px, ${
                    mousePosition.y
                }px) scale(${isHovering ? 1.02 : 1})`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
}
