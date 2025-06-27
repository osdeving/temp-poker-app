// ============================================
// GLASS COMPONENTS TYPES & INTERFACES
// ============================================

export type BlurIntensity = "none" | "light" | "medium" | "heavy" | "extreme";
export type GlassVariant =
    | "crystal"
    | "diamond"
    | "sapphire"
    | "emerald"
    | "ruby"
    | "amethyst";
export type NeonColor =
    | "pink"
    | "cyan"
    | "green"
    | "red"
    | "blue"
    | "purple"
    | "orange"
    | "yellow";

export interface BaseGlassProps {
    children: React.ReactNode;
    className?: string;
    blur?: BlurIntensity;
    variant?: GlassVariant;
    hover?: boolean;
    animation?: boolean;
}

export interface NeonEffectProps {
    color?: NeonColor;
    intensity?: "low" | "medium" | "high";
    glow?: boolean;
}

export interface GlassConfig {
    blur: {
        none: string;
        light: string;
        medium: string;
        heavy: string;
        extreme: string;
    };
    variants: Record<
        GlassVariant,
        {
            bg: string;
            border: string;
            glow: string;
            highlight: string;
        }
    >;
    neonColors: Record<
        NeonColor,
        {
            text: string;
            shadow: string;
            glow: string;
        }
    >;
}
