"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { glassConfig } from "./config";
import type { BaseGlassProps } from "./types";

// ============================================
// GLASS INPUT COMPONENT
// ============================================

interface GlassInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    className?: string;
    blur?: "none" | "light" | "medium" | "heavy";
    variant?: "crystal" | "diamond" | "sapphire" | "emerald";
}

export function GlassInput({
    placeholder,
    value,
    onChange,
    type = "text",
    className,
    blur = "light",
    variant = "crystal",
}: GlassInputProps) {
    const config = glassConfig.variants[variant];
    const blurClass = glassConfig.blur[blur];

    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={cn(
                // Base styles
                "w-full px-4 py-3 rounded-lg",
                "text-white placeholder:text-gray-400",
                "transition-all duration-300",
                "outline-none focus:outline-none",

                // Glass effect
                config.bg,
                "border-2",
                config.border,
                blurClass,

                // Focus effects
                "focus:border-opacity-80",
                "focus:scale-[1.02]",
                config.glow.replace("hover:", "focus:"),

                className
            )}
        />
    );
}

// ============================================
// GLASS MODAL COMPONENT
// ============================================

interface GlassModalProps extends BaseGlassProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export function GlassModal({
    children,
    isOpen,
    onClose,
    title,
    size = "md",
    variant = "crystal",
    blur = "heavy",
    className,
}: GlassModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    const config = glassConfig.variants[variant];
    const blurClass = glassConfig.blur[blur];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    // Base modal styles
                    "relative w-full rounded-xl",
                    sizeClasses[size],

                    // Glass effect
                    config.bg,
                    "border-2",
                    config.border,
                    blurClass,

                    // Animation
                    "animate-[fadeIn_0.3s_ease-out]",
                    "transform-gpu",

                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="p-6 border-b border-white/20">
                        <h2 className="text-xl font-bold text-white">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// ============================================
// GLASS NAVIGATION COMPONENT
// ============================================

interface GlassNavProps extends BaseGlassProps {
    items: Array<{
        label: string;
        href?: string;
        onClick?: () => void;
        active?: boolean;
    }>;
    orientation?: "horizontal" | "vertical";
}

export function GlassNav({
    items,
    orientation = "horizontal",
    variant = "crystal",
    blur = "medium",
    className,
}: GlassNavProps) {
    const config = glassConfig.variants[variant];
    const blurClass = glassConfig.blur[blur];

    return (
        <nav
            className={cn(
                // Base nav styles
                "p-2 rounded-xl",
                orientation === "horizontal"
                    ? "flex flex-row gap-2"
                    : "flex flex-col gap-2",

                // Glass effect
                config.bg,
                "border",
                config.border,
                blurClass,

                className
            )}
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className={cn(
                        // Base button styles
                        "px-4 py-2 rounded-lg transition-all duration-200",
                        "text-white font-medium",

                        // Active/inactive styles
                        item.active
                            ? [
                                  "bg-white/20",
                                  "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
                                  "text-white",
                              ]
                            : [
                                  "hover:bg-white/10",
                                  "hover:text-white",
                                  "text-gray-300",
                              ]
                    )}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    );
}
