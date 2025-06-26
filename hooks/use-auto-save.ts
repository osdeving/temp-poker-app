"use client";

import { useCallback, useEffect, useRef } from "react";
import { useNotifications } from "./use-notifications";

interface AutoSaveData {
    [key: string]: any;
}

export const useAutoSave = (
    data: AutoSaveData,
    key: string,
    intervalMs: number = 30000 // Auto-save every 30 seconds
) => {
    const { notify } = useNotifications();
    const lastSavedRef = useRef<string>("");
    const intervalRef = useRef<NodeJS.Timeout>();

    const saveData = useCallback(() => {
        const dataString = JSON.stringify(data);

        // Only save if data has changed
        if (dataString !== lastSavedRef.current) {
            try {
                localStorage.setItem(key, dataString);
                lastSavedRef.current = dataString;

                // Show subtle notification for auto-save
                notify(
                    "info",
                    "Auto-saved",
                    "Tournament data saved automatically",
                    2000
                );

                return true;
            } catch (error) {
                notify(
                    "error",
                    "Save Failed",
                    "Unable to save tournament data"
                );
                return false;
            }
        }
        return true;
    }, [data, key, notify]);

    const forceSave = useCallback(() => {
        return saveData();
    }, [saveData]);

    // Auto-save at intervals
    useEffect(() => {
        intervalRef.current = setInterval(saveData, intervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [saveData, intervalMs]);

    // Save when component unmounts
    useEffect(() => {
        return () => {
            saveData();
        };
    }, [saveData]);

    // Save when page is about to be unloaded
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            saveData();

            // If there are unsaved changes, show warning
            const dataString = JSON.stringify(data);
            if (dataString !== lastSavedRef.current) {
                e.preventDefault();
                e.returnValue =
                    "You have unsaved changes. Are you sure you want to leave?";
                return e.returnValue;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [data, saveData]);

    // Save when page becomes hidden (user switches tabs)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                saveData();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [saveData]);

    return {
        forceSave,
        isAutoSaveEnabled: true,
    };
};
