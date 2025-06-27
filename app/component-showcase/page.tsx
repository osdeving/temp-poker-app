"use client";

import {
    Bounce,
    FadeIn,
    GlowPulse,
    HoverGlow,
    SlideIn,
} from "@/components/ui/animations";
import {
    GlassCard,
    NeonButton,
    NeonCard,
    NeonInput,
    NeonText,
} from "@/components/ui/neon";
import { PokerCard, PokerChip, PotContainer } from "@/components/ui/poker";
import {
    ClockDisplay,
    PlayerBadge,
    RankingItem,
    StatusBadge,
} from "@/components/ui/status";

export default function ComponentShowcasePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <FadeIn>
                    <h1 className="text-4xl font-bold text-center mb-8">
                        <NeonText color="cyan">Component Showcase</NeonText>
                    </h1>
                </FadeIn>

                {/* Neon Components Section */}
                <SlideIn direction="left">
                    <NeonCard className="p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            <NeonText color="pink">Neon Components</NeonText>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <NeonText color="cyan">Cyan Neon Text</NeonText>
                                <NeonText color="pink">Pink Neon Text</NeonText>
                                <NeonText color="green">
                                    Green Neon Text
                                </NeonText>
                                <NeonText color="red">Red Neon Text</NeonText>
                            </div>
                            <div className="space-y-4">
                                <NeonButton variant="primary">
                                    Primary Button
                                </NeonButton>
                                <NeonButton variant="secondary">
                                    Secondary Button
                                </NeonButton>
                                <NeonButton variant="danger">
                                    Danger Button
                                </NeonButton>
                                <NeonButton variant="success">
                                    Success Button
                                </NeonButton>
                            </div>
                        </div>
                        <div className="mt-4">
                            <NeonInput placeholder="Enter your name..." />
                        </div>
                    </NeonCard>
                </SlideIn>

                {/* Status Components Section */}
                <SlideIn direction="right" delay={200}>
                    <GlassCard className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            Status Components
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <StatusBadge status="upcoming">
                                    Upcoming
                                </StatusBadge>
                                <StatusBadge status="running">
                                    Running
                                </StatusBadge>
                                <StatusBadge status="paused">
                                    Paused
                                </StatusBadge>
                                <StatusBadge status="finished">
                                    Finished
                                </StatusBadge>
                            </div>
                            <div className="space-y-4">
                                <PlayerBadge type="director">
                                    Director
                                </PlayerBadge>
                                <PlayerBadge type="registered">
                                    Registered
                                </PlayerBadge>
                                <PlayerBadge type="manual">Manual</PlayerBadge>
                            </div>
                        </div>
                        <div className="mt-4">
                            <ClockDisplay warning>02:30</ClockDisplay>
                        </div>
                    </GlassCard>
                </SlideIn>

                {/* Poker Components Section */}
                <SlideIn direction="up" delay={400}>
                    <NeonCard className="p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            <NeonText color="green">Poker Components</NeonText>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">
                                    Playing Cards
                                </h3>
                                <div className="flex gap-2">
                                    <PokerCard
                                        suit="hearts"
                                        rank="A"
                                        size="md"
                                    />
                                    <PokerCard
                                        suit="spades"
                                        rank="K"
                                        size="md"
                                    />
                                    <PokerCard faceDown size="md" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">
                                    Poker Chips
                                </h3>
                                <div className="flex gap-4">
                                    <PokerChip value={1000} count={3} />
                                    <PokerChip value={100} count={2} />
                                    <PokerChip value={25} count={4} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <PotContainer amount={15250} />
                        </div>
                    </NeonCard>
                </SlideIn>

                {/* Animation Components Section */}
                <FadeIn delay={600}>
                    <GlassCard className="p-6">
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            Animation Components
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Bounce>
                                <div className="bg-blue-500 p-4 rounded text-white text-center">
                                    Bouncing Element
                                </div>
                            </Bounce>
                            <GlowPulse color="pink">
                                <div className="bg-gray-800 p-4 rounded text-white text-center border border-pink-500">
                                    Glowing Element
                                </div>
                            </GlowPulse>
                            <HoverGlow color="cyan">
                                <div className="bg-gray-800 p-4 rounded text-white text-center border border-cyan-500 cursor-pointer">
                                    Hover for Glow
                                </div>
                            </HoverGlow>
                        </div>
                    </GlassCard>
                </FadeIn>

                {/* Ranking Example */}
                <SlideIn direction="left" delay={800}>
                    <NeonCard className="p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            <NeonText color="cyan">Ranking Example</NeonText>
                        </h2>
                        <div className="space-y-2">
                            <RankingItem position={1}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-yellow-400">
                                        1st Place - John Doe
                                    </span>
                                    <span className="text-green-400">
                                        $50,000
                                    </span>
                                </div>
                            </RankingItem>
                            <RankingItem position={2}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-300">
                                        2nd Place - Jane Smith
                                    </span>
                                    <span className="text-green-400">
                                        $30,000
                                    </span>
                                </div>
                            </RankingItem>
                            <RankingItem position={3}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-orange-400">
                                        3rd Place - Bob Johnson
                                    </span>
                                    <span className="text-green-400">
                                        $20,000
                                    </span>
                                </div>
                            </RankingItem>
                            <RankingItem position={4} isEliminated>
                                <div className="flex justify-between items-center">
                                    <span className="text-red-400">
                                        4th Place - Alice Brown (Eliminated)
                                    </span>
                                    <span className="text-gray-400">$0</span>
                                </div>
                            </RankingItem>
                        </div>
                    </NeonCard>
                </SlideIn>
            </div>
        </div>
    );
}
