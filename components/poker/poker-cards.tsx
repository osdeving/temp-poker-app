"use client";

import { Card as CardType } from "@/lib/poker-engine";

interface PlayingCardProps {
    card?: CardType;
    isHidden?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    style?: React.CSSProperties;
}

export function PlayingCard({
    card,
    isHidden = false,
    size = "md",
    className = "",
    style,
}: PlayingCardProps) {
    const sizeClasses = {
        sm: "w-10 h-14 text-xs",
        md: "w-14 h-20 text-sm",
        lg: "w-20 h-28 text-lg", // Usando classes Tailwind padrão
    };

    const getSuitColor = (suit: string) => {
        return suit === "♥" || suit === "♦" ? "text-red-600" : "text-black";
    };

    const getSuitSymbol = (suit: string) => {
        const symbols = {
            "♠": "♠",
            "♥": "♥",
            "♦": "♦",
            "♣": "♣",
        };
        return symbols[suit as keyof typeof symbols] || suit;
    };

    if (isHidden || !card) {
        return (
            <div
                className={`
                    ${sizeClasses[size]}
                    ${className}
                    playing-card-hidden
                    flex items-center justify-center
                    relative
                    overflow-hidden
                    bg-gradient-to-br from-blue-500 to-blue-700
                    border-2 border-blue-800
                    shadow-lg
                `}
                style={{ ...style, opacity: 1 }}
            >
                {/* Card back pattern */}
                <div className="absolute inset-0 opacity-80">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700"></div>
                    <div className="absolute inset-1 border border-blue-300 opacity-60"></div>
                    <div className="absolute inset-2 border border-blue-300 opacity-40"></div>
                </div>
                <div className="relative text-white font-bold text-lg">🂠</div>
            </div>
        );
    }

    return (
        <div
            className={`
                ${sizeClasses[size]}
                ${className}
                playing-card-white
                border-2 border-gray-800
                shadow-lg
                relative
                overflow-hidden
            `}
            style={{
                ...style,
                backgroundColor: "#ffffff",
                opacity: 1,
            }}
        >
            {/* Fundo branco absoluto - primeira camada */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: "#ffffff",
                    background: "#ffffff",
                }}
            />

            {/* Conteúdo da carta - sempre acima do fundo */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-1">
                {/* Canto superior esquerdo */}
                <div
                    className={`flex flex-col items-start text-xs font-bold ${getSuitColor(
                        card.suit
                    )}`}
                >
                    <div className="leading-none">{card.rank}</div>
                    <div className="leading-none">
                        {getSuitSymbol(card.suit)}
                    </div>
                </div>

                {/* Símbolo central */}
                <div
                    className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${getSuitColor(
                        card.suit
                    )}`}
                >
                    {getSuitSymbol(card.suit)}
                </div>

                {/* Canto inferior direito (rotacionado) - apenas para cartas médias e grandes */}
                {size !== "sm" && (
                    <div
                        className={`self-end flex flex-col items-end text-xs font-bold ${getSuitColor(
                            card.suit
                        )}`}
                    >
                        <div className="leading-none transform rotate-180">
                            {getSuitSymbol(card.suit)}
                        </div>
                        <div className="leading-none transform rotate-180">
                            {card.rank}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface PlayerHandProps {
    cards: CardType[];
    isRevealed?: boolean;
    size?: "sm" | "md" | "lg";
}

export function PlayerHand({
    cards,
    isRevealed = false,
    size = "sm",
}: PlayerHandProps) {
    return (
        <div className="flex gap-1">
            {cards.map((card, index) => (
                <PlayingCard
                    key={index}
                    card={isRevealed ? card : undefined}
                    isHidden={!isRevealed}
                    size={size}
                />
            ))}
        </div>
    );
}

interface PotDisplayProps {
    amount: number;
    className?: string;
}

export function PotDisplay({ amount, className = "" }: PotDisplayProps) {
    return (
        <div className={`text-center mb-4 ${className}`}>
            <div className="inline-block bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-3 rounded-full shadow-lg relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur-sm opacity-70"></div>
                <div className="relative z-10">
                    <div className="text-lg font-bold">💰 POT</div>
                    <div className="text-2xl font-black">
                        ${amount.toLocaleString()}
                    </div>
                </div>

                {/* Chips animation */}
                <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="absolute -top-1 -right-4">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="absolute -top-3 -left-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
            </div>
        </div>
    );
}

interface ChipStackProps {
    amount: number;
    size?: "sm" | "md" | "lg";
    animated?: boolean;
}

export function ChipStack({
    amount,
    size = "md",
    animated = false,
}: ChipStackProps) {
    const getChipColor = (value: number) => {
        if (value >= 1000) return "bg-black border-white";
        if (value >= 500) return "bg-purple-600 border-purple-300";
        if (value >= 100) return "bg-green-600 border-green-300";
        if (value >= 25) return "bg-blue-600 border-blue-300";
        if (value >= 5) return "bg-red-600 border-red-300";
        return "bg-white border-gray-600 text-black";
    };

    const chipSize = {
        sm: "w-6 h-6 text-xs",
        md: "w-8 h-8 text-sm",
        lg: "w-10 h-10 text-base",
    }[size];

    const chips = [];
    let remaining = amount;
    const denominations = [1000, 500, 100, 25, 5, 1];

    for (const denom of denominations) {
        const count = Math.floor(remaining / denom);
        if (count > 0) {
            chips.push({ value: denom, count: Math.min(count, 5) }); // Max 5 chips per stack
            remaining -= count * denom;
        }
    }

    return (
        <div className="flex items-end gap-1">
            {chips.map(({ value, count }, stackIndex) => (
                <div key={value} className="relative">
                    {Array.from({ length: count }).map((_, chipIndex) => (
                        <div
                            key={chipIndex}
                            className={`
                                ${chipSize}
                                ${getChipColor(value)}
                                rounded-full
                                border-2
                                flex items-center justify-center
                                font-bold
                                text-xs
                                absolute
                                ${animated ? "animate-pulse" : ""}
                            `}
                            style={{
                                bottom: `${chipIndex * 2}px`,
                                left: 0,
                                zIndex: chipIndex + 1,
                            }}
                        >
                            {value >= 1000
                                ? "1K"
                                : value >= 500
                                ? "500"
                                : value >= 100
                                ? "100"
                                : value >= 25
                                ? "25"
                                : value >= 5
                                ? "5"
                                : "1"}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
