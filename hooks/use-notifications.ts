"use client";

import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

export type NotificationType =
    | "elimination"
    | "levelUp"
    | "break"
    | "warning"
    | "success"
    | "error"
    | "info";

export const useNotifications = () => {
    const { toast } = useToast();
    const { playSound } = useSounds();

    const notify = useCallback(
        (
            type: NotificationType,
            title: string,
            description?: string,
            duration?: number
        ) => {
            // Play appropriate sound
            switch (type) {
                case "elimination":
                    playSound("elimination");
                    break;
                case "levelUp":
                    playSound("levelUp");
                    break;
                case "success":
                    playSound("start");
                    break;
                case "warning":
                    playSound("pause");
                    break;
            }

            // Show toast with appropriate styling
            toast({
                title,
                description,
                duration: duration || 4000,
                className: getToastClassName(type),
            });
        },
        [toast, playSound]
    );

    const getToastClassName = (type: NotificationType): string => {
        switch (type) {
            case "elimination":
                return "border-red-500 bg-red-50 text-red-900";
            case "levelUp":
                return "border-blue-500 bg-blue-50 text-blue-900";
            case "break":
                return "border-purple-500 bg-purple-50 text-purple-900";
            case "warning":
                return "border-yellow-500 bg-yellow-50 text-yellow-900";
            case "success":
                return "border-green-500 bg-green-50 text-green-900";
            case "error":
                return "border-red-500 bg-red-50 text-red-900";
            default:
                return "border-gray-500 bg-gray-50 text-gray-900";
        }
    };

    const notifyElimination = (playerName: string, position: number) => {
        notify(
            "elimination",
            `${playerName} Eliminated!`,
            `Finished in ${position}${getOrdinalSuffix(position)} place`,
            6000
        );
    };

    const notifyLevelUp = (
        level: number,
        smallBlind: number,
        bigBlind: number
    ) => {
        notify(
            "levelUp",
            `Level ${level + 1} Started!`,
            `Blinds: ${smallBlind}/${bigBlind}`,
            5000
        );
    };

    const notifyBreak = (duration: number) => {
        notify(
            "break",
            "Break Time!",
            `${duration} minute break started`,
            8000
        );
    };

    const notifyTimeWarning = (timeLeft: number) => {
        notify(
            "warning",
            `${timeLeft} minutes remaining!`,
            "Current level ending soon",
            3000
        );
    };

    const notifyTournamentStart = () => {
        notify(
            "success",
            "Tournament Started!",
            "Good luck to all players",
            4000
        );
    };

    const notifyTournamentEnd = (winner?: string) => {
        notify(
            "success",
            "Tournament Finished!",
            winner ? `Congratulations ${winner}!` : "Great game everyone!",
            8000
        );
    };

    const getOrdinalSuffix = (num: number): string => {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return "st";
        if (j === 2 && k !== 12) return "nd";
        if (j === 3 && k !== 13) return "rd";
        return "th";
    };

    return {
        notify,
        notifyElimination,
        notifyLevelUp,
        notifyBreak,
        notifyTimeWarning,
        notifyTournamentStart,
        notifyTournamentEnd,
    };
};
