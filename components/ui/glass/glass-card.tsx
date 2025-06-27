"use client";

import { cn } from "@/lib/utils";
import { glassConfig } from "./config";
import type { BaseGlassProps } from "./types";

// ============================================
// GLASS CARD COMPONENT
// ============================================

interface GlassCardProps extends BaseGlassProps {
    reflection?: boolean;
    border?: boolean;
}

export function GlassCard({
    children,
    className,
    blur = "medium",
    variant = "crystal",
    hover = true,
    animation = true,
    reflection = true,
    border = true,
}: GlassCardProps) {
    const config = glassConfig.variants[variant];
    const blurClass = glassConfig.blur[blur];

    return (
        <div
            className={cn(
                // Base glass effect
                "glass-premium",
                config.bg,
                border && ["border-2", config.border],
                blurClass,
                "rounded-xl",
                "transition-all duration-500 ease-out",

                // Reflection effects
                reflection && [
                    "relative overflow-hidden",
                    "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-white/8 before:to-transparent before:opacity-60",
                    `after:absolute after:top-0 after:left-0 after:w-full after:h-[4px] after:bg-gradient-to-r after:from-transparent ${config.highlight} after:to-transparent`,
                ],

                // Hover effects
                hover && [
                    "hover:border-opacity-70",
                    "hover:transform hover:-translate-y-2 hover:scale-[1.02]",
                    config.glow,
                    "hover:before:opacity-75",
                ],

                // Entrance animation
                animation && "animate-[fadeIn_1s_ease-out]",

                className
            )}
        >
            {children}
        </div>
    );
}
