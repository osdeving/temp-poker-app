"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { glassConfig } from "./config";
import type { BaseGlassProps, NeonColor } from "./types";

// ============================================
// HOLOGRAPHIC CARD COMPONENT
// ============================================

interface HolographicCardProps extends BaseGlassProps {
    rainbow?: boolean;
    intensity?: "subtle" | "medium" | "intense";
}

export function HolographicCard({
    children,
    className,
    rainbow = true,
    intensity = "medium",
    hover = true,
    animation = true,
}: HolographicCardProps) {
    const intensityStyles = {
        subtle: {
            bg: "bg-gradient-to-br from-pink-500/10 via-purple-500/8 to-cyan-500/10",
            border: "border-gradient-to-r from-pink-400/30 via-purple-400/30 to-cyan-400/30",
            glow: "hover:shadow-[0_0_40px_rgba(255,20,147,0.2),0_0_80px_rgba(147,51,234,0.15),0_0_120px_rgba(0,255,255,0.1)]",
        },
        medium: {
            bg: "bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-cyan-500/20",
            border: "border-gradient-to-r from-pink-400/50 via-purple-400/50 to-cyan-400/50",
            glow: "hover:shadow-[0_0_60px_rgba(255,20,147,0.3),0_0_120px_rgba(147,51,234,0.2),0_0_180px_rgba(0,255,255,0.15)]",
        },
        intense: {
            bg: "bg-gradient-to-br from-pink-500/30 via-purple-500/25 to-cyan-500/30",
            border: "border-gradient-to-r from-pink-400/70 via-purple-400/70 to-cyan-400/70",
            glow: "hover:shadow-[0_0_80px_rgba(255,20,147,0.4),0_0_160px_rgba(147,51,234,0.3),0_0_240px_rgba(0,255,255,0.2)]",
        },
    };

    const styles = intensityStyles[intensity];

    return (
        <div
            className={cn(
                // Base holographic effect
                "holographic-card relative overflow-hidden",
                styles.bg,
                "border-2 border-transparent",
                "backdrop-blur-[8px]",
                "rounded-2xl",
                "transition-all duration-700 ease-out",

                // Holographic border with animation
                rainbow && [
                    "bg-gradient-to-r from-pink-500 to-cyan-500",
                    "bg-[length:200%_200%]",
                    "animate-[gradient_6s_ease_infinite]",
                    "p-[2px]",
                ],

                // Advanced reflection effects
                "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/25 before:via-transparent before:to-white/15 before:opacity-70",
                "after:absolute after:top-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-r after:from-pink-400/60 after:via-white/80 after:to-cyan-400/60",

                // Hover effects with rainbow shift
                hover && [
                    "hover:transform hover:-translate-y-3 hover:scale-[1.03]",
                    styles.glow,
                    "hover:before:opacity-90",
                    rainbow && "hover:animate-[gradient_2s_ease_infinite]",
                ],

                // Entrance animation
                animation && "animate-[fadeIn_1s_ease-out]",

                className
            )}
        >
            <div
                className={cn(
                    "bg-black/20 rounded-[calc(1rem-2px)] h-full w-full",
                    rainbow ? "p-6" : "p-0"
                )}
            >
                {children}
            </div>
        </div>
    );
}

// ============================================
// FLOATING CARD COMPONENT
// ============================================

interface FloatingCardProps extends BaseGlassProps {
    floatHeight?: "low" | "medium" | "high";
    shadowIntensity?: "soft" | "medium" | "dramatic";
}

export function FloatingCard({
    children,
    className,
    variant = "crystal",
    blur = "medium",
    floatHeight = "medium",
    shadowIntensity = "medium",
    animation = true,
}: FloatingCardProps) {
    const config = glassConfig.variants[variant];
    const blurClass = glassConfig.blur[blur];

    const floatStyles = {
        low: "transform translate-y-[-4px]",
        medium: "transform translate-y-[-8px]",
        high: "transform translate-y-[-12px]",
    };

    const shadowStyles = {
        soft: "shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
        medium: "shadow-[0_16px_64px_rgba(0,0,0,0.3)]",
        dramatic: "shadow-[0_24px_96px_rgba(0,0,0,0.4)]",
    };

    return (
        <div
            className={cn(
                // Base floating effect
                "floating-card",
                config.bg,
                "border-2",
                config.border,
                blurClass,
                "rounded-xl",

                // Floating transformation
                floatStyles[floatHeight],
                shadowStyles[shadowIntensity],

                // Smooth transitions
                "transition-all duration-500 ease-out",

                // Hover effects
                "hover:transform hover:translate-y-[-16px] hover:scale-[1.02]",
                "hover:shadow-[0_32px_128px_rgba(0,0,0,0.5)]",
                config.glow,

                // Floating animation
                animation && "animate-[float_6s_ease-in-out_infinite]",

                className
            )}
        >
            {children}
        </div>
    );
}

