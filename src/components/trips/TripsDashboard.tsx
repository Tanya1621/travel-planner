"use client";

import { useState } from "react";
import { useTrips } from "@/context/TripsContext";
import { TripCard } from "./TripCard";
import { CreateTripForm } from "./CreateTripForm";
import type { Trip } from "@/types/trip";
import { ImportTripButton } from "./ImportTripButton";

export function TripsDashboard() {
  const { trips, addTrip, isLoaded } = useTrips();
  const [isCreating, setIsCreating] = useState(false);

  function handleCreateTrip(trip: Trip) {
    addTrip(trip);
    setIsCreating(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-sm text-slate-500">Your travel workspace</p>

            <h1 className="text-4xl font-bold text-slate-900">My Trips</h1>
          </div>

          <div className="flex items-center gap-3">
            <ImportTripButton />

            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white"
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
          <p className="text-slate-500">Loading trips...</p>
        ) : trips.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No trips yet
            </h2>
            <p className="mt-2 text-slate-500">
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
