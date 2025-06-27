"use client";

interface PokerPotProps {
    amount: number;
    className?: string;
}

export function PokerPot({ amount, className = "" }: PokerPotProps) {
    return (
        <div className={`relative z-10 ${className}`}>
            <div className="relative bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-6 py-3 rounded-full shadow-xl">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur-sm opacity-70"></div>
                <div className="relative z-10 text-center">
                    <div className="text-sm font-bold">💰 POT</div>
                    <div className="text-xl font-black">
                        ${amount.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}
