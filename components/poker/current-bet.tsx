"use client";

interface CurrentBetIndicatorProps {
    amount: number;
    className?: string;
}

export function CurrentBetIndicator({
    amount,
    className = "",
}: CurrentBetIndicatorProps) {
    if (amount <= 0) return null;

    return (
        <div className={`${className}`}>
            <div className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-lg text-xs border border-pink-500/50 shadow-lg backdrop-blur-sm">
                Aposta: ${amount}
            </div>
        </div>
    );
}
