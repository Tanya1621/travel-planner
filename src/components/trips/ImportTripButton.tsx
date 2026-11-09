
"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Upload } from "lucide-react";

import { useTrips } from "@/context/TripsContext";
import { useActivities } from "@/context/ActivitiesContext";
import { importTripFromFile } from "@/lib/importTrip";

export function ImportTripButton() {
    const { trips, addTrip, isLoaded: tripsLoaded } = useTrips();

    const {
        addActivities,
        isLoaded: activitiesLoaded,
    } = useActivities();

    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isImporting, setIsImporting] = useState(false);

    async function handleImport(
        event: ChangeEvent<HTMLInputElement>,
    ) {
        const file = event.target.files?.[0];

        if (!file || !tripsLoaded || !activitiesLoaded) return;

        setError(null);
        setIsImporting(true);

        try {
            const { trip, activities } = await importTripFromFile(
                file,
                trips,
            );

            addActivities(activities);
            addTrip(trip);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to import trip.",
            );
        } finally {
            setIsImporting(false);
            event.target.value = "";
        }
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
            />

            <button
                type="button"
                disabled={!tripsLoaded || !activitiesLoaded || isImporting}
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-surface px-4 py-3 text-sm font-medium text-foreground-secondary hover:bg-background disabled:opacity-50"
            >
                <Upload size={16} />
                {isImporting ? "Importing..." : "Import JSON"}
            </button>

            {error && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
