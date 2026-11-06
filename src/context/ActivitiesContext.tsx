"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
    useRef
} from "react";
import type { Activity } from "@/types/activity";

type ActivitiesContextType = {
    activities: Activity[];
    isLoaded: boolean;
    addActivity: (activity: Activity) => void;
    updateActivity: (id: string, updates: Partial<Activity>) => void;
    deleteActivity: (id: string) => void;
    undoDelete: () => void;
    lastDeletedActivity: Activity | null;
    deleteActivitiesByTripId: (tripId: string) => void;
    addActivities: (activities: Activity[]) => void;
};

const STORAGE_KEY = "travel-planner-activities";

const ActivitiesContext = createContext<ActivitiesContextType | null>(null);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [lastDeletedActivity, setLastDeletedActivity] =
        useState<Activity | null>(null);

    const undoTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);


    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setActivities(JSON.parse(saved) as Activity[]);
            }
        } catch (error) {
            console.error("Failed to load activities:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
        } catch (error) {
            console.error("Failed to save activities:", error);
        }
    }, [activities, isLoaded]);

    useEffect(() => {
        return () => {
            if (undoTimerRef.current !== null) {
                clearTimeout(undoTimerRef.current);
            }
        };
    }, []);

    function addActivity(activity: Activity) {
        setActivities((previous) => [...previous, activity]);
    }

    function updateActivity(id: string, updates: Partial<Activity>) {
        setActivities((previous) =>
            previous.map((activity) =>
                activity.id === id ? { ...activity, ...updates } : activity,
            ),
        );
    }

    function addActivities(newActivities: Activity[]) {
        setActivities((previous) => [
            ...previous,
            ...newActivities,
        ]);
    }


    function deleteActivity(id: string) {
        const activityToDelete = activities.find(
            (activity) => activity.id === id
        );

        if (!activityToDelete) return;

        if (undoTimerRef.current !== null) {
            clearTimeout(undoTimerRef.current);
        }

        setLastDeletedActivity(activityToDelete);

        setActivities((previous) =>
            previous.filter((activity) => activity.id !== id)
        );

        undoTimerRef.current = setTimeout(() => {
            setLastDeletedActivity(null);
            undoTimerRef.current = null;
        }, 6000);
    }

    function deleteActivitiesByTripId(tripId: string) {
        setActivities((previous) =>
            previous.filter(
                (activity) => activity.tripId !== tripId
            )
        );

        // Doesn't allow to restore activities if the trip has been deleted
        if (lastDeletedActivity?.tripId === tripId) {
            if (undoTimerRef.current !== null) {
                clearTimeout(undoTimerRef.current);
                undoTimerRef.current = null;
            }

            setLastDeletedActivity(null);
        }
    }


    function undoDelete() {
        if (!lastDeletedActivity) return;

        if (undoTimerRef.current !== null) {
            clearTimeout(undoTimerRef.current);
            undoTimerRef.current = null;
        }

        setActivities((previous) => {

            return [...previous, lastDeletedActivity];
        });

        setLastDeletedActivity(null);
    }

    return (
        <ActivitiesContext.Provider
            value={{
                activities,
                addActivity,
                updateActivity,
                deleteActivity,
                undoDelete,
                lastDeletedActivity,
                deleteActivitiesByTripId,
                addActivities,
                isLoaded
            }}
        >
            {children}
        </ActivitiesContext.Provider>
    );
}

export function useActivities() {
    const context = useContext(ActivitiesContext);

    if (!context) {
        throw new Error("useActivities must be used within ActivitiesProvider");
    }

    return context;
}

