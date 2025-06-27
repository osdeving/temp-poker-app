"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
    BlurIntensity,
    GlassVariant,
    NeonColor,
} from "@/components/ui/glass";
import {
    GlassCard,
    NeonButton,
    NeonText,
    glassConfig,
} from "@/components/ui/glass";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function InteractiveShowcase() {
    // Glass Card Controls
    const [blurIntensity, setBlurIntensity] = useState<BlurIntensity>("medium");
    const [glassVariant, setGlassVariant] = useState<GlassVariant>("crystal");
    const [hasHover, setHasHover] = useState(true);
    const [hasReflection, setHasReflection] = useState(true);
    const [hasBorder, setHasBorder] = useState(true);
    const [hasAnimation, setHasAnimation] = useState(true);

    // Neon Text Controls
    const [neonColor, setNeonColor] = useState<NeonColor>("cyan");
    const [neonIntensity, setNeonIntensity] = useState<
        "low" | "medium" | "high"
    >("medium");
    const [hasGlow, setHasGlow] = useState(true);
    const [textSize, setTextSize] = useState<"sm" | "md" | "lg" | "xl" | "2xl">(
        "lg"
    );

    // Neon Button Controls
    const [buttonVariant, setButtonVariant] = useState<
        "primary" | "secondary" | "danger" | "success"
    >("primary");
    const [buttonSize, setButtonSize] = useState<"sm" | "md" | "lg">("md");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Glass Components Showcase
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Interactive demonstration of reusable glass and neon UI
                        components
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="xl:col-span-1 space-y-6">
                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Glass Card Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-gray-300">
                                        Blur Intensity
                                    </Label>
                                    <Select
                                        value={blurIntensity}
                                        onValueChange={(value) =>
                                            setBlurIntensity(
                                                value as BlurIntensity
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                None
                                            </SelectItem>
                                            <SelectItem value="light">
                                                Light
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="heavy">
                                                Heavy
                                            </SelectItem>
                                            <SelectItem value="extreme">
                                                Extreme
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-gray-300">
                                        Glass Variant
                                    </Label>
                                    <Select
                                        value={glassVariant}
                                        onValueChange={(value) =>
                                            setGlassVariant(
                                                value as GlassVariant
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="crystal">
                                                Crystal
                                            </SelectItem>
                                            <SelectItem value="diamond">
                                                Diamond
                                            </SelectItem>
                                            <SelectItem value="sapphire">
                                                Sapphire
                                            </SelectItem>
                                            <SelectItem value="emerald">
                                                Emerald
                                            </SelectItem>
                                            <SelectItem value="ruby">
                                                Ruby
                                            </SelectItem>
                                            <SelectItem value="amethyst">
                                                Amethyst
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">
                                        Hover Effects
                                    </Label>
                                    <Switch
                                        checked={hasHover}
                                        onCheckedChange={setHasHover}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">
                                        Reflection
                                    </Label>
                                    <Switch
                                        checked={hasReflection}
                                        onCheckedChange={setHasReflection}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">
                                        Border
                                    </Label>
                                    <Switch
                                        checked={hasBorder}
                                        onCheckedChange={setHasBorder}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">
                                        Animation
                                    </Label>
                                    <Switch
                                        checked={hasAnimation}
                                        onCheckedChange={setHasAnimation}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Neon Text Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-gray-300">
                                        Color
                                    </Label>
                                    <Select
                                        value={neonColor}
                                        onValueChange={(value) =>
                                            setNeonColor(value as NeonColor)
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pink">
                                                Pink
                                            </SelectItem>
                                            <SelectItem value="cyan">
                                                Cyan
                                            </SelectItem>
                                            <SelectItem value="green">
                                                Green
                                            </SelectItem>
                                            <SelectItem value="red">
                                                Red
                                            </SelectItem>
                                            <SelectItem value="blue">
                                                Blue
                                            </SelectItem>
                                            <SelectItem value="purple">
                                                Purple
                                            </SelectItem>
                                            <SelectItem value="orange">
                                                Orange
                                            </SelectItem>
                                            <SelectItem value="yellow">
                                                Yellow
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-gray-300">
                                        Intensity
                                    </Label>
                                    <Select
                                        value={neonIntensity}
                                        onValueChange={(value) =>
                                            setNeonIntensity(
                                                value as
                                                    | "low"
                                                    | "medium"
                                                    | "high"
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-gray-300">
                                        Size
                                    </Label>
                                    <Select
                                        value={textSize}
                                        onValueChange={(value) =>
                                            setTextSize(
                                                value as
                                                    | "sm"
                                                    | "md"
                                                    | "lg"
                                                    | "xl"
                                                    | "2xl"
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sm">
                                                Small
                                            </SelectItem>
                                            <SelectItem value="md">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="lg">
                                                Large
                                            </SelectItem>
                                            <SelectItem value="xl">
                                                X-Large
                                            </SelectItem>
                                            <SelectItem value="2xl">
                                                2X-Large
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">
                                        Glow Effect
                                    </Label>
                                    <Switch
                                        checked={hasGlow}
                                        onCheckedChange={setHasGlow}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800/50 border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Button Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-gray-300">
                                        Variant
                                    </Label>
                                    <Select
                                        value={buttonVariant}
                                        onValueChange={(value) =>
                                            setButtonVariant(
                                                value as
                                                    | "primary"
                                                    | "secondary"
                                                    | "danger"
                                                    | "success"
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">
                                                Primary
                                            </SelectItem>
                                            <SelectItem value="secondary">
                                                Secondary
                                            </SelectItem>
                                            <SelectItem value="danger">
                                                Danger
                                            </SelectItem>
                                            <SelectItem value="success">
                                                Success
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-gray-300">
                                        Size
                                    </Label>
                                    <Select
                                        value={buttonSize}
                                        onValueChange={(value) =>
                                            setButtonSize(
                                                value as "sm" | "md" | "lg"
                                            )
                                        }
                                    >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sm">
                                                Small
                                            </SelectItem>
                                            <SelectItem value="md">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="lg">
                                                Large
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Panel */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Live Preview
                            </h2>
                        </div>

                        {/* Glass Card Preview */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">
                                Glass Card Component
                            </h3>
                            <GlassCard
                                blur={blurIntensity}
                                variant={glassVariant}
                                hover={hasHover}
                                reflection={hasReflection}
                                border={hasBorder}
                                animation={hasAnimation}
                                className="p-8"
                            >
                                <div className="text-center space-y-4">
                                    <NeonText
                                        color={neonColor}
                                        intensity={neonIntensity}
                                        glow={hasGlow}
                                        size={textSize}
                                    >
                                        Glass Card Component
                                    </NeonText>
                                    <p className="text-gray-300">
                                        This is a customizable glass card with
                                        configurable blur, variant, and effects.
                                    </p>
                                    <div className="flex gap-4 justify-center flex-wrap">
                                        <NeonButton
                                            variant={buttonVariant}
                                            size={buttonSize}
                                        >
                                            Primary Action
                                        </NeonButton>
                                        <NeonButton
                                            variant="secondary"
                                            size={buttonSize}
                                        >
                                            Secondary
                                        </NeonButton>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Grid of Variants */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">
                                All Glass Variants
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.keys(glassConfig.variants).map(
                                    (variant) => (
                                        <GlassCard
                                            key={variant}
                                            variant={variant as GlassVariant}
                                            blur="medium"
                                            className="p-4 text-center"
                                        >
                                            <NeonText
                                                size="md"
                                                className="capitalize font-semibold"
                                            >
                                                {variant}
                                            </NeonText>
                                        </GlassCard>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Neon Colors Grid */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">
                                Neon Colors
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {Object.keys(glassConfig.neonColors).map(
                                    (color) => (
                                        <GlassCard
                                            key={color}
                                            className="p-4 text-center"
                                        >
                                            <NeonText
                                                color={color as NeonColor}
                                                size="lg"
                                                className="capitalize font-bold"
                                            >
                                                {color}
                                            </NeonText>
                                        </GlassCard>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
