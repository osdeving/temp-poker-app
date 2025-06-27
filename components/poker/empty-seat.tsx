"use client";

interface EmptySeatProps {
    position: { x: number; y: number };
    seatNumber: number;
    className?: string;
}

export function EmptySeat({
    position,
    seatNumber,
    className = "",
}: EmptySeatProps) {
    return (
        <div
            className={`empty-seat-container absolute transform -translate-x-1/2 -translate-y-1/2 z-5 ${className}`}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
        >
            <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded-full bg-gray-800/20 flex items-center justify-center hover:border-gray-400 hover:bg-gray-700/30 transition-colors">
                <span className="text-gray-500 text-xs">{seatNumber}</span>
            </div>
        </div>
    );
}