// ============================================
// RIPPLE CARD COMPONENT
// ============================================

interface RippleCardProps extends BaseGlassProps {
    rippleColor?: NeonColor;
    triggerOnHover?: boolean;
}

export function RippleCard({
    children,
    className,
    variant = "crystal",
    blur = "medium",
    rippleColor = "cyan",
    triggerOnHover = true,
}: RippleCardProps) {
    const [ripples, setRipples] = useState<
        Array<{ id: number; x: number; y: number }>
    >([]);
    const config = glassConfig.variants[variant];
    const blurClass = glassConfig.blur[blur];
    const colorConfig = glassConfig.neonColors[rippleColor];

    const createRipple = (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newRipple = { id: Date.now(), x, y };

        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) =>
                prev.filter((ripple) => ripple.id !== newRipple.id)
            );
        }, 600);
    };

    return (
        <div
            className={cn(
                // Base card styles
                "ripple-card relative overflow-hidden cursor-pointer",
                config.bg,
                "border-2",
                config.border,
                blurClass,
                "rounded-xl",
                "transition-all duration-300 ease-out",

                // Hover effects
                "hover:transform hover:-translate-y-1 hover:scale-[1.01]",
                config.glow,

                className
            )}
            onClick={createRipple}
            onMouseEnter={triggerOnHover ? createRipple : undefined}
        >
            {children}

            {/* Ripple effects */}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className={cn(
                        "absolute pointer-events-none rounded-full",
                        "animate-[ripple_0.6s_linear]",
                        "bg-white/30",
                        `shadow-[0_0_20px_${
                            colorConfig.glow.split("[")[1].split("]")[0]
                        }]`
                    )}
                    style={{
                        left: ripple.x - 10,
                        top: ripple.y - 10,
                        width: 20,
                        height: 20,
                    }}
                />
            ))}
        </div>
    );
}

// ============================================
// MORPHING CARD COMPONENT
// ============================================

interface MorphingCardProps extends BaseGlassProps {
    morphVariants?: Array<{
        variant:
            | "crystal"
            | "diamond"
            | "sapphire"
            | "emerald"
            | "ruby"
            | "amethyst";
        duration: number;
    }>;
    autoMorph?: boolean;
}

export function MorphingCard({
    children,
    className,
    morphVariants = [
        { variant: "crystal", duration: 3000 },
        { variant: "sapphire", duration: 3000 },
        { variant: "emerald", duration: 3000 },
    ],
    autoMorph = true,
    blur = "medium",
}: MorphingCardProps) {
    const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
    const blurClass = glassConfig.blur[blur];
    const config =
        glassConfig.variants[
            morphVariants[currentVariantIndex]?.variant || "crystal"
        ];

    useEffect(() => {
        if (!autoMorph) return;

        const interval = setInterval(() => {
            setCurrentVariantIndex((prev) => (prev + 1) % morphVariants.length);
        }, morphVariants[currentVariantIndex]?.duration || 3000);

        return () => clearInterval(interval);
    }, [autoMorph, morphVariants, currentVariantIndex]);

    return (
        <div
            className={cn(
                // Base morphing styles
                "morphing-card",
                config.bg,
                "border-2",
                config.border,
                blurClass,
                "rounded-xl",

                // Smooth morphing transition
                "transition-all duration-1000 ease-in-out",

                // Hover effects
                "hover:transform hover:-translate-y-2 hover:scale-[1.02]",
                config.glow,

                className
            )}
        >
            {children}
        </div>
    );
}

// ============================================
// CRYSTAL CARD COMPONENT
// ============================================

interface CrystalCardProps extends Omit<BaseGlassProps, "variant"> {
    variant?: "diamond" | "ruby" | "emerald" | "sapphire" | "prism";
    fractal?: boolean;
    depth?: "shallow" | "medium" | "deep";
}

