"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PokerTableDebugProps {
    children: React.ReactNode;
}

export function PokerTableDebug({ children }: PokerTableDebugProps) {
    const [showDebug, setShowDebug] = useState(false);

    return (
        <div className="relative">
            <Button
                onClick={() => setShowDebug(!showDebug)}
                className="absolute top-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white text-xs px-2 py-1"
            >
                {showDebug ? "Hide Debug" : "Show Debug"}
            </Button>

            {showDebug && (
                <div className="absolute inset-0 pointer-events-none z-40">
                    {/* Grid de debug */}
                    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-30">
                        {Array.from({ length: 100 }).map((_, i) => (
                            <div
                                key={i}
                                className="border border-red-400 text-red-400 text-xs flex items-center justify-center"
                            >
                                {i}
                            </div>
                        ))}
                    </div>

                    {/* Centro da mesa marcado */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>

                    {/* Info debug */}
                    <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
                        <div>Centro: 50%, 50%</div>
                        <div>Pot: Deve estar no centro</div>
                        <div>Cards: Abaixo do pot</div>
                    </div>
                </div>
            )}

            {children}
        </div>
    );
}
