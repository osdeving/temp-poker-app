"use client";

import { useCallback } from "react";

export type SoundType =
    | "elimination"
    | "levelUp"
    | "start"
    | "pause"
    | "finish"
    | "warning"
    | "chip"
    | "finalTable"
    | "winner";

export const useSounds = () => {
    const playSimpleSound = useCallback(
        (audioContext: AudioContext, frequency: number, duration: number) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(
                frequency,
                audioContext.currentTime
            );
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + duration / 1000
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        },
        []
    );

    const playEliminationSound = useCallback(
        (audioContext: AudioContext) => {
            // Dramatic elimination sound (descending notes)
            const notes = [440, 369, 293, 220];
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    playSimpleSound(audioContext, freq, 300);
                }, index * 200);
            });
        },
        [playSimpleSound]
    );

    const playLevelUpSound = useCallback(
        (audioContext: AudioContext) => {
            // Ascending notes for level up
            const notes = [440, 523, 659];
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    playSimpleSound(audioContext, freq, 200);
                }, index * 150);
            });
        },
        [playSimpleSound]
    );

    const playStartSound = useCallback(
        (audioContext: AudioContext) => {
            // Quick start sound
            playSimpleSound(audioContext, 523, 300);
        },
        [playSimpleSound]
    );

    const playFinishSound = useCallback(
        (audioContext: AudioContext) => {
            // Victory fanfare
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    playSimpleSound(audioContext, freq, 400);
                }, index * 200);
            });
        },
        [playSimpleSound]
    );

    const playWarningSound = useCallback(
        (audioContext: AudioContext) => {
            // Quick warning beeps
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    playSimpleSound(audioContext, 880, 100);
                }, i * 200);
            }
        },
        [playSimpleSound]
    );

    const playChipSound = useCallback(
        (audioContext: AudioContext) => {
            // Subtle chip sound
            playSimpleSound(audioContext, 1000, 100);
        },
        [playSimpleSound]
    );

    const playFinalTableSound = useCallback(
        (audioContext: AudioContext) => {
            // Special final table sound
            const notes = [659, 784, 880, 1047, 1319];
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    playSimpleSound(audioContext, freq, 300);
                }, index * 100);
            });
        },
        [playSimpleSound]
    );

    const playWinnerSound = useCallback(
        (audioContext: AudioContext) => {
            // Champion sound
            const notes = [523, 659, 784, 1047, 1319, 1568];
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    playSimpleSound(audioContext, freq, 500);
                }, index * 150);
            });
        },
        [playSimpleSound]
    );

    const playSound = useCallback(
        (type: SoundType) => {
            // Use Web Audio API for better browser compatibility
            if (typeof window !== "undefined" && "AudioContext" in window) {
                const audioContext = new (window.AudioContext ||
                    (window as any).webkitAudioContext)();

                switch (type) {
                    case "elimination":
                        playEliminationSound(audioContext);
                        break;
                    case "levelUp":
                        playLevelUpSound(audioContext);
                        break;
                    case "start":
                        playStartSound(audioContext);
                        break;
                    case "pause":
                        playSimpleSound(audioContext, 349, 200);
                        break;
                    case "finish":
                        playFinishSound(audioContext);
                        break;
                    case "warning":
                        playWarningSound(audioContext);
                        break;
                    case "chip":
                        playChipSound(audioContext);
                        break;
                    case "finalTable":
                        playFinalTableSound(audioContext);
                        break;
                    case "winner":
                        playWinnerSound(audioContext);
                        break;
                    default:
                        playSimpleSound(audioContext, 440, 300);
                }
            }
        },
        [
            playEliminationSound,
            playLevelUpSound,
            playStartSound,
            playFinishSound,
            playWarningSound,
            playChipSound,
            playFinalTableSound,
            playWinnerSound,
            playSimpleSound,
        ]
    );

    return { playSound };
};