export function CrystalCard({
    children,
    className,
    variant = "diamond",
    fractal = true,
    depth = "medium",
    hover = true,
    animation = true,
}: CrystalCardProps) {
    const crystalStyles = {
        diamond: {
            bg: "bg-gradient-to-br from-slate-100/20 via-white/15 to-slate-200/20",
            border: "border-white/40",
            shadow: "shadow-[0_8px_32px_rgba(255,255,255,0.15)]",
            glow: "hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]",
        },
        ruby: {
            bg: "bg-gradient-to-br from-red-500/25 via-pink-500/20 to-red-600/25",
            border: "border-red-400/50",
            shadow: "shadow-[0_8px_32px_rgba(239,68,68,0.2)]",
            glow: "hover:shadow-[0_0_60px_rgba(239,68,68,0.5)]",
        },
        emerald: {
            bg: "bg-gradient-to-br from-emerald-500/25 via-green-500/20 to-emerald-600/25",
            border: "border-emerald-400/50",
            shadow: "shadow-[0_8px_32px_rgba(16,185,129,0.2)]",
            glow: "hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]",
        },
        sapphire: {
            bg: "bg-gradient-to-br from-blue-500/25 via-cyan-500/20 to-blue-600/25",
            border: "border-blue-400/50",
            shadow: "shadow-[0_8px_32px_rgba(59,130,246,0.2)]",
            glow: "hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]",
        },
        prism: {
            bg: "bg-gradient-to-br from-pink-500/15 via-purple-500/15 via-blue-500/15 via-green-500/15 to-yellow-500/15",
            border: "border-transparent",
            shadow: "shadow-[0_8px_32px_rgba(139,92,246,0.2)]",
            glow: "hover:shadow-[0_0_60px_rgba(139,92,246,0.4)]",
        },
    };

    const depthStyles = {
        shallow: "backdrop-blur-sm",
        medium: "backdrop-blur-md",
        deep: "backdrop-blur-lg",
    };

    const styles = crystalStyles[variant];

    return (
        <div
            className={cn(
                "crystal-card relative overflow-hidden rounded-2xl border",
                "transform-gpu transition-all duration-500",
                styles.bg,
                styles.border,
                styles.shadow,
                depthStyles[depth],
                hover && [
                    "hover:scale-105 hover:-rotate-1",
                    styles.glow,
                    "hover:border-opacity-80",
                ],
                animation && "animate-crystal",
                fractal && "crystal-fractal",
                className
            )}
        >
            {fractal && (
                <div className="absolute inset-0 opacity-30">
                    <div className="crystal-fractal-pattern h-full w-full" />
                </div>
            )}
            <div className="relative z-10 p-6">{children}</div>

            {/* Crystal reflections */}
            <div className="absolute top-0 left-1/4 w-1/2 h-px bg-white/60" />
            <div className="absolute top-2 left-1/3 w-1/3 h-px bg-white/40" />
            <div className="absolute right-0 top-1/4 h-1/2 w-px bg-white/60" />
        </div>
    );
}

// ============================================
// NEURAL NETWORK CARD COMPONENT
// ============================================

interface NeuralNetworkCardProps extends BaseGlassProps {
    nodes?: number;
    connections?: "sparse" | "medium" | "dense";
    pulse?: boolean;
    theme?: "cyber" | "bio" | "quantum";
}

