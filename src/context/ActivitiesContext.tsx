"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Activity } from "@/types/activity";

type ActivitiesContextType = {
  activities: Activity[];
  isLoaded: boolean;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
};

const STORAGE_KEY = "travel-planner-activities";

const ActivitiesContext = createContext<ActivitiesContextType | null>(null);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
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

  return (
    <ActivitiesContext.Provider
      value={{ activities, addActivity, updateActivity, isLoaded }}
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
