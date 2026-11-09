"use client";

import { useState } from "react";
import { useTrips } from "@/context/TripsContext";
import { TripCard } from "./TripCard";
import { CreateTripForm } from "./CreateTripForm";
import type { Trip } from "@/types/trip";
import { ImportTripButton } from "./ImportTripButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function TripsDashboard() {
  const { trips, addTrip, isLoaded } = useTrips();
  const [isCreating, setIsCreating] = useState(false);

  function handleCreateTrip(trip: Trip) {
    addTrip(trip);
    setIsCreating(false);
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-muted">Your travel workspace</p>

            <h1 className="text-4xl font-bold text-foreground">My Trips</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ImportTripButton />

            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground"
            >
              + New Trip
            </button>
          </div>
        </header>

        {isCreating && (
          <div className="mb-8">
            <CreateTripForm
              onCreate={handleCreateTrip}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        )}

        {!isLoaded ? (
          <p className="text-muted">Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-surface p-12 text-center">
            <h2 className="text-xl font-semibold text-foreground">
              No trips yet
            </h2>
            <p className="mt-2 text-muted">
              Create your first trip to start planning.
            </p>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