export function NeuralNetworkCard({
    children,
    className,
    nodes = 12,
    connections = "medium",
    pulse = true,
    theme = "cyber",
    hover = true,
    animation = true,
}: NeuralNetworkCardProps) {
    const [networkNodes, setNetworkNodes] = useState<
        Array<{ x: number; y: number; id: number }>
    >([]);

    useEffect(() => {
        const generateNodes = () => {
            const nodeArray = [];
            for (let i = 0; i < nodes; i++) {
                nodeArray.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    id: i,
                });
            }
            setNetworkNodes(nodeArray);
        };
        generateNodes();
    }, [nodes]);

    const themeStyles = {
        cyber: {
            bg: "bg-gradient-to-br from-cyan-950/80 via-blue-950/70 to-indigo-950/80",
            node: "bg-cyan-400",
            line: "stroke-cyan-300",
            glow: "shadow-cyan-500/30",
        },
        bio: {
            bg: "bg-gradient-to-br from-green-950/80 via-emerald-950/70 to-teal-950/80",
            node: "bg-emerald-400",
            line: "stroke-emerald-300",
            glow: "shadow-emerald-500/30",
        },
        quantum: {
            bg: "bg-gradient-to-br from-purple-950/80 via-violet-950/70 to-fuchsia-950/80",
            node: "bg-purple-400",
            line: "stroke-purple-300",
            glow: "shadow-purple-500/30",
        },
    };

    const connectionDensity = {
        sparse: 0.3,
        medium: 0.5,
        dense: 0.8,
    };

    const styles = themeStyles[theme];
    const density = connectionDensity[connections];

    return (
        <div
            className={cn(
                "neural-network-card relative overflow-hidden rounded-2xl border border-white/20",
                "transform-gpu transition-all duration-700",
                styles.bg,
                "backdrop-blur-sm",
                hover && [
                    "hover:scale-105",
                    `hover:shadow-2xl hover:${styles.glow}`,
                ],
                animation && "animate-neural-pulse",
                className
            )}
        >
            {/* Neural Network Background */}
            <div className="absolute inset-0 opacity-40">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {/* Connections */}
                    {networkNodes.map((node, i) =>
                        networkNodes.slice(i + 1).map((otherNode, j) => {
                            const distance = Math.sqrt(
                                Math.pow(node.x - otherNode.x, 2) +
                                    Math.pow(node.y - otherNode.y, 2)
                            );
                            if (distance < 40 * density) {
                                return (
                                    <line
                                        key={`${i}-${j}`}
                                        x1={node.x}
                                        y1={node.y}
                                        x2={otherNode.x}
                                        y2={otherNode.y}
                                        className={cn(
                                            styles.line,
                                            pulse && "animate-pulse"
                                        )}
                                        strokeWidth="0.2"
                                        opacity="0.6"
                                    />
                                );
                            }
                            return null;
                        })
                    )}

                    {/* Nodes */}
                    {networkNodes.map((node) => (
                        <circle
                            key={node.id}
                            cx={node.x}
                            cy={node.y}
                            r="0.8"
                            className={cn(
                                styles.node,
                                pulse && "animate-pulse"
                            )}
                            opacity="0.8"
                        />
                    ))}
                </svg>
            </div>

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// DIGITAL RAIN CARD COMPONENT
// ============================================

interface DigitalRainCardProps extends BaseGlassProps {
    intensity?: "light" | "medium" | "heavy";
    color?: "green" | "blue" | "purple" | "red";
    speed?: "slow" | "medium" | "fast";
}

export function DigitalRainCard({
    children,
    className,
    intensity = "medium",
    color = "green",
    speed = "medium",
    hover = true,
    animation = true,
}: DigitalRainCardProps) {
    const [rainDrops, setRainDrops] = useState<
        Array<{ id: number; x: number; delay: number }>
    >([]);

    useEffect(() => {
        const intensityMap = { light: 8, medium: 15, heavy: 25 };
        const dropCount = intensityMap[intensity];

        const drops = Array.from({ length: dropCount }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 5,
        }));

        setRainDrops(drops);
    }, [intensity]);

    const colorStyles = {
        green: {
            bg: "bg-gradient-to-br from-green-950/90 via-emerald-900/80 to-black/90",
            text: "text-green-400",
            glow: "shadow-green-500/30",
        },
        blue: {
            bg: "bg-gradient-to-br from-blue-950/90 via-cyan-900/80 to-black/90",
            text: "text-blue-400",
            glow: "shadow-blue-500/30",
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-950/90 via-violet-900/80 to-black/90",
            text: "text-purple-400",
            glow: "shadow-purple-500/30",
        },
        red: {
            bg: "bg-gradient-to-br from-red-950/90 via-pink-900/80 to-black/90",
            text: "text-red-400",
            glow: "shadow-red-500/30",
        },
    };

    const speedClass = {
        slow: "animate-digital-rain-slow",
        medium: "animate-digital-rain",
        fast: "animate-digital-rain-fast",
    };

    const styles = colorStyles[color];

    return (
        <div
            className={cn(
                "digital-rain-card relative overflow-hidden rounded-2xl border border-white/10",
                "transform-gpu transition-all duration-500",
                styles.bg,
                "backdrop-blur-sm",
                hover && [
                    "hover:scale-105",
                    `hover:shadow-2xl hover:${styles.glow}`,
                ],
                className
            )}
        >
            {/* Digital Rain Effect */}
            <div className="absolute inset-0 opacity-20">
                {rainDrops.map((drop) => (
                    <div
                        key={drop.id}
                        className={cn(
                            "absolute top-0 w-px opacity-60",
                            styles.text,
                            animation && speedClass[speed]
                        )}
                        style={{
                            left: `${drop.x}%`,
                            animationDelay: `${drop.delay}s`,
                            height: "200%",
                        }}
                    >
                        <div className="digital-rain-column">
                            {Array.from({ length: 20 }, (_, i) => (
                                <div
                                    key={i}
                                    className="text-xs font-mono leading-none"
                                    style={{ animationDelay: `${i * 0.1}s` }}
                                >
                                    {Math.random() > 0.5 ? "1" : "0"}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// QUANTUM CARD COMPONENT
// ============================================

interface QuantumCardProps extends BaseGlassProps {
    entangled?: boolean;
    probability?: number;
    superposition?: boolean;
    waveFunction?: "sine" | "cosine" | "complex";
}

export function QuantumCard({
    children,
    className,
    entangled = true,
    probability = 0.7,
    superposition = true,
    waveFunction = "complex",
    hover = true,
    animation = true,
}: QuantumCardProps) {
    const [quantumState, setQuantumState] = useState(0);

    useEffect(() => {
        if (!animation) return;

        const interval = setInterval(() => {
            setQuantumState((prev) => (prev + 1) % 360);
        }, 50);

        return () => clearInterval(interval);
    }, [animation]);

    const waveStyles = {
        sine: "animate-quantum-sine",
        cosine: "animate-quantum-cosine",
        complex: "animate-quantum-complex",
    };

    return (
        <div
            className={cn(
                "quantum-card relative overflow-hidden rounded-2xl border",
                "transform-gpu transition-all duration-1000",
                "bg-gradient-to-br from-indigo-950/80 via-purple-900/70 to-violet-950/80",
                "border-purple-400/30 backdrop-blur-sm",
                hover && [
                    "hover:scale-105 hover:rotate-1",
                    "hover:shadow-2xl hover:shadow-purple-500/40",
                    "hover:border-purple-300/50",
                ],
                animation && waveStyles[waveFunction],
                className
            )}
        >
            {/* Quantum Field Effect */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="quantum-field h-full w-full"
                    style={{
                        background: `conic-gradient(from ${quantumState}deg, transparent 0deg, rgba(147, 51, 234, 0.2) 90deg, transparent 180deg, rgba(99, 102, 241, 0.2) 270deg, transparent 360deg)`,
                    }}
                />
            </div>

            {/* Superposition Effect */}
            {superposition && (
                <div className="absolute inset-0 opacity-20">
                    <div
                        className="h-full w-full"
                        style={{
                            background: `linear-gradient(${quantumState}deg, transparent 0%, rgba(168, 85, 247, 0.3) 50%, transparent 100%)`,
                        }}
                    />
                </div>
            )}

            {/* Entanglement Particles */}
            {entangled && (
                <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 6 }, (_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-quantum-particle opacity-60"
                            style={{
                                left: `${(i * 15) % 100}%`,
                                top: `${(i * 20) % 100}%`,
                                animationDelay: `${i * 0.5}s`,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Probability Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50" />

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// DNA HELIX CARD COMPONENT
// ============================================

interface DNAHelixCardProps extends BaseGlassProps {
    rotation?: "clockwise" | "counter-clockwise" | "alternating";
    strands?: 2 | 3 | 4;
    baseColor?: "bio" | "cyber" | "neon";
    helixSpeed?: "slow" | "medium" | "fast";
}

export function DNAHelixCard({
    children,
    className,
    rotation = "clockwise",
    strands = 2,
    baseColor = "bio",
    helixSpeed = "medium",
    hover = true,
    animation = true,
}: DNAHelixCardProps) {
    const colorSchemes = {
        bio: {
            bg: "bg-gradient-to-br from-green-950/80 via-teal-900/70 to-emerald-950/80",
            strand1: "stroke-green-400",
            strand2: "stroke-blue-400",
            strand3: "stroke-purple-400",
            strand4: "stroke-pink-400",
            glow: "shadow-green-500/30",
        },
        cyber: {
            bg: "bg-gradient-to-br from-cyan-950/80 via-blue-900/70 to-indigo-950/80",
            strand1: "stroke-cyan-400",
            strand2: "stroke-blue-400",
            strand3: "stroke-indigo-400",
            strand4: "stroke-purple-400",
            glow: "shadow-cyan-500/30",
        },
        neon: {
            bg: "bg-gradient-to-br from-pink-950/80 via-purple-900/70 to-violet-950/80",
            strand1: "stroke-pink-400",
            strand2: "stroke-purple-400",
            strand3: "stroke-violet-400",
            strand4: "stroke-fuchsia-400",
            glow: "shadow-pink-500/30",
        },
    };

    const speedClasses = {
        slow: "animate-dna-helix-slow",
        medium: "animate-dna-helix",
        fast: "animate-dna-helix-fast",
    };

    const rotationClasses = {
        clockwise: speedClasses[helixSpeed],
        "counter-clockwise": `${speedClasses[helixSpeed]} reverse`,
        alternating: "animate-dna-alternating",
    };

    const scheme = colorSchemes[baseColor];
    const strandColors = [
        scheme.strand1,
        scheme.strand2,
        scheme.strand3,
        scheme.strand4,
    ];

    return (
        <div
            className={cn(
                "dna-helix-card relative overflow-hidden rounded-2xl border border-white/20",
                "transform-gpu transition-all duration-700",
                scheme.bg,
                "backdrop-blur-sm",
                hover && [
                    "hover:scale-105",
                    `hover:shadow-2xl hover:${scheme.glow}`,
                ],
                className
            )}
        >
            {/* DNA Helix Background */}
            <div className="absolute inset-0 opacity-30">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    {Array.from({ length: strands }, (_, strandIndex) => (
                        <g key={strandIndex}>
                            <path
                                d={`M 10 0 Q 50 25 90 50 T 10 100`}
                                fill="none"
                                strokeWidth="2"
                                className={cn(
                                    strandColors[strandIndex],
                                    animation && rotationClasses[rotation]
                                )}
                                style={{
                                    transformOrigin: "50% 50%",
                                    animationDelay: `${strandIndex * 0.2}s`,
                                }}
                            />
                            {/* Base pairs */}
                            {Array.from({ length: 8 }, (_, i) => (
                                <line
                                    key={i}
                                    x1={20 + i * 10}
                                    y1={12.5 + i * 12.5}
                                    x2={80 - i * 10}
                                    y2={12.5 + i * 12.5}
                                    strokeWidth="1"
                                    className={strandColors[strandIndex]}
                                    opacity="0.5"
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            </div>

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// MATRIX CODE CARD COMPONENT
// ============================================

interface MatrixCodeCardProps extends BaseGlassProps {
    codeLanguage?: "javascript" | "python" | "binary" | "hex";
    scrollSpeed?: "slow" | "medium" | "fast";
    codeOpacity?: "low" | "medium" | "high";
    theme?: "green" | "amber" | "blue" | "purple";
}

export function MatrixCodeCard({
    children,
    className,
    codeLanguage = "javascript",
    scrollSpeed = "medium",
    codeOpacity = "medium",
    theme = "green",
    hover = true,
    animation = true,
}: MatrixCodeCardProps) {
    const codeSnippets = {
        javascript: [
            "function()",
            "const x =",
            "if (true)",
            "return data",
            "async await",
            "console.log",
            "Array.map",
            "Object.keys",
        ],
        python: [
            "def func():",
            "import sys",
            "for i in",
            "return value",
            "class Model:",
            "print(data)",
            "lambda x:",
            "try: except:",
        ],
        binary: [
            "01001000",
            "11010010",
            "00110101",
            "10101010",
            "01110001",
            "11000011",
            "00001111",
            "10110101",
        ],
        hex: [
            "0xFF00AA",
            "0x3C4E2A",
            "0xB7D1F0",
            "0xA1C3E8",
            "0x9F2B68",
            "0x4A7C59",
            "0xE8A317",
            "0x2D5F8B",
        ],
    };

    const themeStyles = {
        green: {
            bg: "bg-gradient-to-br from-green-950/90 via-emerald-950/80 to-black/95",
            text: "text-green-400",
            accent: "text-green-300",
            glow: "shadow-green-500/30",
        },
        amber: {
            bg: "bg-gradient-to-br from-amber-950/90 via-yellow-950/80 to-black/95",
            text: "text-amber-400",
            accent: "text-amber-300",
            glow: "shadow-amber-500/30",
        },
        blue: {
            bg: "bg-gradient-to-br from-blue-950/90 via-cyan-950/80 to-black/95",
            text: "text-blue-400",
            accent: "text-blue-300",
            glow: "shadow-blue-500/30",
        },
        purple: {
            bg: "bg-gradient-to-br from-purple-950/90 via-violet-950/80 to-black/95",
            text: "text-purple-400",
            accent: "text-purple-300",
            glow: "shadow-purple-500/30",
        },
    };

    const speedClasses = {
        slow: "animate-matrix-code-slow",
        medium: "animate-matrix-code",
        fast: "animate-matrix-code-fast",
    };

    const opacityLevels = {
        low: "opacity-20",
        medium: "opacity-40",
        high: "opacity-60",
    };

    const styles = themeStyles[theme];
    const codes = codeSnippets[codeLanguage];

    return (
        <div
            className={cn(
                "matrix-code-card relative overflow-hidden rounded-2xl border border-white/10",
                "transform-gpu transition-all duration-500",
                styles.bg,
                "backdrop-blur-sm font-mono",
                hover && [
                    "hover:scale-105",
                    `hover:shadow-2xl hover:${styles.glow}`,
                ],
                className
            )}
        >
            {/* Scrolling Code Background */}
            <div className={cn("absolute inset-0", opacityLevels[codeOpacity])}>
                {Array.from({ length: 8 }, (_, col) => (
                    <div
                        key={col}
                        className={cn(
                            "absolute top-0 text-xs leading-relaxed",
                            styles.text,
                            animation && speedClasses[scrollSpeed]
                        )}
                        style={{
                            left: `${col * 12.5}%`,
                            width: "12%",
                            animationDelay: `${col * 0.3}s`,
                        }}
                    >
                        {Array.from({ length: 50 }, (_, i) => (
                            <div key={i} className="mb-1">
                                {codes[i % codes.length]}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Code Highlights */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 3 }, (_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "absolute h-px bg-gradient-to-r from-transparent via-current to-transparent",
                            styles.accent,
                            animation && "animate-code-highlight"
                        )}
                        style={{
                            top: `${20 + i * 30}%`,
                            animationDelay: `${i * 1.5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// CYBERPUNK NEON CARD COMPONENT
// ============================================

interface CyberpunkNeonCardProps extends BaseGlassProps {
    neonColors?: ("pink" | "cyan" | "purple" | "green" | "orange")[];
    scanlines?: boolean;
    glitch?: boolean;
    cityscape?: boolean;
}

export function CyberpunkNeonCard({
    children,
    className,
    neonColors = ["pink", "cyan"],
    scanlines = true,
    glitch = false,
    cityscape = true,
    hover = true,
    animation = true,
}: CyberpunkNeonCardProps) {
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        if (!glitch || !animation) return;

        const interval = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 150);
        }, 3000 + Math.random() * 2000);

        return () => clearInterval(interval);
    }, [glitch, animation]);

    const colorMapping = {
        pink: "rgb(236, 72, 153)",
        cyan: "rgb(34, 211, 238)",
        purple: "rgb(168, 85, 247)",
        green: "rgb(34, 197, 94)",
        orange: "rgb(251, 146, 60)",
    };

    const primaryColor = colorMapping[neonColors[0]];
    const secondaryColor = colorMapping[neonColors[1] || neonColors[0]];

    return (
        <div
            className={cn(
                "cyberpunk-neon-card relative overflow-hidden rounded-2xl border-2",
                "transform-gpu transition-all duration-500",
                "bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-800/95",
                "backdrop-blur-sm",
                hover && [
                    "hover:scale-105",
                    "hover:shadow-2xl hover:shadow-pink-500/30",
                ],
                glitchActive && glitch && "animate-cyberpunk-glitch",
                className
            )}
            style={{
                borderColor: primaryColor,
                boxShadow: `0 0 20px ${primaryColor}40, inset 0 0 20px ${secondaryColor}20`,
            }}
        >
            {/* Neon Border Glow */}
            <div
                className="absolute inset-0 rounded-2xl opacity-50"
                style={{
                    background: `linear-gradient(45deg, ${primaryColor}20, transparent 50%, ${secondaryColor}20)`,
                }}
            />

            {/* Scanlines Effect */}
            {scanlines && (
                <div className="absolute inset-0 opacity-30">
                    <div className="cyberpunk-scanlines h-full w-full" />
                </div>
            )}

            {/* Cityscape Silhouette */}
            {cityscape && (
                <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20">
                    <div className="cyberpunk-cityscape h-full w-full" />
                </div>
            )}

            {/* Neon Grid Lines */}
            <div className="absolute inset-0 opacity-10">
                <div
                    className="cyberpunk-grid h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(${primaryColor}50 1px, transparent 1px), linear-gradient(90deg, ${primaryColor}50 1px, transparent 1px)`,
                        backgroundSize: "20px 20px",
                    }}
                />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8">
                <div
                    className="w-full h-0.5 rounded"
                    style={{ backgroundColor: primaryColor }}
                />
                <div
                    className="w-0.5 h-full rounded"
                    style={{ backgroundColor: primaryColor }}
                />
            </div>
            <div className="absolute top-0 right-0 w-8 h-8">
                <div
                    className="w-full h-0.5 rounded"
                    style={{ backgroundColor: secondaryColor }}
                />
                <div
                    className="w-0.5 h-full rounded ml-auto"
                    style={{ backgroundColor: secondaryColor }}
                />
            </div>

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// SPACE WARP CARD COMPONENT
// ============================================

interface SpaceWarpCardProps extends BaseGlassProps {
    warpIntensity?: "subtle" | "medium" | "intense";
    starField?: boolean;
    warpDirection?: "horizontal" | "vertical" | "radial";
    warpSpeed?: "slow" | "medium" | "fast";
}

export function SpaceWarpCard({
    children,
    className,
    warpIntensity = "medium",
    starField = true,
    warpDirection = "radial",
    warpSpeed = "medium",
    hover = true,
    animation = true,
}: SpaceWarpCardProps) {
    const [stars, setStars] = useState<
        Array<{ x: number; y: number; size: number; speed: number }>
    >([]);

    useEffect(() => {
        if (!starField) return;

        const starArray = Array.from({ length: 100 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.5,
        }));

        setStars(starArray);
    }, [starField]);

    const intensityStyles = {
        subtle: {
            filter: "blur(0.5px)",
            transform: "perspective(1000px) rotateX(2deg)",
        },
        medium: {
            filter: "blur(1px)",
            transform: "perspective(1000px) rotateX(5deg)",
        },
        intense: {
            filter: "blur(2px)",
            transform: "perspective(1000px) rotateX(10deg)",
        },
    };

    const warpClasses = {
        horizontal: "animate-space-warp-horizontal",
        vertical: "animate-space-warp-vertical",
        radial: "animate-space-warp-radial",
    };

    const speedClasses = {
        slow: "animation-duration-[8s]",
        medium: "animation-duration-[5s]",
        fast: "animation-duration-[3s]",
    };

    return (
        <div
            className={cn(
                "space-warp-card relative overflow-hidden rounded-2xl border border-indigo-500/30",
                "transform-gpu transition-all duration-700",
                "bg-gradient-to-br from-indigo-950/80 via-purple-950/70 to-black/90",
                "backdrop-blur-sm",
                hover && [
                    "hover:scale-105",
                    "hover:shadow-2xl hover:shadow-indigo-500/40",
                ],
                animation && warpClasses[warpDirection],
                animation && speedClasses[warpSpeed],
                className
            )}
        >
            {/* Star Field */}
            {starField && (
                <div className="absolute inset-0">
                    {stars.map((star, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white animate-twinkle"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                animationDelay: `${star.speed}s`,
                                opacity: 0.7,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Warp Effect Lines */}
            <div className="absolute inset-0 opacity-40">
                {Array.from({ length: 20 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"
                        style={{
                            height: "1px",
                            top: `${i * 5}%`,
                            left: "0",
                            right: "0",
                            ...intensityStyles[warpIntensity],
                            animationDelay: `${i * 0.1}s`,
                        }}
                    />
                ))}
            </div>

            {/* Nebula Effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="space-nebula h-full w-full" />
            </div>

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// ============================================
// DIMENSIONAL PORTAL CARD COMPONENT
// ============================================

interface DimensionalPortalCardProps extends BaseGlassProps {
    portalSize?: "small" | "medium" | "large";
    dimensions?: 2 | 3 | 4 | 5;
    energyColor?: "blue" | "purple" | "green" | "orange" | "multicolor";
    rotationSpeed?: "slow" | "medium" | "fast";
    particleCount?: "low" | "medium" | "high";
}

export function DimensionalPortalCard({
    children,
    className,
    portalSize = "medium",
    dimensions = 3,
    energyColor = "multicolor",
    rotationSpeed = "medium",
    particleCount = "medium",
    hover = true,
    animation = true,
}: DimensionalPortalCardProps) {
    const [portalParticles, setPortalParticles] = useState<
        Array<{
            id: number;
            angle: number;
            radius: number;
            speed: number;
            size: number;
            color: string;
        }>
    >([]);

    useEffect(() => {
        const particleCounts = { low: 20, medium: 35, high: 50 };
        const count = particleCounts[particleCount];

        const colors = {
            blue: ["#3b82f6", "#60a5fa", "#93c5fd"],
            purple: ["#8b5cf6", "#a78bfa", "#c4b5fd"],
            green: ["#10b981", "#34d399", "#6ee7b7"],
            orange: ["#f97316", "#fb923c", "#fdba74"],
            multicolor: ["#3b82f6", "#8b5cf6", "#10b981", "#f97316", "#ec4899"],
        };

        const particleArray = Array.from({ length: count }, (_, i) => ({
            id: i,
            angle: (i / count) * 360,
            radius: Math.random() * 40 + 20,
            speed: Math.random() * 2 + 0.5,
            size: Math.random() * 3 + 1,
            color: colors[energyColor][
                Math.floor(Math.random() * colors[energyColor].length)
            ],
        }));

        setPortalParticles(particleArray);
    }, [particleCount, energyColor]);

    const portalSizes = {
        small: { width: "60px", height: "60px" },
        medium: { width: "100px", height: "100px" },
        large: { width: "140px", height: "140px" },
    };

    const speedClasses = {
        slow: "animate-portal-slow",
        medium: "animate-portal",
        fast: "animate-portal-fast",
    };

    const portalStyle = portalSizes[portalSize];

    return (
        <div
            className={cn(
                "dimensional-portal-card relative overflow-hidden rounded-2xl border",
                "transform-gpu transition-all duration-700",
                "bg-gradient-to-br from-black/95 via-indigo-950/80 to-purple-950/90",
                "border-purple-500/30 backdrop-blur-sm",
                hover && [
                    "hover:scale-105",
                    "hover:shadow-2xl hover:shadow-purple-500/50",
                ],
                className
            )}
        >
            {/* Dimensional Portal Center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={cn(
                        "dimensional-portal relative rounded-full",
                        animation && speedClasses[rotationSpeed]
                    )}
                    style={portalStyle}
                >
                    {/* Portal Core */}
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-400/60 via-blue-500/40 to-cyan-400/60 animate-pulse" />

                    {/* Dimension Rings */}
                    {Array.from({ length: dimensions }, (_, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 rounded-full border-2 opacity-40"
                            style={{
                                borderColor:
                                    portalParticles[i * 3]?.color || "#8b5cf6",
                                transform: `scale(${1 + i * 0.2}) rotate(${
                                    i * 45
                                }deg)`,
                                animation: `portal-ring-${i} ${
                                    3 + i
                                }s linear infinite`,
                            }}
                        />
                    ))}

                    {/* Portal Particles */}
                    {portalParticles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute rounded-full portal-particle"
                            style={{
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                backgroundColor: particle.color,
                                left: "50%",
                                top: "50%",
                                transform: `translate(-50%, -50%) rotate(${particle.angle}deg) translateX(${particle.radius}px)`,
                                boxShadow: `0 0 ${particle.size * 2}px ${
                                    particle.color
                                }`,
                                animation: `portal-particle ${
                                    particle.speed * 2
                                }s linear infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Energy Waves */}
            <div className="absolute inset-0 opacity-30">
                {Array.from({ length: 4 }, (_, i) => (
                    <div
                        key={i}
                        className="absolute inset-0 rounded-2xl border border-purple-400/20"
                        style={{
                            animation: `energy-wave ${
                                2 + i * 0.5
                            }s ease-in-out infinite`,
                            animationDelay: `${i * 0.5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Dimensional Distortion */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent animate-dimensional-shift" />

            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}
