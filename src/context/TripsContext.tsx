"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Trip } from "@/types/trip";

type TripsContextType = {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  getTripById: (id: string) => Trip | undefined;
  isLoaded: boolean;
  deleteTrip: (id: string) => void;
};

const STORAGE_KEY = "travel-planner-trips";

const TripsContext = createContext<TripsContextType | null>(null);

export function TripsProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved trips when the application starts
  useEffect(() => {
    try {
      const savedTrips = localStorage.getItem(STORAGE_KEY);

      if (savedTrips) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrips(JSON.parse(savedTrips) as Trip[]);
      }
    } catch (error) {
      console.error("Failed to load trips:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save trips whenever they change
  useEffect(() => {
    if (!isLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (error) {
      console.error("Failed to save trips:", error);
    }
  }, [trips, isLoaded]);

  function addTrip(trip: Trip) {
    setTrips((prevTrips) => [...prevTrips, trip]);
  }

  function getTripById(id: string) {
    return trips.find((trip) => trip.id === id);
  }

  function deleteTrip(id: string) {
    setTrips((previous) =>
      previous.filter((trip) => trip.id !== id)
    );
  }

  return (
    <TripsContext.Provider value={{
      trips,
      addTrip,
      getTripById,
      deleteTrip,
      isLoaded
    }}>
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripsContext);

  if (!context) {
    throw new Error("useTrips must be used within TripsProvider");
  }

  return context;
}
